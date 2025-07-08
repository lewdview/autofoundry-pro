# Railway Environment Variables Setup

## 🔑 Step-by-Step Environment Configuration

### 1. Go to Railway Dashboard
- Open https://railway.app
- Navigate to your `autofoundry-pro-production` project
- Click on your backend service
- Go to the **Variables** tab

### 2. Add Required Environment Variables

#### Core Variables:
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://autofoundry-dl1sb06s9-lewdviews-projects.vercel.app
```

#### Groq AI API Key (IMPORTANT):
```
GROQ_API_KEY=your_groq_api_key_here
```

> **Note**: Replace `your_groq_api_key_here` with your actual Groq API key starting with `gsk_`

#### MongoDB Database (REQUIRED for persistent storage):
```
MONGODB_URI=your_mongodb_connection_string_here
```

✅ **Connection Tested Successfully** - Database name: `autofoundry`

### 3. Click "Deploy" to Apply Changes

After adding the environment variables, Railway will automatically redeploy your backend with the new configuration.

### 4. Test the AI Integration

Once deployed, test that the Groq AI is working:

```bash
curl -X POST https://autofoundry-pro-production.up.railway.app/api/automation/two-question-start \
  -H "Content-Type: application/json" \
  -d '{
    "businessIdea": "AI-powered fitness app", 
    "feelingLucky": false, 
    "automationType": "full", 
    "creditsUsed": 45
  }'
```

You should see real AI-generated market analysis instead of mock data!

## 🎯 Benefits of Adding Groq API Key

- **Real AI Analysis**: Instead of mock data, get actual AI-powered market insights
- **Better Results**: More accurate and personalized business analysis
- **Enhanced User Experience**: Users get real value from the automation

## 🔧 Technical Details

- **Model Used**: `llama3-8b-8192` (fast and efficient)
- **Fallback**: If API fails, system automatically uses mock data
- **Timeout**: 30 seconds per API call
- **Security**: API key stored securely as environment variable

## ⚠️ Security Note

The API key should ONLY be set as an environment variable in Railway. Never commit API keys to git repositories!
