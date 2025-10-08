#!/bin/bash

# Simple run script to start both backend and frontend servers
# Usage: ./run.sh

set -e  # Exit on any error

echo "🚀 Starting Bedrock Secure Chat UI servers..."
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start backend server
echo "🔧 Starting backend server on port 8088..."
cd backend
node server.mjs &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "🎨 Starting frontend server on port 8087..."
FRONTEND_PORT=8087 npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting up!"
echo ""
echo "📱 Frontend: http://localhost:8087"
echo "🔧 Backend:  http://localhost:8088"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
