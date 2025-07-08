#!/bin/bash

echo "🚀 BAT Pro Investor Demo - Pre-Demo Setup"
echo "========================================="

# Check if backend is running
echo "📡 Checking backend status..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Backend is running on port 3000"
else
    echo "❌ Backend is not running. Starting backend..."
    cd /Users/studio/bat/backend
    npm start &
    echo "⏳ Waiting for backend to start..."
    sleep 5
fi

# Check if frontend is running  
echo "🌐 Checking frontend status..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend is running on port 3001"
else
    echo "❌ Frontend is not running. Starting frontend..."
    cd /Users/studio/bat/bat-frontend-clean
    PORT=3001 npm run dev &
    echo "⏳ Waiting for frontend to start..."
    sleep 10
fi

# Test API endpoints
echo "🧪 Testing automation API..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/automation/two-question-start \
  -H "Content-Type: application/json" \
  -d '{
    "businessIdea": "Demo test automation",
    "feelingLucky": false,
    "automationType": "niche-only",
    "creditsUsed": 25,
    "stages": 3
  }')

if echo "$RESPONSE" | grep -q "success"; then
    echo "✅ Automation API is working"
    SESSION_ID=$(echo "$RESPONSE" | grep -o '"sessionId":"[^"]*"' | cut -d'"' -f4)
    echo "🔗 Test session created: $SESSION_ID"
else
    echo "❌ Automation API test failed"
    echo "Response: $RESPONSE"
fi

echo ""
echo "🎯 Demo Environment Status:"
echo "============================="
echo "Frontend: http://localhost:3001/"
echo "Backend:  http://localhost:3000/health"
echo ""
echo "📋 Demo Checklist:"
echo "- [ ] Open http://localhost:3001/ in browser"
echo "- [ ] Prepare demo business idea: 'AI-powered fitness coaching app'"
echo "- [ ] Practice demo flow (15 minutes)"
echo "- [ ] Have backup slides ready"
echo ""
echo "🎬 Ready for investor demo!"
