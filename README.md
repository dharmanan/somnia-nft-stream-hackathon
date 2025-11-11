# Somnia NFT Stream - Hackathon Project

A real-time NFT streaming and auction platform built on the **Somnia Testnet** with WebSocket integration and SDS (Somnia Data Streams) support.

## Features

- 🔗 **Blockchain Integration**: Connected to Somnia Testnet (Chain ID: 50312)
- 💼 **MetaMask Wallet Support**: Connect your wallet for transactions
- 📡 **WebSocket Real-time Updates**: Live data streaming from backend
- 🌊 **SDS Integration**: Somnia Data Streams for blockchain events
- 🎨 **React + TypeScript**: Modern frontend with Tailwind CSS
- ⚡ **Vite Build System**: Fast development and production builds
- 🚀 **Vercel Deployment**: Production-ready backend API

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- MetaMask wallet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dharmanan/somnia-nft-stream-hackathon
   cd somnia-nft-stream-hackathon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run locally:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `/components` - React components (Header, Cards, Wallet, etc.)
- `/services` - Service layer (API integrations)
- `/backend` - Express server with WebSocket + SDS integration
- `App.tsx` - Main application component
- `constants.ts` - Configuration and constants

## Network Details

**Somnia Testnet:**
- Chain ID: 50312
- RPC: https://dream-rpc.somnia.network/
- Explorer: https://shannon-explorer.somnia.network/

## Backend API

Backend runs on port 3001:
- `GET /health` - Health check
- `POST /api/test-sds` - Test SDS integration
- `WS ws://localhost:3001` - WebSocket connection

## Deployment

Frontend deployed on Vercel, backend as serverless Node.js function.

Production URL: [https://backend-ktsyvd3vl-kohens-projects.vercel.app](https://backend-ktsyvd3vl-kohens-projects.vercel.app)

## Technologies

- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS, ethers.js 6
- **Backend**: Express.js, WebSocket (ws), @somnia-chain/streams
- **Build**: Vite 6, npm
- **Deployment**: Vercel

## License

MIT
