CREATE KEYSPACE primary_chat_space
WITH replication = {'class': 'NetworkTopologyStrategy', 'us-east': 3};

CREATE TABLE primary_chat_space.messages_by_channel (
    channel_id blob,
    bucket_day timestamp,
    message_id blob,
    author_id blob,
    content text,
    attachments list<text>,
    PRIMARY KEY ((channel_id, bucket_day), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);
