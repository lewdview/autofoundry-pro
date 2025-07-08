# 🚀 Railway Deployment Instructions

## Current Issue
Railway is deploying an older version of the backend. We need to ensure it deploys our latest code with MongoDB and Groq AI integration.

## Step-by-Step Deployment Fix

### 1. Go to Railway Dashboard
1. Open https://railway.app
2. Navigate to your `autofoundry-pro-production` project
3. Click on your backend service

### 2. Check Source Configuration
1. Go to **Settings** tab
2. Under **Source Repo**, ensure it's connected to: `lewdview/autofoundry-pro`
3. Check **Branch**: Should be `main`
4. **Root Directory**: Should be `/backend` or `/` (we've configured both)

### 3. Environment Variables (Already Set)
Make sure these are still configured in **Variables** tab:
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://autofoundry-dl1sb06s9-lewdviews-projects.vercel.app
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
```

> **Note**: Use the actual API keys and connection strings you provided earlier

### 4. Force New Deployment
**Option A - Trigger Redeploy:**
1. Go to **Deployments** tab
2. Click **Deploy** button to trigger new deployment

**Option B - Push Empty Commit:**
```bash
git commit --allow-empty -m "Force Railway deployment with latest backend"
git push origin main
```

**Option C - Railway CLI (if you have it):**
```bash
railway login
railway deploy
```

### 5. Monitor Deployment
1. Watch the **Deployments** tab for build logs
2. Look for successful installation of npm packages
3. Check that the health endpoint responds correctly

### 6. Test New Deployment
After deployment completes (2-3 minutes), test:

```bash
# Test health with database status
curl https://autofoundry-pro-production.up.railway.app/health

# Test automation with real AI
curl -X POST https://autofoundry-pro-production.up.railway.app/api/automation/two-question-start \
  -H "Content-Type: application/json" \
  -d '{"businessIdea": "AI-powered fitness app", "feelingLucky": false, "automationType": "full", "creditsUsed": 45}'
```

## Expected Results After Successful Deployment

### ✅ Health Check Should Show:
```json
{
  "status": "healthy",
  "timestamp": "2025-07-08T13:xx:xx.xxxZ",
  "database": "connected"
}
```

### ✅ Automation Should Return:
- Real AI-generated market analysis (not mock data)
- Session saved to MongoDB
- All automation steps working

## Troubleshooting

### If Deployment Fails:
1. Check build logs in Railway dashboard
2. Ensure `package.json` is in backend directory
3. Verify environment variables are set

### If Old Backend Still Running:
1. Delete the current service in Railway
2. Create new service connected to GitHub repo
3. Set root directory to `/backend`
4. Add environment variables again

### If Database Connection Fails:
1. Check MongoDB URI is correct
2. Verify MongoDB Atlas allows Railway IP addresses
3. Test connection string locally first
