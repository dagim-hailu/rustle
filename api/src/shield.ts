import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

export interface ShieldHistoryRequest {
  channelId: string;
  before: bigint | null;
  limit: number;
}

export interface ShieldStoredMessage {
  message_id: Buffer;
  channel_id: Buffer;
  author_id: Buffer;
  content: string;
  attachments: string[];
  timestamp_ms: number;
}

export interface ShieldHistoryResponse {
  messages: ShieldStoredMessage[];
  next_cursor: Buffer;
  has_more: boolean;
}

interface RawClient extends grpc.Client {
  getHistory(
    request: { channel_id: Buffer; before_message_id: Buffer; limit: number },
    options: grpc.CallOptions,
    callback: (error: grpc.ServiceError | null, response?: ShieldHistoryResponse) => void
  ): grpc.ClientUnaryCall;
}

export class ShieldUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShieldUnavailableError";
  }
}

export class ShieldClient {
  private readonly client: RawClient;

  constructor(address: string, protoPath: string) {
    const definition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      // The shield's only int64 is an epoch-millisecond timestamp, which is
      // far below Number.MAX_SAFE_INTEGER. Message ids cross the boundary as
      // bytes, so no 64-bit identifier is ever converted to a JS Number here.
      longs: Number,
      enums: String,
      defaults: true,
      oneofs: true
    });

    const loaded = grpc.loadPackageDefinition(definition) as unknown as {
      shield: { v1: { ReadShield: grpc.ServiceClientConstructor } };
    };

    this.client = new loaded.shield.v1.ReadShield(
      address,
      grpc.credentials.createInsecure()
    ) as unknown as RawClient;
  }

  async getHistory(
    request: ShieldHistoryRequest,
    timeoutMs = 5_000
  ): Promise<ShieldHistoryResponse> {
    const before = Buffer.alloc(8);
    if (request.before !== null) {
      if (request.before <= 0n || request.before >= 1n << 64n) {
        throw new Error("invalid cursor");
      }
      before.writeBigUInt64BE(request.before);
    }

    const channelId = Buffer.from(request.channelId.replaceAll("-", ""), "hex");
    if (channelId.length !== 16) throw new Error("invalid channel id");

    return new Promise<ShieldHistoryResponse>((resolve, reject) => {
      this.client.getHistory(
        {
          channel_id: channelId,
          before_message_id: request.before === null ? Buffer.alloc(0) : before,
          limit: request.limit
        },
        { deadline: Date.now() + timeoutMs },
        (error, response) => {
          if (error) {
            reject(new ShieldUnavailableError(error.details || error.message));
            return;
          }
          if (!response) {
            reject(new ShieldUnavailableError("empty shield response"));
            return;
          }
          resolve(response);
        }
      );
    });
  }

  close(): void {
    this.client.close();
  }
}
