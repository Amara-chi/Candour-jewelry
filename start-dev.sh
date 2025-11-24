#!/bin/bash

echo "🚀 Starting Candour Jewelry Development Environment..."

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start backend in background
echo "📦 Starting backend server on port 3001..."
(cd "$SCRIPT_DIR/backend" && NODE_ENV=development npm start) &
BACKEND_PID=$!

# Wait a bit for backend to initialize
sleep 3

# Start frontend
echo "🎨 Starting frontend server on port 5000..."
cd "$SCRIPT_DIR"
npm run dev

# Cleanup function
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null || true
}

trap cleanup EXIT
