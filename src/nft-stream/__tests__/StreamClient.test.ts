/**
 * Unit tests for StreamClient.
 *
 * We use a lightweight mock WebSocket so that no real network calls are made.
 */

import { StreamClient } from '../StreamClient';
import type { StreamMessage } from '../types';

// ---------------------------------------------------------------------------
// Mock WebSocket
// ---------------------------------------------------------------------------

type WsEvent = 'open' | 'message' | 'error' | 'close';

class MockWebSocket {
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState: number = MockWebSocket.OPEN;
  url: string;

  onopen: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  onclose: (() => void) | null = null;

  static lastInstance: MockWebSocket | null = null;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.lastInstance = this;
  }

  send(data: string): void {
    MockWebSocket._sent.push(data);
  }

  close(): void {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.();
  }

  /** Simulate an inbound message from the server. */
  simulateMessage(data: unknown): void {
    this.onmessage?.({ data: JSON.stringify(data) });
  }

  /** Simulate connection open. */
  simulateOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.();
  }

  /** Simulate a server-side close (triggers reconnect logic). */
  simulateClose(): void {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.();
  }

  static _sent: string[] = [];
  static reset(): void {
    MockWebSocket._sent = [];
    MockWebSocket.lastInstance = null;
  }
}

// Inject mock into global scope before importing StreamClient
(globalThis as unknown as Record<string, unknown>).WebSocket = MockWebSocket;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  MockWebSocket.reset();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('StreamClient', () => {
  it('creates a WebSocket connection to the provided URL', () => {
    const client = new StreamClient({ url: 'wss://test.example.com/stream' });
    expect(MockWebSocket.lastInstance?.url).toBe('wss://test.example.com/stream');
    client.close();
  });

  it('calls onOpen callback when the socket opens', () => {
    const onOpen = jest.fn();
    const client = new StreamClient({ url: 'wss://test.example.com/stream', onOpen });
    MockWebSocket.lastInstance?.simulateOpen();
    expect(onOpen).toHaveBeenCalledTimes(1);
    client.close();
  });

  it('parses inbound JSON and calls onMessage with typed payload', () => {
    const onMessage = jest.fn();
    const client = new StreamClient({
      url: 'wss://test.example.com/stream',
      onMessage,
    });

    const msg: StreamMessage<{ tokenId: string }> = {
      type: 'NFT_MINTED',
      payload: { tokenId: '42' },
      serverTime: new Date().toISOString(),
    };

    MockWebSocket.lastInstance?.simulateOpen();
    MockWebSocket.lastInstance?.simulateMessage(msg);

    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onMessage.mock.calls[0][0]).toEqual(msg);
    client.close();
  });

  it('sends subscribe message via send()', () => {
    const client = new StreamClient({ url: 'wss://test.example.com/stream' });
    MockWebSocket.lastInstance?.simulateOpen();
    const sent = client.subscribe('NFT_MINTED');
    expect(sent).toBe(true);
    const parsed = JSON.parse(MockWebSocket._sent[0]);
    expect(parsed).toEqual({ action: 'subscribe', eventType: 'NFT_MINTED' });
    client.close();
  });

  it('returns false from send() when socket is not open', () => {
    const client = new StreamClient({ url: 'wss://test.example.com/stream' });
    // readyState defaults to OPEN in mock — force it closed
    if (MockWebSocket.lastInstance) {
      MockWebSocket.lastInstance.readyState = MockWebSocket.CLOSED;
    }
    const sent = client.send({ foo: 'bar' });
    expect(sent).toBe(false);
    client.close();
  });

  it('attempts to reconnect with back-off after unexpected close', () => {
    const onOpen = jest.fn();
    const client = new StreamClient({
      url: 'wss://test.example.com/stream',
      onOpen,
      maxRetries: 3,
      retryDelayMs: 100,
    });

    const firstInstance = MockWebSocket.lastInstance!;
    firstInstance.simulateOpen(); // retries reset to 0

    // Simulate unexpected close — should schedule reconnect
    firstInstance.simulateClose();

    // Advance timers by the first back-off delay (100 * 2^0 = 100 ms)
    jest.advanceTimersByTime(100);

    const secondInstance = MockWebSocket.lastInstance!;
    expect(secondInstance).not.toBe(firstInstance);
    secondInstance.simulateOpen();
    expect(onOpen).toHaveBeenCalledTimes(2);

    client.close();
  });

  it('calls onFailed when max retries are exhausted', () => {
    const onFailed = jest.fn();
    const client = new StreamClient({
      url: 'wss://test.example.com/stream',
      maxRetries: 1,
      retryDelayMs: 50,
      onFailed,
    });

    // First close → 1 retry scheduled
    MockWebSocket.lastInstance?.simulateClose();
    jest.advanceTimersByTime(50);

    // Second close → retries exhausted
    MockWebSocket.lastInstance?.simulateClose();

    expect(onFailed).toHaveBeenCalledTimes(1);
    client.close();
  });

  it('does NOT reconnect after client.close() is called', () => {
    const client = new StreamClient({
      url: 'wss://test.example.com/stream',
      maxRetries: 5,
      retryDelayMs: 50,
    });

    const firstInstance = MockWebSocket.lastInstance!;
    client.close(); // marks closed = true and calls ws.close()

    // Advance timers — no new WebSocket should be created
    jest.advanceTimersByTime(5000);
    expect(MockWebSocket.lastInstance).toBe(firstInstance);
  });
});
