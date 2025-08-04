# 🚀 Free Hosting Guide for HappyCareer

## 🆓 **Best Free Hosting Options**

### **Option 1: Vercel + Railway (Recommended)**

#### **Frontend (Vercel)**
- **Cost**: Free tier includes 100GB bandwidth/month
- **Features**: 
  - Automatic deployments from GitHub
  - Global CDN
  - Serverless functions
  - Custom domains
- **Limits**: 
  - 100GB bandwidth/month
  - 100 serverless function executions/day
  - 10GB storage

#### **Backend (Railway)**
- **Cost**: Free tier includes $5 credit/month
- **Features**:
  - PostgreSQL database included
  - Automatic deployments
  - Custom domains
  - Environment variables
- **Limits**: 
  - $5 credit/month (usually enough for small apps)
  - 512MB RAM
  - Shared CPU

#### **Deployment Steps:**

1. **Deploy Frontend to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from frontend directory
   cd frontend
   vercel
   ```

2. **Deploy Backend to Railway:**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Deploy from backend directory
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables:**
   ```bash
   # In Railway dashboard
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret
   FRONTEND_URL=https://your-vercel-app.vercel.app
   
   # In Vercel dashboard
   NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
   NEXT_PUBLIC_MOONSHOT_API_KEY=your-api-key
   ```

### **Option 2: Render (Full Stack)**

#### **Free Tier Features:**
- **Cost**: Completely free
- **Features**:
  - PostgreSQL database
  - Automatic deployments
  - Custom domains
  - SSL certificates
- **Limits**:
  - 750 hours/month (spins down after 15 min inactivity)
  - 512MB RAM
  - Shared CPU

#### **Deployment Steps:**

1. **Create render.yaml:**
   ```yaml
   services:
     - type: web
       name: happycareer-frontend
       env: node
       buildCommand: cd frontend && npm install && npm run build
       startCommand: cd frontend && npm start
       envVars:
         - key: NEXT_PUBLIC_API_URL
           value: https://happycareer-backend.onrender.com/api
   
     - type: web
       name: happycareer-backend
       env: node
       buildCommand: cd backend && npm install
       startCommand: cd backend && npm start
       envVars:
         - key: DATABASE_URL
           fromDatabase:
             name: happycareer-db
             property: connectionString
   
   databases:
     - name: happycareer-db
       databaseName: happycareer
       user: happycareer
   ```

2. **Deploy:**
   - Connect GitHub repository to Render
   - Render will automatically detect and deploy

### **Option 3: Netlify (Frontend) + Supabase (Backend)**

#### **Netlify (Frontend)**
- **Cost**: Free tier includes 100GB bandwidth/month
- **Features**:
  - Global CDN
  - Form handling
  - Serverless functions
  - Custom domains

#### **Supabase (Backend + Database)**
- **Cost**: Free tier includes 500MB database
- **Features**:
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Storage
  - Edge functions

#### **Deployment Steps:**

1. **Deploy Frontend to Netlify:**
   ```bash
   # Install Netlify CLI
   npm i -g netlify-cli
   
   # Deploy
   cd frontend
   netlify deploy --prod
   ```

2. **Setup Supabase:**
   - Create account at supabase.com
   - Create new project
   - Use Supabase's PostgreSQL database
   - Deploy backend functions to Supabase Edge Functions

### **Option 4: Fly.io (Full Stack)**

#### **Free Tier Features:**
- **Cost**: Free tier includes 3 shared-cpu VMs
- **Features**:
  - PostgreSQL database
  - Global edge deployment
  - Custom domains
  - SSL certificates
- **Limits**:
  - 3 shared-cpu VMs
  - 3GB persistent volume storage
  - 160GB outbound data transfer

#### **Deployment Steps:**

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Deploy:**
   ```bash
   # Deploy backend
   cd backend
   fly launch
   
   # Deploy frontend
   cd frontend
   fly launch
   ```

## 🔧 **Environment Setup for Production**

### **Required Environment Variables:**

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_MOONSHOT_API_KEY=your-moonshot-api-key
NEXT_PUBLIC_REDIS_URL=redis://your-redis-url

# Backend (.env)
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-url.com
REDIS_URL=redis://your-redis-url
NODE_ENV=production
```

### **Database Setup:**

1. **PostgreSQL:**
   - Use hosted PostgreSQL (Railway, Supabase, Render)
   - Run migrations: `npx prisma migrate deploy`

2. **Redis (Optional):**
   - Use hosted Redis (Upstash, Redis Cloud)
   - Or skip Redis for free tier

## 🚀 **Quick Deploy Commands**

### **Vercel + Railway (Recommended):**

```bash
# 1. Deploy Frontend
cd frontend
vercel --prod

# 2. Deploy Backend
cd backend
railway up

# 3. Set environment variables in Railway dashboard
# 4. Update frontend environment variables in Vercel dashboard
```

### **Render (Simplest):**

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# 2. Connect repository to Render
# 3. Render will auto-deploy
```

## 📊 **Free Tier Comparison**

| Platform | Frontend | Backend | Database | Bandwidth | Cost |
|----------|----------|---------|----------|-----------|------|
| Vercel + Railway | ✅ | ✅ | ✅ | 100GB | Free |
| Render | ✅ | ✅ | ✅ | Unlimited | Free |
| Netlify + Supabase | ✅ | ✅ | ✅ | 100GB | Free |
| Fly.io | ✅ | ✅ | ✅ | 160GB | Free |

## 🎯 **Recommendation**

**For your HappyCareer app, I recommend:**

1. **Vercel + Railway** (Best for production)
   - Most reliable
   - Best developer experience
   - Good free tier limits

2. **Render** (Simplest setup)
   - Single platform
   - Easy deployment
   - Good for beginners

## 🔗 **Next Steps**

1. **Choose your platform**
2. **Set up environment variables**
3. **Deploy frontend and backend**
4. **Configure custom domain (optional)**
5. **Test all features**

Would you like me to help you deploy to any specific platform? 