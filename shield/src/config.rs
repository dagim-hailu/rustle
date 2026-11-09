use std::env;

#[derive(Clone, Debug)]
pub struct Config {
    pub listen_addr: String,
    pub scylla_nodes: Vec<String>,
    pub max_bucket_lookback: u64,
    pub query_timeout_ms: u64,
}

impl Config {
    pub fn from_env() -> Result<Self, String> {
        let listen_addr = env::var("SHIELD_ADDR").unwrap_or_else(|_| "0.0.0.0:50051".into());

        let scylla_nodes = env::var("SCYLLA_NODES")
            .unwrap_or_else(|_| "scylla-1:9042,scylla-2:9042,scylla-3:9042".into())
            .split(',')
            .map(str::trim)
            .filter(|node| !node.is_empty())
            .map(ToOwned::to_owned)
            .collect::<Vec<_>>();

        if scylla_nodes.is_empty() {
            return Err("SCYLLA_NODES must contain at least one node".into());
        }

        let max_bucket_lookback = parse_u64("MAX_BUCKET_LOOKBACK", 1_000)?;
        let query_timeout_ms = parse_u64("QUERY_TIMEOUT_MS", 7_000)?;

        Ok(Self {
            listen_addr,
            scylla_nodes,
            max_bucket_lookback,
            query_timeout_ms,
        })
    }
}

fn parse_u64(name: &str, default: u64) -> Result<u64, String> {
    match env::var(name) {
        Ok(value) => value
            .parse::<u64>()
            .map_err(|_| format!("{name} must be an unsigned integer")),
        Err(_) => Ok(default),
    }
}
