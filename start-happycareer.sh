#!/bin/bash

# 🚀 HappyCareer Startup Script
# This script starts both frontend and backend servers together

set -e

echo "🚀 Starting HappyCareer Application..."

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

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
}

# Function to start with Docker Compose
start_with_docker() {
    print_status "Starting with Docker Compose..."
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating default .env file..."
        cat > .env << EOF
# HappyCareer Environment Variables
NEXT_PUBLIC_MOONSHOT_API_KEY=your-moonshot-api-key-here
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://postgres:password@localhost:5432/happycareer
JWT_SECRET=your-super-secret-jwt-key-here
EOF
        print_warning "Please update the .env file with your actual API keys!"
    fi
    
    # Build and start services
    docker-compose up --build -d
    
    print_success "Docker services started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:4000"
    print_status "Database: localhost:5432"
    print_status "Redis: localhost:6379"
    
    echo ""
    print_status "To view logs: docker-compose logs -f"
    print_status "To stop services: docker-compose down"
}

# Function to start with npm (development mode)
start_with_npm() {
    print_status "Starting with npm (development mode)..."
    
    # Check if dependencies are installed
    if [ ! -d "frontend/node_modules" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend && npm install && cd ..
    fi
    
    if [ ! -d "backend/node_modules" ]; then
        print_status "Installing backend dependencies..."
        cd backend && npm install && cd ..
    fi
    
    # Start backend in background
    print_status "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend in background
    print_status "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Both servers started!"
    print_status "Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
    print_status "Backend: http://localhost:4000 (PID: $BACKEND_PID)"
    
    echo ""
    print_status "To stop servers: kill $FRONTEND_PID $BACKEND_PID"
    print_status "Or use: pkill -f 'npm run dev'"
    
    # Save PIDs to file for easy cleanup
    echo "$FRONTEND_PID $BACKEND_PID" > .server-pids
}

# Function to start only backend
start_backend_only() {
    print_status "Starting backend server only..."
    
    if [ ! -d "backend/node_modules" ]; then
        print_status "Installing backend dependencies..."
        cd backend && npm install && cd ..
    fi
    
    cd backend
    npm run dev
}

# Function to start only frontend
start_frontend_only() {
    print_status "Starting frontend server only..."
    
    if [ ! -d "frontend/node_modules" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend && npm install && cd ..
    fi
    
    cd frontend
    npm run dev
}

# Function to stop all services
stop_services() {
    print_status "Stopping all services..."
    
    # Stop Docker services
    if docker-compose ps | grep -q "happycareer"; then
        docker-compose down
        print_success "Docker services stopped!"
    fi
    
    # Stop npm processes
    if [ -f .server-pids ]; then
        PIDS=$(cat .server-pids)
        kill $PIDS 2>/dev/null || true
        rm .server-pids
        print_success "npm processes stopped!"
    fi
    
    # Kill any remaining npm dev processes
    pkill -f "npm run dev" 2>/dev/null || true
    
    print_success "All services stopped!"
}

# Function to show status
show_status() {
    print_status "Checking service status..."
    
    # Check Docker services
    if docker-compose ps | grep -q "happycareer"; then
        print_success "Docker services are running:"
        docker-compose ps
    else
        print_warning "No Docker services running"
    fi
    
    # Check npm processes
    if pgrep -f "npm run dev" > /dev/null; then
        print_success "npm processes are running:"
        ps aux | grep "npm run dev" | grep -v grep
    else
        print_warning "No npm processes running"
    fi
    
    # Check ports
    echo ""
    print_status "Port status:"
    if lsof -i :3000 > /dev/null 2>&1; then
        print_success "Port 3000 (Frontend): IN USE"
    else
        print_warning "Port 3000 (Frontend): AVAILABLE"
    fi
    
    if lsof -i :4000 > /dev/null 2>&1; then
        print_success "Port 4000 (Backend): IN USE"
    else
        print_warning "Port 4000 (Backend): AVAILABLE"
    fi
}

# Main script logic
case "${1:-}" in
    "docker")
        check_docker
        start_with_docker
        ;;
    "npm")
        check_node
        start_with_npm
        ;;
    "backend")
        check_node
        start_backend_only
        ;;
    "frontend")
        check_node
        start_frontend_only
        ;;
    "stop")
        stop_services
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        echo "🚀 HappyCareer Startup Script"
        echo ""
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  docker    - Start both frontend and backend with Docker Compose"
        echo "  npm       - Start both frontend and backend with npm (development)"
        echo "  backend   - Start only backend server"
        echo "  frontend  - Start only frontend server"
        echo "  stop      - Stop all running services"
        echo "  status    - Show status of all services"
        echo "  help      - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 docker    # Start with Docker (recommended for production)"
        echo "  $0 npm       # Start with npm (recommended for development)"
        echo "  $0 stop      # Stop all services"
        echo ""
        ;;
    *)
        echo "🚀 HappyCareer Startup Script"
        echo ""
        echo "Choose your startup method:"
        echo "1. Docker Compose (recommended for production)"
        echo "2. npm (recommended for development)"
        echo ""
        read -p "Enter your choice (1 or 2): " choice
        
        case $choice in
            1)
                check_docker
                start_with_docker
                ;;
            2)
                check_node
                start_with_npm
                ;;
            *)
                print_error "Invalid choice. Exiting."
                exit 1
                ;;
        esac
        ;;
esac 