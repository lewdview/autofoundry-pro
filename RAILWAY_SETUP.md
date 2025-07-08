# Railway Backend Deployment Setup

## Environment Variables to Set in Railway

### Required Variables:
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://autofoundry-dl1sb06s9-lewdviews-projects.vercel.app
```

### Database (Required):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autofoundry
```

### Optional API Keys:
```
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_TRENDS_API_KEY=your_google_trends_api_key_here
JWT_SECRET=your_random_jwt_secret_here
```

## Railway Deployment Steps:

1. **Connect GitHub Repository**
   - Link your GitHub repo to Railway
   - Select the backend directory as the root

2. **Set Environment Variables**
   - Go to Railway dashboard → Your project → Variables
   - Add all the environment variables listed above

3. **Database Setup**
   - Create a MongoDB Atlas cluster (free tier)
   - Get connection string and set as MONGODB_URI

4. **Domain Setup**
   - Railway will provide a domain like: `https://your-app-name.up.railway.app`
   - Update frontend .env.production with this URL

5. **Health Check**
   - Test backend health: `https://your-railway-url.up.railway.app/health`

## Frontend Environment Update:

Update `frontend/.env.production`:
```
VITE_API_BASE_URL=https://your-actual-railway-url.up.railway.app
```
