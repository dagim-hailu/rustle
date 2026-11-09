//! Keyset pagination across fixed ten-day Scylla partitions.

use crate::ids::{bucket_from_snowflake, bucket_start_ms, timestamp_from_blob, BUCKET_MS};
use async_trait::async_trait;
use thiserror::Error;

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct DbMessage {
    pub message_id: Vec<u8>,
    pub author_id: Vec<u8>,
    pub content: String,
    pub attachments: Vec<String>,
    pub timestamp_ms: i64,
}

#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct HistoryPage {
    /// Newest first.
    pub messages: Vec<DbMessage>,
    pub next_cursor: Vec<u8>,
    pub has_more: bool,
}

#[derive(Clone, Debug)]
pub struct HistoryParams {
    pub channel_id: Vec<u8>,
    pub before: Option<Vec<u8>>,
    pub limit: usize,
    pub current_time_ms: i64,
}

#[derive(Debug, Error)]
pub enum HistoryError {
    #[error("invalid request: {0}")]
    Invalid(String),
    #[error("message store unavailable: {0}")]
    Store(String),
}

#[async_trait]
pub trait BucketSource: Send + Sync {
    async fn fetch_bucket(
        &self,
        channel_id: &[u8],
        bucket_start_ms: i64,
        before: Option<&[u8]>,
        limit: i32,
    ) -> Result<Vec<DbMessage>, HistoryError>;
}

/// Fetch up to `limit` messages older than the cursor, walking backwards across
/// ten-day partitions. One extra row is read to determine `has_more` without
/// an offset or a count query.
pub async fn fetch_history(
    source: &dyn BucketSource,
    params: &HistoryParams,
    max_lookback: u64,
) -> Result<HistoryPage, HistoryError> {
    if params.channel_id.len() != 16 {
        return Err(HistoryError::Invalid("channel_id must be 16 bytes".into()));
    }
    if !(1..=100).contains(&params.limit) {
        return Err(HistoryError::Invalid("limit must be between 1 and 100".into()));
    }

    let start_bucket = match params.before.as_deref() {
        Some(cursor) => bucket_from_snowflake(cursor)
            .map_err(|_| HistoryError::Invalid("cursor must be an 8-byte Snowflake id".into()))?,
        None => bucket_start_ms(params.current_time_ms),
    };

    let target = params.limit + 1;
    let mut collected = Vec::with_capacity(target);

    for offset in 0..max_lookback {
        let bucket = start_bucket - (offset as i64 * BUCKET_MS);
        let remaining = target.saturating_sub(collected.len());

        if remaining == 0 {
            break;
        }

        let cursor = if offset == 0 {
            params.before.as_deref()
        } else {
            None
        };

        let rows = source
            .fetch_bucket(&params.channel_id, bucket, cursor, remaining as i32)
            .await?;

        collected.extend(rows);

        if collected.len() >= target {
            break;
        }
    }

    // Even though bucket order and clustering order both descend, sorting here
    // makes the contract explicit and protects against a misbehaving source.
    collected.sort_by(|a, b| b.message_id.cmp(&a.message_id));

    let has_more = collected.len() > params.limit;
    collected.truncate(params.limit);

    let next_cursor = collected
        .last()
        .map(|message| message.message_id.clone())
        .unwrap_or_default();

    Ok(HistoryPage {
        messages: collected,
        next_cursor,
        has_more,
    })
}

pub fn timestamp_for(message_id: &[u8]) -> Option<i64> {
    timestamp_from_blob(message_id).ok()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ids::{BUCKET_MS, SNOWFLAKE_EPOCH_MS};
    use std::collections::HashMap;
    use std::sync::Mutex;

    const CHANNEL: [u8; 16] = [
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff,
        0x01,
    ];

    struct FakeSource {
        by_bucket: Mutex<HashMap<i64, Vec<DbMessage>>>,
    }

    #[async_trait]
    impl BucketSource for FakeSource {
        async fn fetch_bucket(
            &self,
            channel_id: &[u8],
            bucket: i64,
            before: Option<&[u8]>,
            limit: i32,
        ) -> Result<Vec<DbMessage>, HistoryError> {
            assert_eq!(channel_id, CHANNEL);
            let mut rows = self
                .by_bucket
                .lock()
                .unwrap()
                .get(&bucket)
                .cloned()
                .unwrap_or_default();

            rows.sort_by(|a, b| b.message_id.cmp(&a.message_id));

            if let Some(cursor) = before {
                rows.retain(|row| row.message_id.as_slice() < cursor);
            }

            rows.truncate(limit as usize);
            Ok(rows)
        }
    }

    fn snowflake(timestamp_ms: i64, sequence: u64) -> u64 {
        (((timestamp_ms - SNOWFLAKE_EPOCH_MS) as u64) << 22) | sequence
    }

    fn message(timestamp_ms: i64, sequence: u64) -> DbMessage {
        let id = snowflake(timestamp_ms, sequence);
        DbMessage {
            message_id: id.to_be_bytes().to_vec(),
            author_id: vec![9_u8; 16],
            content: format!("message-{timestamp_ms}-{sequence}"),
            attachments: Vec::new(),
            timestamp_ms,
        }
    }

    #[tokio::test]
    async fn paginates_across_bucket_boundaries_with_keyset_cursors() {
        let day = 24 * 60 * 60 * 1_000_i64;
        let a = message(SNOWFLAKE_EPOCH_MS + day, 1);
        let b = message(SNOWFLAKE_EPOCH_MS + 11 * day, 1);
        let c = message(SNOWFLAKE_EPOCH_MS + 21 * day, 1);
        let cursor_only = message(SNOWFLAKE_EPOCH_MS + 31 * day, 1);

        let mut by_bucket = HashMap::new();
        for message in [a.clone(), b.clone(), c.clone()] {
            by_bucket
                .entry(bucket_start_ms(message.timestamp_ms))
                .or_insert_with(Vec::new)
                .push(message);
        }

        let source = FakeSource {
            by_bucket: Mutex::new(by_bucket),
        };

        let first = fetch_history(
            &source,
            &HistoryParams {
                channel_id: CHANNEL.to_vec(),
                before: Some(cursor_only.message_id.clone()),
                limit: 2,
                current_time_ms: 0,
            },
            20,
        )
        .await
        .unwrap();

        assert_eq!(first.messages, vec![c.clone(), b.clone()]);
        assert!(first.has_more);
        assert_eq!(first.next_cursor, b.message_id);
        assert_ne!(
            bucket_start_ms(c.timestamp_ms),
            bucket_start_ms(b.timestamp_ms)
        );

        let second = fetch_history(
            &source,
            &HistoryParams {
                channel_id: CHANNEL.to_vec(),
                before: Some(first.next_cursor.clone()),
                limit: 2,
                current_time_ms: 0,
            },
            20,
        )
        .await
        .unwrap();

        assert_eq!(second.messages, vec![a]);
        assert!(!second.has_more);
        assert!(!second.next_cursor.is_empty());
    }

    #[tokio::test]
    async fn same_bucket_is_ordered_by_snowflake_descending() {
        let base = SNOWFLAKE_EPOCH_MS + 2 * 24 * 60 * 60 * 1_000;
        let older = message(base + 1_000, 1);
        let newer = message(base + 2_000, 1);

        let source = FakeSource {
            by_bucket: Mutex::new(HashMap::from([(
                bucket_start_ms(base),
                vec![older.clone(), newer.clone()],
            )])),
        };

        let page = fetch_history(
            &source,
            &HistoryParams {
                channel_id: CHANNEL.to_vec(),
                before: None,
                limit: 50,
                current_time_ms: newer.timestamp_ms,
            },
            10,
        )
        .await
        .unwrap();

        assert_eq!(page.messages, vec![newer, older]);
        assert!(!page.has_more);
    }

    #[test]
    fn bucket_ms_is_ten_days() {
        assert_eq!(BUCKET_MS, 10 * 24 * 60 * 60 * 1_000);
    }
}
