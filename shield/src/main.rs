mod coalescer;
mod config;
mod history;
mod ids;
mod proto;
mod service;
mod store;

use crate::config::Config;
use crate::proto::shield::read_shield_server::ReadShieldServer;
use crate::service::ReadShieldService;
use crate::store::ScyllaBucketSource;
use std::sync::Arc;
use std::time::Duration;
use tonic::transport::Server;
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")),
        )
        .init();

    let config = Config::from_env()?;
    tracing::info!(
        listen = %config.listen_addr,
        nodes = ?config.scylla_nodes,
        "starting read shield"
    );

    let source = Arc::new(ScyllaBucketSource::connect(&config.scylla_nodes).await?);
    let address = config.listen_addr.parse()?;

    let service = ReadShieldService::new(
        source,
        Duration::from_secs(5),
        Duration::from_millis(config.query_timeout_ms),
        config.max_bucket_lookback,
    );

    Server::builder()
        .add_service(ReadShieldServer::new(service))
        .serve_with_shutdown(address, shutdown_signal())
        .await?;

    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install SIGTERM handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    tracing::info!("shutdown signal received");
}
