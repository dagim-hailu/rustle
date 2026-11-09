use crate::coalescer::Coalescer;
use crate::history::{fetch_history, BucketSource, HistoryError, HistoryPage, HistoryParams};
use crate::proto::shield::read_shield_server::ReadShield;
use crate::proto::shield::{GetHistoryRequest, GetHistoryResponse, StoredMessage};
use std::hash::{Hash, Hasher};
use std::sync::Arc;
use std::time::Duration;
use tonic::{Request, Response, Status};

#[derive(Clone, Debug, Eq)]
struct QueryKey {
    channel_id: Vec<u8>,
    before: Option<Vec<u8>>,
    limit: usize,
}

impl PartialEq for QueryKey {
    fn eq(&self, other: &Self) -> bool {
        self.channel_id == other.channel_id
            && self.before == other.before
            && self.limit == other.limit
    }
}

impl Hash for QueryKey {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.channel_id.hash(state);
        self.before.hash(state);
        self.limit.hash(state);
    }
}

pub struct ReadShieldService {
    source: Arc<dyn BucketSource>,
    coalescer: Arc<Coalescer<QueryKey, HistoryPage>>,
    max_lookback: u64,
    query_timeout: Duration,
}

impl ReadShieldService {
    pub fn new(
        source: Arc<dyn BucketSource>,
        coalesce_wait: Duration,
        query_timeout: Duration,
        max_lookback: u64,
    ) -> Self {
        Self {
            source,
            coalescer: Arc::new(Coalescer::new(coalesce_wait)),
            max_lookback,
            query_timeout,
        }
    }
}

#[tonic::async_trait]
impl ReadShield for ReadShieldService {
    async fn get_history(
        &self,
        request: Request<GetHistoryRequest>,
    ) -> Result<Response<GetHistoryResponse>, Status> {
        let request = request.into_inner();

        if request.channel_id.len() != 16 {
            return Err(Status::invalid_argument("channel_id must be 16 bytes"));
        }

        if !(1..=100).contains(&request.limit) {
            return Err(Status::invalid_argument("limit must be between 1 and 100"));
        }

        let before = if request.before_message_id.is_empty() {
            None
        } else if request.before_message_id.len() == 8 {
            Some(request.before_message_id)
        } else {
            return Err(Status::invalid_argument(
                "before_message_id must be empty or 8 bytes",
            ));
        };

        let response_channel_id = request.channel_id.clone();
        let key = QueryKey {
            channel_id: request.channel_id.clone(),
            before: before.clone(),
            limit: request.limit as usize,
        };

        let params = HistoryParams {
            channel_id: request.channel_id,
            before,
            limit: request.limit as usize,
            current_time_ms: chrono::Utc::now().timestamp_millis(),
        };

        let source = Arc::clone(&self.source);
        let max_lookback = self.max_lookback;

        let page = self
            .coalescer
            .run(key, || async move {
                match tokio::time::timeout(
                    self.query_timeout,
                    fetch_history(source.as_ref(), &params, max_lookback),
                )
                .await
                {
                    Ok(Ok(page)) => Ok(page),
                    Ok(Err(HistoryError::Invalid(message))) => {
                        Err(Status::invalid_argument(message))
                    }
                    Ok(Err(HistoryError::Store(error))) => {
                        tracing::error!(error = %error, "history read failed");
                        Err(Status::unavailable("message store unavailable"))
                    }
                    Err(_) => Err(Status::deadline_exceeded("history read timed out")),
                }
            })
            .await?;

        Ok(Response::new(page_to_response(page, response_channel_id)))
    }
}

fn page_to_response(page: HistoryPage, channel_id: Vec<u8>) -> GetHistoryResponse {
    GetHistoryResponse {
        messages: page
            .messages
            .into_iter()
            .map(|message| StoredMessage {
                message_id: message.message_id,
                channel_id: channel_id.clone(),
                author_id: message.author_id,
                content: message.content,
                attachments: message.attachments,
                timestamp_ms: message.timestamp_ms,
            })
            .collect(),
        next_cursor: page.next_cursor,
        has_more: page.has_more,
    }
}
