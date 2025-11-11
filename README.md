# Somnia NFT Stream - Hackathon Project

A cutting-edge NFT auction platform built for the Somnia Data Streams Mini Hackathon, featuring real-time blockchain data streaming, secure smart contracts, and seamless Web3 integration.

## 🚀 Live Demo
🎯 Try the Live Demo: https://somniastream.vercel.app/

⚠️ TESTNET - For Testing Only

Network: Somnia Testnet (Shannon) - Chain ID: 50312
Currency: Test STT tokens ([Get from Somnia Faucet](https://testnet.somnia.network/))
All transactions are on testnet - No real value, for development and testing only

## Features

- **MetaMask Integration**: Automatic Somnia Testnet configuration
- **Real-time Bidding**: Place test bids on live auction
- **SDS Integration**: Real-time blockchain data streams
- **Responsive Design**: Works on desktop and mobile

## 🎯 Hackathon Goal

This project demonstrates the power of Somnia Data Streams (SDS) by creating a fully functional NFT auction platform where:

- Real-time bidding is powered by blockchain data streams
- Event-driven updates provide instant UI feedback
- Schema-based data encoding ensures type-safe blockchain communication
- Decentralized architecture maintains transparency and security

## ⭐ Key Features

### ✅ Somnia Data Streams Integration
- `@somnia-chain/streams` SDK for blockchain data streaming
- Schema-based event encoding for auction events (BID_PLACED, AUCTION_STARTED, etc.)
- Real-time data publishing to Somnia blockchain
- Type-safe data structures with automatic encoding/decoding

### ✅ Complete Web3 Auction Platform
- MetaMask wallet integration with automatic network switching
- Live auction status with real-time updates
- Secure bidding system with minimum bid validation
- Bid history tracking with automatic UI updates

### ✅ Production-Ready Smart Contracts
- Solidity smart contracts deployed on Somnia Testnet
- OpenZeppelin standards (ERC721, ReentrancyGuard)
- Security audited with best practices
- Event-driven architecture for real-time updates

### ✅ Modern Web Architecture
- Express.js backend with RESTful API endpoints
- React frontend with real-time updates
- Responsive design with modern CSS
- Error handling and user feedback

## 📊 How Somnia Data Streams (SDS) is Used

This project leverages Somnia Data Streams SDK to create a real-time, event-driven auction platform.

### 1. Schema Definition
Structured schemas for auction events using the SDS SDK:

```javascript
const AUCTION_SCHEMAS = {
  BID_PLACED: \`uint256 auctionId, address bidder, uint256 bidAmount, uint256 timestamp\`,
  AUCTION_STARTED: \`uint256 auctionId, address seller, uint256 startingPrice, uint256 endTime, uint256 timestamp\`,
  AUCTION_ENDED: \`uint256 auctionId, address winner, uint256 finalPrice, uint256 timestamp\`,
  NFT_MINTED: \`uint256 tokenId, address owner, string tokenURI, uint256 timestamp\`
};
```

### 2. Event Publishing
When a bid is placed, we publish the event to SDS:

```javascript
async function publishBidToSDS(bidAmount, bidderAddress) {
  const bidEventData = {
    eventType: 'BID_PLACED',
    auctionId: 1,
    bidder: bidderAddress,
    bidAmount: bidAmount,
    timestamp: new Date().toISOString()
  };
  
  // Publish to SDS blockchain
  await sdsClient.publishEvent(bidEventData);
}
```

### 3. Real-Time Subscription
Frontend subscribes to BID_PLACED events using schema ID:

```javascript
const bidPlacedSchemaId = '0xdbc461f2979180da401d5fa5f646a62c0b862dd8128fec16258714b900c705ee';
console.log('📊 Subscribing to BID_PLACED events with schema:', bidPlacedSchemaId);
```

### 4. Live UI Updates
When a new bid is detected:
- ✅ Toast notification slides in from right
- ✅ Live bid feed updates instantly
- ✅ Auction status refreshes
- ✅ No page reload needed

## 🏗️ Architecture

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Frontend       │    │   Backend        │    │   Smart          │
│   (React)        │◄──►│   (Express.js)   │◄──►│   Contracts      │
│                  │    │                  │    │   (Solidity)     │
│ • Wallet Connect │    │ • API Endpoints  │    │                  │
│ • Bid Interface  │    │ • SDS Integration│    │ • Auction Logic  │
│ • Real-time UI   │    │ • Contract Calls │    │ • NFT Minting    │
└──────────────────┘    └──────────────────┘    └──────────────────┘
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  │
                           ┌──────────────────┐
                           │ Somnia Data      │
                           │ Streams (SDS)    │
                           │ Blockchain       │
                           └──────────────────┘
```

## �️ Technology Stack

### Frontend
- **React** 19.2.0 - Modern UI library
- **TypeScript** 5.8.2 - Type safety
- **ethers.js** 6.15.0 - Web3 wallet integration
- **Tailwind CSS** - Responsive styling

### Backend
- **Node.js + Express.js** - RESTful API server
- **ethers.js** 6.15.0 - Smart contract interactions
- **@somnia-chain/streams** - SDS blockchain integration
- **CORS** - Cross-origin support

### Smart Contracts
- **Solidity** 0.8.20 - Smart contract language
- **OpenZeppelin** v5.4.0 - Security standards
- **ReentrancyGuard** - Security protection

### Blockchain
- **Somnia Testnet (Shannon)** - Official test network
- **Chain ID**: 50312
- **RPC**: https://dream-rpc.somnia.network/
- **Explorer**: https://shannon-explorer.somnia.network/

## 📋 Prerequisites

- **Node.js** 18+ - Runtime environment
- **MetaMask** - Web3 wallet browser extension
- **STT Tokens** - Somnia testnet native currency ([Get from Faucet](https://testnet.somnia.network/))

## � Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your private key
```

### 3. Start the Application
```bash
npm run dev
```

This starts the development server on port 3000.

### 4. Access the Application
Open http://localhost:3000 in your browser.

### 5. Connect Wallet
- Click "Connect MetaMask" button
- Approve the connection in MetaMask popup
- Network automatically switches to Somnia Testnet

### 6. Start Bidding
- View live auction status
- Place bids with STT tokens
- Watch real-time updates via SDS

## 📡 API Endpoints

The backend provides RESTful endpoints for contract interaction and SDS integration:

### Core Endpoints
- `GET /` - Server information and status
- `GET /contracts` - Deployed contract addresses
- `GET /auction/status` - Live auction data
- `GET /network` - Somnia network configuration

### SDS Integration
- `GET /sds/schemas` - Available event schemas
- `GET /sds/auction/:id/events` - Auction events via SDS streams
- `POST /sds/publish-event` - Publish auction events to SDS blockchain

### Utility
- `GET /metamask-config` - MetaMask network configuration
- `GET /health` - Server health check

## 🎨 SDS Event Schemas

```javascript
AUCTION_SCHEMAS = {
  BID_PLACED: \`uint256 auctionId, address bidder, uint256 bidAmount, uint256 timestamp\`,
  AUCTION_STARTED: \`uint256 auctionId, address seller, uint256 startingPrice, uint256 endTime, uint256 timestamp\`,
  AUCTION_ENDED: \`uint256 auctionId, address winner, uint256 finalPrice, uint256 timestamp\`,
  NFT_MINTED: \`uint256 tokenId, address owner, string tokenURI, uint256 timestamp\`
}
```

## 🔐 Security Features

- **ReentrancyGuard** - Prevents reentrancy attacks
- **Input Validation** - All user inputs validated
- **Error Handling** - Comprehensive error management
- **Type Safety** - TypeScript-inspired patterns
- **Audit-Ready** - OpenZeppelin security standards

## 🎯 Hackathon Compliance

This project fully complies with Somnia Data Streams Mini Hackathon requirements:

✅ **Mandatory Requirements Met:**
- SDS SDK Integration - `@somnia-chain/streams` fully implemented
- Schema-based Data Encoding - Structured event schemas
- Blockchain Data Streaming - Real-time event publishing
- Somnia Testnet - Official network deployment
- Working dApp - Fully functional NFT auction platform

✅ **Bonus Features:**
- Real-time UI Updates - Event-driven interface
- Production Deployment - Live on testnet
- Security Best Practices - ReentrancyGuard, input validation
- Modern UX - Responsive, intuitive design

## � Contract Addresses

**Somnia Testnet (Chain ID: 50312)**
- Auction Contract: 0x811CD7090a8e7b63ee466A7610d7e28Ba0cda6ef
- NFT Contract: 0x6c5cE10cD5dcE7250f5dF94599Ec6869158E966f
- Block Explorer: https://shannon-explorer.somnia.network/

## 🎨 Demo Flow

1. **Launch Application** - npm start → http://localhost:3000
2. **Connect Wallet** - MetaMask integration with auto network switch
3. **Load SDS Schemas** - View available event schemas
4. **Monitor Auction** - Live status updates
5. **Place Bids** - Real-time bidding with STT tokens
6. **SDS Publishing** - Events automatically published to blockchain

## 🤝 Contributing

This project was built for the Somnia Hackathon. For improvements or questions:

- Fork the repository
- Create a feature branch
- Submit a pull request
- Join the discussion on Discord

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Somnia Network** - For the innovative blockchain platform
- **Somnia Data Streams** - For real-time data streaming capabilities
- **OpenZeppelin** - For security standards and best practices
- **Vercel** - For reliable deployment infrastructure

---

**Built with ❤️ for the Somnia Data Streams Mini Hackathon**

Real-time NFT auctions powered by Somnia Data Streams 🚀📊
