#!/bin/sh
set -eu

echo "Waiting for the three Scylla nodes to form the us-east cluster..."

attempt=0
while [ "$attempt" -lt 120 ]; do
  if cqlsh scylla-1 9042 -e "SELECT now() FROM system.local" >/dev/null 2>&1; then
    peers="$(
      cqlsh scylla-1 9042 -e "SELECT count(*) FROM system.peers;" 2>/dev/null \
        | awk '/^[[:space:]]*[0-9]+[[:space:]]*$/ { gsub(/[[:space:]]/, "", $0); print; exit }'
    )"
    if [ "${peers:-}" = "2" ]; then
      echo "All three Scylla nodes are visible."
      break
    fi
  fi

  attempt=$((attempt + 1))
  sleep 5
done

if [ "${peers:-}" != "2" ]; then
  echo "Timed out waiting for a three-node Scylla cluster." >&2
  exit 1
fi

# Give gossip a moment to settle so NetworkTopologyStrategy us-east:3 can place
# the first table without a schema disagreement.
sleep 10

if cqlsh scylla-1 9042 -e "DESCRIBE TABLE primary_chat_space.messages_by_channel" >/dev/null 2>&1; then
  echo "Scylla schema already exists; skipping apply."
else
  echo "Applying Scylla schema..."
  cqlsh scylla-1 9042 -f /schema/schema.cql
fi

echo "Verifying schema..."
cqlsh scylla-1 9042 -e "SELECT table_name FROM system_schema.tables WHERE keyspace_name = 'primary_chat_space';"
echo "Scylla schema is ready."
