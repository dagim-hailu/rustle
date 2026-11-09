use crate::history::{BucketSource, DbMessage, HistoryError};
use async_trait::async_trait;
use chrono::{DateTime, Utc};
use scylla::client::session::Session;
use scylla::client::session_builder::SessionBuilder;
use scylla::statement::prepared::PreparedStatement;
use std::time::Instant;

const WITH_CURSOR: &str = "
SELECT message_id, author_id, content, attachments
FROM primary_chat_space.messages_by_channel
WHERE channel_id = ? AND bucket_day = ? AND message_id < ?
ORDER BY message_id DESC
LIMIT ?
";

const WITHOUT_CURSOR: &str = "
SELECT message_id, author_id, content, attachments
FROM primary_chat_space.messages_by_channel
WHERE channel_id = ? AND bucket_day = ?
ORDER BY message_id DESC
LIMIT ?
";

pub struct ScyllaBucketSource {
    session: Session,
    with_cursor: PreparedStatement,
    without_cursor: PreparedStatement,
}

impl ScyllaBucketSource {
    pub async fn connect(nodes: &[String]) -> Result<Self, String> {
        let mut builder = SessionBuilder::new();

        for node in nodes {
            builder = builder.known_node(node);
        }

        let session = builder.build().await.map_err(|error| error.to_string())?;

        let with_cursor = session
            .prepare(WITH_CURSOR)
            .await
            .map_err(|error| format!("prepare cursor query: {error}"))?;

        let without_cursor = session
            .prepare(WITHOUT_CURSOR)
            .await
            .map_err(|error| format!("prepare latest query: {error}"))?;

        Ok(Self {
            session,
            with_cursor,
            without_cursor,
        })
    }
}

#[async_trait]
impl BucketSource for ScyllaBucketSource {
    async fn fetch_bucket(
        &self,
        channel_id: &[u8],
        bucket_start_ms: i64,
        before: Option<&[u8]>,
        limit: i32,
    ) -> Result<Vec<DbMessage>, HistoryError> {
        let bucket_day = DateTime::<Utc>::from_timestamp_millis(bucket_start_ms)
            .ok_or_else(|| HistoryError::Invalid("bucket timestamp out of range".into()))?;

        let started = Instant::now();

        let result = match before {
            Some(cursor) => {
                self.session
                    .execute_unpaged(
                        &self.with_cursor,
                        (channel_id, bucket_day, cursor, limit),
                    )
                    .await
            }
            None => {
                self.session
                    .execute_unpaged(&self.without_cursor, (channel_id, bucket_day, limit))
                    .await
            }
        }
        .map_err(|error| HistoryError::Store(error.to_string()))?;

        let rows_result = result
            .into_rows_result()
            .map_err(|error| HistoryError::Store(error.to_string()))?;

        let typed_rows = rows_result
            .rows::<(Vec<u8>, Vec<u8>, Option<String>, Option<Vec<String>>)>()
            .map_err(|error| HistoryError::Store(error.to_string()))?;

        let mut messages = Vec::new();

        for row in typed_rows {
            let (message_id, author_id, content, attachments) =
                row.map_err(|error| HistoryError::Store(error.to_string()))?;

            let timestamp_ms = crate::history::timestamp_for(&message_id).ok_or_else(|| {
                HistoryError::Store("stored message id is not 8-byte Snowflake".into())
            })?;

            messages.push(DbMessage {
                message_id,
                author_id,
                content: content.unwrap_or_default(),
                attachments: attachments.unwrap_or_default(),
                timestamp_ms,
            });
        }

        tracing::debug!(
            bucket = bucket_start_ms,
            rows = messages.len(),
            elapsed_ms = started.elapsed().as_millis(),
            "scylla bucket read"
        );

        Ok(messages)
    }
}
