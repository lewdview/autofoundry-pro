#!/bin/bash

echo "🚀 Starting AutoFoundry PRO - Business Automation Platform"
echo "=========================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Please upgrade to Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ npm $(npm --version) detected"

# Check if dependencies are installed
echo ""
echo "📦 Checking dependencies..."

if [ ! -d "backend/node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
else
    echo "✅ Backend dependencies installed"
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
else
    echo "✅ Frontend dependencies installed"
fi

# Kill existing processes on our ports
echo ""
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*3000" >/dev/null 2>&1 || true
pkill -f "node.*3001" >/dev/null 2>&1 || true
sleep 2

# Start backend
echo ""
echo "🔧 Starting AutoFoundry PRO Backend..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Check if backend is running
if curl -s http://localhost:3000/health >/dev/null 2>&1; then
    echo "✅ Backend running on http://localhost:3000"
else
    echo "❌ Backend failed to start. Check logs above."
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Start frontend
echo ""
echo "🎨 Starting AutoFoundry PRO Frontend..."
cd frontend
PORT=3001 npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 8

# Check if frontend is running
if curl -s http://localhost:3001 >/dev/null 2>&1; then
    echo "✅ Frontend running on http://localhost:3001"
else
    echo "❌ Frontend failed to start. Check logs above."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

# Test the API
echo ""
echo "🧪 Testing AutoFoundry PRO API..."
API_RESPONSE=$(curl -s http://localhost:3000/api/auth/pricing | jq -r '.success // false' 2>/dev/null)

if [ "$API_RESPONSE" = "true" ]; then
    echo "✅ API is responding correctly"
else
    echo "⚠️  API test failed, but services may still be working"
fi

echo ""
echo "🎉 AutoFoundry PRO is now running!"
echo "=================================="
echo ""
echo "📱 Frontend:     http://localhost:3001"
echo "🔧 Backend API:  http://localhost:3000"
echo "💊 Health Check: http://localhost:3000/health"
echo "💰 Pricing API:  http://localhost:3000/api/auth/pricing"
echo ""
echo "🎯 Demo Features:"
echo "   • 6-Stage Business Automation"
echo "   • Free AI Technology (Zero API costs)"
echo "   • Professional Export Documents"
echo "   • Real-time Dashboard"
echo "   • User Registration & Authentication"
echo ""
echo "🛑 To stop AutoFoundry PRO:"
echo "   Press Ctrl+C or run: pkill -f 'node.*300[01]'"
echo ""
echo "📚 Documentation:"
echo "   • README.md - Project overview"
echo "   • backend/pricing-strategy.md - Business strategy"
echo "   • backend/free-ai-setup.md - AI technology guide"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down AutoFoundry PRO..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    echo "✅ AutoFoundry PRO stopped successfully"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
echo "✨ AutoFoundry PRO is ready for development and investor demos!"
echo "   (Press Ctrl+C to stop all services)"

# Wait for user to stop the services
wait
