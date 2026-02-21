# NFT Mint Event Stream — Typed WebSocket Helpers

This directory provides reusable TypeScript interfaces and a `StreamClient` class for consuming real-time Somnia NFT mint events over WebSocket.

## Files

| File | Purpose |
|------|---------|
| `types.ts` | Shared interfaces for all stream event shapes |
| `StreamClient.ts` | WebSocket wrapper with typed messages and reconnect logic |
| `index.ts` | Public barrel export |
| `__tests__/StreamClient.test.ts` | Unit tests (Jest) |

## Quick Start

```ts
import { StreamClient } from './src/nft-stream';
import type { StreamMessage, NFTMintEvent } from './src/nft-stream';

const client = new StreamClient({
  url: 'wss://your-backend/stream',
  maxRetries: 5,
  retryDelayMs: 1000,
  onOpen: () => {
    console.log('Connected to Somnia stream');
    client.subscribe('NFT_MINTED');
  },
  onMessage: <T>(msg: StreamMessage<T>) => {
    if (msg.type === 'NFT_MINTED') {
      const mint = msg.payload as NFTMintEvent;
      console.log('New mint:', mint.tokenId, 'by', mint.recipient);
    }
  },
  onFailed: () => console.error('Stream connection failed permanently'),
});

// Later, when done:
client.close();
```

## Event Types

| `StreamEventType` | Payload interface |
|-------------------|-----------------|
| `NFT_MINTED` | `NFTMintEvent` |
| `NFT_TRANSFERRED` | `NFTTransferEvent` |
| `BID_PLACED` | `BidPlacedEvent` |
| `AUCTION_STARTED` | `AuctionStartedEvent` |
| `CONNECTED` | `{}` |
| `DISCONNECTED` | `{}` |
| `ERROR` | `{ message: string }` |

## Reconnect Behaviour

`StreamClient` uses **exponential back-off**: each failed reconnect attempt waits `retryDelayMs × 2^attempt` milliseconds before the next try. Once `maxRetries` is reached, `onFailed` is called and no further attempts are made.

## Running Tests

```bash
npm test
```
