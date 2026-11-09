//! Coalesces concurrent identical reads into one upstream execution.

use dashmap::mapref::entry::Entry;
use dashmap::DashMap;
use std::future::Future;
use std::hash::Hash;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::broadcast;
use tonic::Status;

pub struct Coalescer<K, V> {
    inflight: Arc<DashMap<K, broadcast::Sender<Result<V, Status>>>>,
    wait_timeout: Duration,
}

enum Role<V> {
    Leader(broadcast::Sender<Result<V, Status>>),
    Follower(broadcast::Receiver<Result<V, Status>>),
}

impl<K, V> Coalescer<K, V>
where
    K: Eq + Hash + Clone,
    V: Clone,
{
    pub fn new(wait_timeout: Duration) -> Self {
        Self {
            inflight: Arc::new(DashMap::new()),
            wait_timeout,
        }
    }

    pub async fn run<F, Fut>(&self, key: K, load: F) -> Result<V, Status>
    where
        F: FnOnce() -> Fut,
        Fut: Future<Output = Result<V, Status>>,
    {
        let role = match self.inflight.entry(key.clone()) {
            Entry::Occupied(entry) => Role::Follower(entry.get().subscribe()),
            Entry::Vacant(entry) => {
                let (tx, _) = broadcast::channel(1);
                entry.insert(tx.clone());
                Role::Leader(tx)
            }
        };

        match role {
            Role::Follower(mut rx) => match tokio::time::timeout(self.wait_timeout, rx.recv()).await
            {
                Ok(Ok(result)) => result,
                Ok(Err(_)) => Err(Status::unavailable("read coalescer closed")),
                Err(_) => Err(Status::deadline_exceeded("waiting for coalesced read timed out")),
            },
            Role::Leader(tx) => {
                let guard = InflightGuard {
                    map: Arc::clone(&self.inflight),
                    key,
                };

                let result = load().await;
                let _ = tx.send(result.clone());
                drop(guard);
                result
            }
        }
    }
}

struct InflightGuard<K: Eq + std::hash::Hash, V> {
    map: Arc<DashMap<K, broadcast::Sender<Result<V, Status>>>>,
    key: K,
}

impl<K, V> Drop for InflightGuard<K, V>
where
    K: Eq + Hash,
{
    fn drop(&mut self) {
        self.map.remove(&self.key);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::atomic::{AtomicUsize, Ordering};
    use tokio::sync::Barrier;

    #[tokio::test]
    async fn many_identical_requests_share_one_upstream_read() {
        let coalescer = Arc::new(Coalescer::<String, u64>::new(Duration::from_secs(2)));
        let calls = Arc::new(AtomicUsize::new(0));
        let barrier = Arc::new(Barrier::new(12));
        let mut tasks = Vec::new();

        for _ in 0..12 {
            let coalescer = Arc::clone(&coalescer);
            let calls = Arc::clone(&calls);
            let barrier = Arc::clone(&barrier);

            tasks.push(tokio::spawn(async move {
                barrier.wait().await;
                coalescer
                    .run("hot-channel".to_string(), || async move {
                        calls.fetch_add(1, Ordering::SeqCst);
                        tokio::time::sleep(Duration::from_millis(40)).await;
                        Ok(99_u64)
                    })
                    .await
            }));
        }

        for task in tasks {
            assert_eq!(task.await.unwrap().unwrap(), 99);
        }

        assert_eq!(calls.load(Ordering::SeqCst), 1);
    }
}
