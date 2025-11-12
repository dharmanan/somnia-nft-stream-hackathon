#!/bin/bash
# Somnia NFT Stream Backend - VPS Setup Script

set -e

echo "🚀 Somnia Backend VPS Setup başlıyor..."

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Node.js yükle
echo "📦 Node.js yükleniyor..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git yükle
sudo apt-get install -y git

# PM2 yükle (background process manager)
sudo npm install -g pm2

# Backend klasöründe
echo "📂 Backend kurulumu..."
mkdir -p /opt/somnia
cd /opt/somnia
git clone https://github.com/dharmanan/somnia-nft-stream-hackathon .
cd backend

# Dependencies
npm install

# PM2 ile başlat
echo "🚀 Backend başlatılıyor..."
pm2 start server.js --name "somnia-backend"
pm2 startup
pm2 save

echo "✅ Backend kuruldu! Port 3000'de çalışıyor"
echo "WebSocket: wss://YOUR_VPS_IP:3000"
