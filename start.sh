#!/bin/bash

echo "🚀 Starting Somnia NFT Auction Backend and Frontend..."

# Kill any existing processes
pkill -9 -f "node server.js" 2>/dev/null || true
pkill -9 -f "npm run dev" 2>/dev/null || true
pkill -9 -f "vite" 2>/dev/null || true

sleep 1

# Start Backend on port 3000
echo ""
echo "📦 Starting Backend on port 3000..."
cd /workspaces/somnia-nft-stream-hackathon/backend
PORT=3000 node server.js &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Wait for backend to start
sleep 2

# Start Frontend on port 3001
echo ""
echo "⚛️  Starting Frontend on port 3001..."
cd /workspaces/somnia-nft-stream-hackathon
VITE_PORT=3001 npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "════════════════════════════════════════════"
echo "🎉 All services running!"
echo "════════════════════════════════════════════"
echo "📱 Frontend: http://localhost:3001"
echo "🔧 Backend:  http://localhost:3000"
echo "════════════════════════════════════════════"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for processes
wait
