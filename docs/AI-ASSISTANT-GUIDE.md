# 🤖 AutoFoundry PRO - AI Assistant Onboarding Guide

*For AI assistants analyzing this project when context resets*

## 🎯 **Quick Start Analysis Commands**

Run these commands immediately to understand the project state:

```bash
# 1. Check current directory and structure
pwd && ls -la

# 2. Verify services are running
lsof -i -P | grep LISTEN | grep -E "(3000|3004|3005)"

# 3. Test backend connectivity
curl -s http://localhost:3000/health && echo " ✅ Backend OK"

# 4. Test demo endpoint
curl -s http://localhost:3000/api/automation/demo | head -3

# 5. Check frontend components
ls frontend/src/components/ | head -10

# 6. Review key documentation
cat docs/PROJECT-ANALYSIS.md | head -20
```

## 📋 **Project Identity**

**AutoFoundry PRO** = Business automation platform that creates companies in 15 minutes
- **Not** "BAT Pro" (old name, rebranded)
- **Current Status**: Investor-ready demo with working backend/frontend
- **Core Value**: AI-powered end-to-end business formation

## 🏗 **Architecture Quick Reference**

```
CURRENT RUNNING SERVICES:
├── Backend: http://localhost:3000 (Node.js + Express)
├── Frontend: http://localhost:3004+ (React + TypeScript)
└── Demo Flow: Working end-to-end integration

KEY COMPONENTS:
├── WelcomeScreen.tsx → Landing page with "TRY ME!" button
├── AutomationInterface.tsx → Demo interface 
├── AutomationDashboard.tsx → Live progress tracking
└── api.ts → Backend integration service
```

## 🔍 **Common Analysis Scenarios**

### **Scenario 1: "Demo not working"**
```bash
# Check services
lsof -i :3000 :3004 :3005
curl http://localhost:3000/health

# Check frontend errors
cd frontend && npm run dev
# Look for console errors in browser
```

### **Scenario 2: "Need to understand flow"**
```bash
# Check demo flow in App.tsx
grep -A 10 -B 5 "TRY ME\|demoAutomationStarted" frontend/src/App.tsx

# Check automation interface
grep -A 5 "onStartAutomation" frontend/src/components/AutomationInterface.tsx
```

### **Scenario 3: "Backend issues"**
```bash
# Check automation endpoints
ls backend/routes/
cat backend/routes/twoQuestionAutomation.js | head -50

# Test endpoints
curl -X POST http://localhost:3000/api/automation/two-question-start \
  -H "Content-Type: application/json" \
  -d '{"automationType":"demo","feelingLucky":true}'
```

### **Scenario 4: "UI/Design questions"**
```bash
# Check glassmorphism styles
grep -A 10 "glass-effect" frontend/src/index.css

# Check component styling
grep -r "glass-effect" frontend/src/components/ | head -5
```

## 🚨 **Critical Files to Understand**

### **1. Demo Flow (App.tsx)**
- Controls main application state
- Handles demo flow: `showDemo` → `demoAutomationStarted` → `demoSessionId`
- **Key**: `onStartAutomation` calls backend and shows dashboard

### **2. Backend API (twoQuestionAutomation.js)**
- Core automation engine
- Session management (in-memory for now)
- Real-time updates via Server-Sent Events

### **3. Frontend API Service (api.ts)**
- All backend communication
- Error handling and retry logic
- Demo endpoint: `getDemoData()`

### **4. UI Components**
- **WelcomeScreen**: Landing page with pricing
- **AutomationInterface**: Demo starter interface
- **AutomationDashboard**: Live progress tracking

## 🎯 **Typical User Issues & Solutions**

### **"Try Me Now button doesn't work"**
```javascript
// Check in App.tsx line ~250
<Button onClick={handleTryDemo}>TRY ME! (Free Demo)</Button>

// Verify handleTryDemo sets showDemo = true
const handleTryDemo = () => setShowDemo(true);
```

### **"Demo doesn't start automation"**
```javascript
// Check AutomationInterface onStartAutomation prop
// Should call apiService.getDemoData() and set demoSessionId
```

### **"Glass effects not showing"**
```css
/* Check if .glass-effect class exists in index.css */
.glass-effect {
  @apply backdrop-blur-md bg-white/20 border border-white/30 shadow-xl;
}
```

## 🔧 **Development Environment**

### **Required Node Versions**
- Node.js 18+
- npm 9+

### **Port Usage**
- **Backend**: Always 3000
- **Frontend**: Auto-assigned (3004, 3005, etc.) 

### **Environment Files**
```bash
# Backend .env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-here

# Frontend .env  
VITE_API_BASE_URL=http://localhost:3000
VITE_PORT=3003
```

## 💡 **Business Context**

### **What AutoFoundry Does**
1. User enters business idea OR clicks "I'm Feeling Lucky"
2. AI performs 6-stage automation:
   - Market Research
   - Business Registration  
   - Product Creation
   - Investment Materials
   - Funding Applications
   - Payment Setup
3. Outputs professional business documents

### **Revenue Model**
- $199-2,999/month subscription tiers
- Credit-based usage (25-80 credits per automation)
- Target: Entrepreneurs and business consultants

### **Competitive Advantage**
- Only platform doing complete end-to-end automation
- 15 minutes vs 6-12 months traditional
- $499/month vs $50K+ consultant costs

## 🎬 **Demo Script**

### **For Investors (15 minutes)**
1. **Opening**: "Transform any idea into investment-ready company in 15 minutes"
2. **Live Demo**: Show complete automation flow
3. **Value Prop**: Market size ($50B) + competitive advantage

### **For Users**
1. Land on welcome screen
2. Click "TRY ME! (Free Demo)"
3. Choose "I'm Feeling Lucky" or enter custom idea
4. Watch live automation dashboard
5. See professional results

## 🚀 **Next Steps Priorities**

### **If Demo Broken**
1. Fix demo flow integration
2. Ensure backend/frontend communication
3. Verify glassmorphism UI working

### **If Demo Working**
1. Enhance automation visuals
2. Add document export functionality
3. Complete authentication flow
4. Add MongoDB integration

### **For Investors**
1. Prepare pitch materials
2. Financial projections
3. Market analysis presentation

## 📞 **Emergency Debugging**

### **Services Won't Start**
```bash
# Kill all node processes
pkill -f node

# Start backend manually
cd backend && npm start &

# Start frontend manually  
cd frontend && npm run dev &
```

### **Frontend Won't Load**
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Backend API Errors**
```bash
# Check logs
cd backend && npm start

# Test health endpoint
curl -v http://localhost:3000/health
```

## 🏆 **Success Indicators**

✅ **Backend Health**: `curl http://localhost:3000/health` returns OK
✅ **Frontend Loading**: Browser shows AutoFoundry landing page
✅ **Demo Flow**: "TRY ME!" button leads to automation interface  
✅ **Glass Effects**: UI shows glassmorphism styling
✅ **API Integration**: Demo calls backend and returns data

**When all indicators are ✅, AutoFoundry PRO is ready for investor demonstrations.**

---

## 📝 **Quick Assessment Template**

Use this template to quickly assess project state:

```
AUTOFOUNDRY PRO STATUS CHECK:
- [ ] Backend running on port 3000
- [ ] Frontend accessible in browser  
- [ ] Demo flow functional
- [ ] Glass effects visible
- [ ] API endpoints responding
- [ ] Documentation up to date

IMMEDIATE ACTIONS NEEDED:
- [ ] Fix: _______________
- [ ] Enhance: ___________  
- [ ] Document: _________

NEXT PRIORITIES:
1. ___________________
2. ___________________
3. ___________________
```

**This guide enables any AI assistant to quickly understand and work with AutoFoundry PRO effectively.**
