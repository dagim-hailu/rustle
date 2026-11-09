import { describe, expect, it } from "vitest";
import { decodeClientFrame, encodeClientFrame, PRESENCE_TO_WIRE } from "./protocol";

describe("binary WebSocket protocol", () => {
  it("serializes authentication as protobuf, not JSON", () => {
    const bytes = encodeClientFrame(
      { authenticate: { token: "token-value", clientVersion: "test" } },
      "request-1"
    );

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(new TextDecoder().decode(bytes)).not.toContain("{");

    const decoded = decodeClientFrame(bytes);
    expect(decoded.requestId).toBe("request-1");
    expect(decoded.payload).toBe("authenticate");
    expect(decoded.authenticate?.token).toBe("token-value");
  });

  it("serializes a send with its client idempotency key", () => {
    const clientId = "1900000000000000123";
    const bytes = encodeClientFrame(
      {
        sendMessage: {
          channelId: "33333333-3333-4333-8333-333333333333",
          content: "ሰላም",
          attachments: [],
          clientId
        }
      },
      "request-2"
    );

    const decoded = decodeClientFrame(bytes);
    expect(decoded.payload).toBe("sendMessage");
    expect(decoded.sendMessage?.clientId).toBe(clientId);
    expect(decoded.sendMessage?.content).toBe("ሰላም");
  });

  it("encodes presence as numeric enum values, including DND", () => {
    expect(PRESENCE_TO_WIRE.online).toBe(1);
    expect(PRESENCE_TO_WIRE.idle).toBe(2);
    expect(PRESENCE_TO_WIRE.dnd).toBe(3);
    expect(PRESENCE_TO_WIRE.offline).toBe(4);

    const bytes = encodeClientFrame(
      { setPresence: { status: PRESENCE_TO_WIRE.dnd } },
      "request-3"
    );
    const decoded = decodeClientFrame(bytes);
    expect(decoded.payload).toBe("setPresence");
    expect(decoded.setPresence?.status).toBe("PRESENCE_STATUS_DO_NOT_DISTURB");
  });
});
