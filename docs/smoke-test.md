# Smoke Test Guide

This document describes how to run a quick smoke test of the Somnia NFT Stream application to verify that core functionality is working after deployment.

## Prerequisites

- Node.js >= 16
- A running backend server (see [backend/README.md](../backend/README.md))
- A browser with MetaMask or a compatible Web3 wallet

## 1. Start the Backend

```bash
cd backend
npm install
npm start
```

Expected output:
```
Server listening on port 3001
```

Verify the health endpoint:

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{ "status": "ok" }
```

## 2. Start the Frontend

From the repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## 3. API Endpoints Smoke Test

Run the following commands to verify each Vercel API route responds correctly.

### Network config

```bash
curl http://localhost:3000/api/network
```

Expected keys in response: `chainId`, `chainName`, `nativeCurrency`, `rpcUrls`, `blockExplorerUrls`.

### Auction state

```bash
curl http://localhost:3000/api/auction
```

Expected keys in response: `auctionStarted`, `highestBid`, `highestBidder`, `endTime`, `nftContract`, `nftId`, `seller`.

### SDS status

```bash
curl http://localhost:3000/api/sds/status
```

Expected keys in response: `sds_initialized`, `schema_encoder_ready`, `supported_schemas`.

### SDS schemas list

```bash
curl http://localhost:3000/api/sds/schemas
```

Expected: a JSON array with at least one schema object containing `name`, `schema`, and `id` fields.

### SDS publish event (POST)

```bash
curl -X POST http://localhost:3000/api/sds/publish-event \
  -H 'Content-Type: application/json' \
  -d '{"eventType":"BID_PLACED","data":{"auctionId":1,"bidder":"0xabc","bidAmount":1000,"timestamp":1700000000}}'
```

Expected keys in response: `event_type`, `schema_id`, `encoded_data`, `timestamp`, `status`.

## 4. WebSocket Smoke Test

You can use [wscat](https://github.com/websockets/wscat) to verify the WebSocket server:

```bash
npx wscat -c ws://localhost:3001
```

Once connected, send:

```json
{"type":"test_sds"}
```

Expected response shape:

```json
{
  "type": "sds_test_result",
  "success": true,
  "message": "SDS Integration Active",
  "data": { "chainId": 50312 }
}
```

## 5. UI Checklist

| Step | Expected Result |
|------|-----------------|
| Open homepage | Header, featured NFT, and popular collections sections are visible |
| Click **Connect Wallet** | MetaMask (or equivalent) prompts for connection |
| After connecting | Wallet address appears in the header |
| View auction countdown | `CountdownTimer` component shows a live countdown |
| Network switch prompt | App requests switch to **Somnia Testnet (Shannon)** (chainId `0xc488`) if on wrong network |

## 6. CORS Verification

All `/api/*` routes must return the following header:

```
Access-Control-Allow-Origin: *
```

Verify with:

```bash
curl -I http://localhost:3000/api/network
```

## Pass Criteria

The smoke test passes when:

1. All `curl` commands above return HTTP `200` with the expected JSON structure.
2. The WebSocket connection receives a valid `sds_test_result` message.
3. The UI loads without console errors and the wallet connection flow completes successfully.
