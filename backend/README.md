# Backend - Somnia NFT Stream

Express.js backend with WebSocket support for Somnia NFT streaming application.

## Features

- **WebSocket Server**: Real-time communication with frontend
- **SDS Integration**: Somnia Data Streams integration for blockchain data
- **CORS Support**: Cross-origin requests for Vercel deployment
- **REST API**: Health checks and SDS testing endpoints

## Installation

```bash
npm install
```

## Running

```bash
npm start
```

Server starts on port 3001 by default (or PORT env variable).

## Environment Variables

- `PORT` - Server port (default: 3001)

## Endpoints

- `GET /health` - Health check
- `POST /api/test-sds` - Test SDS integration
- `WS ws://localhost:3001` - WebSocket connection

## WebSocket Messages

### Client to Server
```json
{
  "type": "test_sds"
}
```

### Server Response
```json
{
  "type": "sds_test_result",
  "success": true,
  "message": "SDS Integration Active",
  "data": { "chainId": 50312 }
}
```

## Deployment

Deployed on Vercel as serverless Node.js function.
