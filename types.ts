export interface NFT {
  id: number;
  title: string;
  creator: string;
  creatorAvatar: string;
  imageUrl: string;
  currentBid: number;
  endDate: Date;
  likes: number;
}

export interface Seller {
  id: number;
  name: string;
  avatar: string;
  sales: number;
}

export interface Collection {
  id: number;
  name: string;
  creator: string;
  itemCount: number;
  mainImage: string;
  subImages: string[];
}

// MetaMask ethereum provider type
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeAllListeners: (event?: string) => void;
    };
  }
}
