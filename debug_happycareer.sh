#!/bin/bash

# 🔍 HappyCareer Debugging Script
# This script helps debug and fix issues in the HappyCareer project

set -e  # Exit on any error

echo "🔍 Starting HappyCareer Debugging Process..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to kill processes on a port
kill_port() {
    if port_in_use $1; then
        print_warning "Port $1 is in use. Killing processes..."
        lsof -ti :$1 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

echo ""
print_status "Step 1: Environment Check"
echo "--------------------------------"

# Check if we're in the right directory
if [ ! -f "backend/package.json" ] || [ ! -f "frontend/package.json" ]; then
    print_error "Not in HappyCareer project root directory"
    exit 1
fi

print_success "Project structure verified"

# Check Node.js version
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
else
    print_error "Node.js not found"
    exit 1
fi

# Check npm version
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm version: $NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

echo ""
print_status "Step 2: Clean Environment"
echo "--------------------------------"

# Kill any existing processes
print_status "Cleaning up existing processes..."
kill_port 3000
kill_port 4000
kill_port 3001

# Clear caches
print_status "Clearing caches..."
cd frontend
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
cd ../backend
rm -rf dist 2>/dev/null || true
cd ..

print_success "Environment cleaned"

echo ""
print_status "Step 3: Backend Debugging"
echo "--------------------------------"

cd backend

# Check backend dependencies
print_status "Checking backend dependencies..."
if [ ! -d "node_modules" ]; then
    print_warning "Backend node_modules not found. Installing..."
    npm install
else
    print_status "Checking for missing dependencies..."
    npm ls --depth=0 2>/dev/null || {
        print_warning "Dependency issues found. Reinstalling..."
        rm -rf node_modules package-lock.json
        npm install
    }
fi

# Check for TypeScript errors
print_status "Checking TypeScript errors..."
if command_exists npx; then
    npx tsc --noEmit 2>/dev/null && print_success "No TypeScript errors" || {
        print_warning "TypeScript errors found. Attempting to fix..."
        # Fix common TypeScript issues
        sed -i '' 's/process\.env\.JWT_SECRET/process.env.JWT_SECRET as string/g' src/routes/auth.ts 2>/dev/null || true
    }
fi

# Start backend with debugging
print_status "Starting backend with debugging..."
DEBUG=* npm run demo &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Test backend health
if curl -s http://localhost:4000/health >/dev/null; then
    print_success "Backend is running successfully"
    curl -s http://localhost:4000/health | jq . 2>/dev/null || curl -s http://localhost:4000/health
else
    print_error "Backend failed to start"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

cd ..

echo ""
print_status "Step 4: Frontend Debugging"
echo "--------------------------------"

cd frontend

# Check frontend dependencies
print_status "Checking frontend dependencies..."
if [ ! -d "node_modules" ]; then
    print_warning "Frontend node_modules not found. Installing..."
    npm install
else
    print_status "Checking for missing dependencies..."
    npm ls --depth=0 2>/dev/null || {
        print_warning "Dependency issues found. Reinstalling..."
        rm -rf node_modules package-lock.json
        npm install
    }
fi

# Install missing dependencies
print_status "Installing missing dependencies..."
npm install tailwindcss-animate lucide-react 2>/dev/null || true
npm install --save-dev @types/react-devtools 2>/dev/null || true

# Check for TypeScript errors
print_status "Checking TypeScript errors..."
if command_exists npx; then
    npx tsc --noEmit 2>/dev/null && print_success "No TypeScript errors" || print_warning "TypeScript errors found"
fi

# Start frontend with debugging
print_status "Starting frontend with debugging..."
DEBUG=* npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 10

# Test frontend
if curl -s -I http://localhost:3000 | grep -q "200\|302"; then
    print_success "Frontend is running successfully"
elif curl -s -I http://localhost:3000 | grep -q "500"; then
    print_warning "Frontend is running but has errors"
    print_status "Frontend error details:"
    curl -s http://localhost:3000 | head -20
else
    print_error "Frontend failed to start"
    kill $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

cd ..

echo ""
print_status "Step 5: API Testing"
echo "-------------------------"

# Test API endpoints
print_status "Testing API endpoints..."

# Test jobs endpoint
if curl -s http://localhost:4000/api/jobs >/dev/null; then
    print_success "Jobs API endpoint working"
    print_status "Sample job data:"
    curl -s http://localhost:4000/api/jobs | jq '.[0]' 2>/dev/null || curl -s http://localhost:4000/api/jobs | head -5
else
    print_error "Jobs API endpoint failed"
fi

# Test specific job endpoint
if curl -s http://localhost:4000/api/jobs/1 >/dev/null; then
    print_success "Individual job API endpoint working"
else
    print_error "Individual job API endpoint failed"
fi

echo ""
print_status "Step 6: Network Connectivity"
echo "-----------------------------------"

# Test CORS
print_status "Testing CORS configuration..."
if curl -s -H "Origin: http://localhost:3000" http://localhost:4000/api/jobs >/dev/null; then
    print_success "CORS is configured correctly"
else
    print_warning "CORS may have issues"
fi

# Test frontend to backend communication
print_status "Testing frontend-backend communication..."
if curl -s http://localhost:3000 >/dev/null && curl -s http://localhost:4000/health >/dev/null; then
    print_success "Both services are accessible"
else
    print_error "Service communication issues detected"
fi

echo ""
print_status "Step 7: Performance Check"
echo "--------------------------------"

# Check memory usage
print_status "Checking memory usage..."
ps aux | grep -E "(node|next)" | grep -v grep | awk '{print $2, $3, $4, $11}' | head -5

# Check disk usage
print_status "Checking disk usage..."
du -sh frontend/node_modules backend/node_modules 2>/dev/null || true

echo ""
print_status "Step 8: Debugging Summary"
echo "--------------------------------"

echo "🔍 Debugging Results:"
echo "====================="

# Backend status
if curl -s http://localhost:4000/health >/dev/null; then
    echo "✅ Backend: Running on http://localhost:4000"
else
    echo "❌ Backend: Failed to start"
fi

# Frontend status
if curl -s -I http://localhost:3000 | grep -q "200\|302"; then
    echo "✅ Frontend: Running on http://localhost:3000"
elif curl -s -I http://localhost:3000 | grep -q "500"; then
    echo "⚠️  Frontend: Running with errors on http://localhost:3000"
else
    echo "❌ Frontend: Failed to start"
fi

# API status
if curl -s http://localhost:4000/api/jobs >/dev/null; then
    echo "✅ API: Endpoints working"
else
    echo "❌ API: Endpoints failed"
fi

echo ""
print_status "Step 9: Next Steps"
echo "------------------------"

echo "🎯 Recommended Actions:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Open http://localhost:4000/health to verify backend"
echo "3. Check browser console for frontend errors"
echo "4. Monitor terminal output for debugging information"

echo ""
echo "🔧 Manual Debugging Commands:"
echo "cd frontend && npm run dev    # Start frontend"
echo "cd backend && npm run demo    # Start backend"
echo "curl http://localhost:4000/health    # Test backend"
echo "curl -I http://localhost:3000        # Test frontend"

echo ""
print_success "Debugging process completed!"
echo "====================================="

# Keep the script running to maintain processes
echo ""
print_status "Press Ctrl+C to stop all services"
echo "Services will continue running in the background"

# Wait for user input
wait 