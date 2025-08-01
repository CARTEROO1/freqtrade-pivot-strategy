#!/bin/bash

# Freqtrade Strategy Deployment Script
# Run this on your VPS after cloning your repository

echo "🚀 Setting up Freqtrade Strategy on VPS..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p user_data/logs
mkdir -p user_data/data
mkdir -p user_data/backtest_results

# Set proper permissions
echo "🔐 Setting permissions..."
sudo chown -R $USER:$USER user_data/

# Pull latest images
echo "📥 Pulling Docker images..."
docker-compose pull

# Start the strategy
echo "🚀 Starting Freqtrade strategy..."
docker-compose up -d

echo "✅ Deployment complete!"
echo "📊 Check logs with: docker-compose logs -f"
echo "🌐 Access API at: http://your-server-ip:8080"
echo "📈 Monitor strategy at: http://your-server-ip:8080/api/v1/status" 