import type {
  StreamClientOptions,
  StreamEventType,
  StreamMessage,
} from './types';

/**
 * StreamClient wraps a native WebSocket with:
 *  - Typed message deserialization
 *  - Exponential back-off reconnect logic
 *  - A clean `close()` method that suppresses reconnects
 */
export class StreamClient {
  private ws: WebSocket | null = null;
  private retries = 0;
  private closed = false;

  private readonly url: string;
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;
  private readonly onMessage?: <T>(msg: StreamMessage<T>) => void;
  private readonly onOpen?: () => void;
  private readonly onFailed?: () => void;

  constructor(options: StreamClientOptions) {
    this.url = options.url;
    this.maxRetries = options.maxRetries ?? 5;
    this.retryDelayMs = options.retryDelayMs ?? 1000;
    this.onMessage = options.onMessage;
    this.onOpen = options.onOpen;
    this.onFailed = options.onFailed;

    this.connect();
  }

  /** Establish (or re-establish) the WebSocket connection. */
  private connect(): void {
    if (this.closed) return;

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.retries = 0;
      this.onOpen?.();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data as string) as StreamMessage<unknown>;
        this.onMessage?.(msg);
      } catch {
        console.warn('[StreamClient] Failed to parse message:', event.data);
      }
    };

    this.ws.onerror = (err) => {
      console.error('[StreamClient] WebSocket error', err);
    };

    this.ws.onclose = () => {
      if (this.closed) return;

      if (this.retries < this.maxRetries) {
        const delay = this.retryDelayMs * Math.pow(2, this.retries);
        this.retries += 1;
        console.info(
          `[StreamClient] Reconnecting in ${delay} ms (attempt ${this.retries}/${this.maxRetries})…`
        );
        setTimeout(() => this.connect(), delay);
      } else {
        console.error('[StreamClient] Max retries reached. Giving up.');
        this.onFailed?.();
      }
    };
  }

  /**
   * Send a raw object to the server.
   * Returns false if the socket is not currently open.
   */
  send(data: Record<string, unknown>): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  /**
   * Permanently close the connection.
   * No further reconnect attempts will be made.
   */
  close(): void {
    this.closed = true;
    this.ws?.close();
    this.ws = null;
  }

  /** Subscribe to a specific event type on the server side. */
  subscribe(eventType: StreamEventType): boolean {
    return this.send({ action: 'subscribe', eventType });
  }

  /** Unsubscribe from a specific event type. */
  unsubscribe(eventType: StreamEventType): boolean {
    return this.send({ action: 'unsubscribe', eventType });
  }

  /** True while the underlying socket reports OPEN. */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
