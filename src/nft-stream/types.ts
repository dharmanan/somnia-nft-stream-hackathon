/**
 * TypeScript interfaces for Somnia NFT mint event streams.
 */

export interface SomniaNetworkConfig {
  chainId: string;
  chainName: string;
  rpcUrl: string;
  blockExplorerUrl: string;
}

export interface NFTMintEvent {
  /** Transaction hash of the mint */
  txHash: string;
  /** Block number in which the mint occurred */
  blockNumber: number;
  /** Unix timestamp (seconds) of the block */
  timestamp: number;
  /** Contract address of the NFT collection */
  contractAddress: string;
  /** Token ID that was minted */
  tokenId: string;
  /** Wallet address that received the NFT */
  recipient: string;
  /** Optional metadata URI attached to the token */
  tokenUri?: string;
}

export interface NFTTransferEvent {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  contractAddress: string;
  tokenId: string;
  from: string;
  to: string;
}

export interface BidPlacedEvent {
  auctionId: string;
  bidder: string;
  bidAmount: string;
  timestamp: number;
}

export interface AuctionStartedEvent {
  auctionId: string;
  seller: string;
  startTime: number;
  endTime: number;
}

export type StreamEventType =
  | 'NFT_MINTED'
  | 'NFT_TRANSFERRED'
  | 'BID_PLACED'
  | 'AUCTION_STARTED'
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'ERROR';

export interface StreamMessage<T = unknown> {
  type: StreamEventType;
  payload: T;
  /** ISO-8601 timestamp set by the server when the message was emitted */
  serverTime: string;
}

export interface StreamClientOptions {
  /** WebSocket endpoint, e.g. wss://api.example.com/stream */
  url: string;
  /**
   * Maximum number of reconnect attempts before giving up.
   * Defaults to 5.
   */
  maxRetries?: number;
  /**
   * Base delay in milliseconds for exponential back-off.
   * Defaults to 1000 ms.
   */
  retryDelayMs?: number;
  /** Called when a typed message arrives. */
  onMessage?: <T>(msg: StreamMessage<T>) => void;
  /** Called when the connection opens (including reconnects). */
  onOpen?: () => void;
  /** Called after all retries are exhausted. */
  onFailed?: () => void;
}
