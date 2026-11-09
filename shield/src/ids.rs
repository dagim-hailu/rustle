//! Snowflake time and fixed ten-day bucket arithmetic shared with the gateway.

pub const SNOWFLAKE_EPOCH_MS: i64 = 1_704_067_200_000;
pub const SNOWFLAKE_TIMESTAMP_SHIFT: u32 = 22;
pub const BUCKET_MS: i64 = 10 * 24 * 60 * 60 * 1_000;

pub fn timestamp_from_snowflake(id: u64) -> i64 {
    ((id >> SNOWFLAKE_TIMESTAMP_SHIFT) as i64) + SNOWFLAKE_EPOCH_MS
}

pub fn timestamp_from_blob(id: &[u8]) -> Result<i64, ()> {
    if id.len() != 8 {
        return Err(());
    }
    let mut bytes = [0_u8; 8];
    bytes.copy_from_slice(id);
    Ok(timestamp_from_snowflake(u64::from_be_bytes(bytes)))
}

pub fn bucket_start_ms(timestamp_ms: i64) -> i64 {
    timestamp_ms.div_euclid(BUCKET_MS) * BUCKET_MS
}

pub fn bucket_from_snowflake(id: &[u8]) -> Result<i64, ()> {
    timestamp_from_blob(id).map(bucket_start_ms)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bucket_anchors_and_boundaries() {
        assert_eq!(bucket_start_ms(0), 0);
        assert_eq!(bucket_start_ms(BUCKET_MS - 1), 0);
        assert_eq!(bucket_start_ms(BUCKET_MS), BUCKET_MS);
    }

    #[test]
    fn snowflake_round_trip_to_bucket() {
        let ts = SNOWFLAKE_EPOCH_MS + 47 * 24 * 60 * 60 * 1000;
        let id = (((ts - SNOWFLAKE_EPOCH_MS) as u64) << SNOWFLAKE_TIMESTAMP_SHIFT) | 7;
        let blob = id.to_be_bytes();
        assert_eq!(timestamp_from_blob(&blob).unwrap(), ts);
        assert_eq!(bucket_from_snowflake(&blob).unwrap(), bucket_start_ms(ts));
    }
}
