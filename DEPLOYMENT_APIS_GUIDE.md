# HappyCareer Live Deployment - Required APIs & Authentication

## Overview
This guide lists all the APIs, authentication credentials, and services you need to deploy HappyCareer to a live server.

## 🔐 Required Services & APIs

### 1. **Database (Supabase - PostgreSQL)**
**Service**: Supabase (Recommended) or any PostgreSQL provider
**Required Credentials**:
```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

**Setup Steps**:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project reference from the URL
4. Go to Settings > API to get your keys
5. Use the connection string from Settings > Database

### 2. **AI Services (Moonshot AI)**
**Service**: Moonshot AI for job recommendations and resume analysis
**Required Credentials**:
```bash
NEXT_PUBLIC_MOONSHOT_API_KEY="your-moonshot-api-key-here"
```

**Setup Steps**:
1. Go to [moonshot.cn](https://moonshot.cn)
2. Sign up and get your API key
3. Add to frontend environment variables

### 3. **Email Service (SMTP)**
**Service**: Gmail, SendGrid, or any SMTP provider
**Required Credentials**:
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

**Setup Steps**:
- **Gmail**: Enable 2FA, generate App Password
- **SendGrid**: Sign up, get API key, use SMTP settings
- **AWS SES**: Use AWS credentials and SMTP settings

### 4. **File Upload (Cloudinary)**
**Service**: Cloudinary for resume and profile image uploads
**Required Credentials**:
```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Setup Steps**:
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create free account
3. Get credentials from Dashboard

### 5. **Caching (Redis)**
**Service**: Redis for session management and caching
**Required Credentials**:
```bash
NEXT_PUBLIC_REDIS_URL="redis://localhost:6379"
# For production: "redis://username:password@host:port"
```

**Setup Steps**:
- **Local**: Install Redis locally
- **Cloud**: Use Redis Cloud, AWS ElastiCache, or similar

### 6. **Authentication (JWT)**
**Service**: Built-in JWT authentication
**Required Credentials**:
```bash
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
```

**Setup Steps**:
1. Generate a strong random string (32+ characters)
2. Use environment variable for production

## 🚀 Deployment Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"

# Authentication
JWT_SECRET="[STRONG-RANDOM-STRING]"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV="production"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Frontend URL (for CORS)
FRONTEND_URL="https://your-domain.com"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_MOONSHOT_API_KEY=your-moonshot-api-key-here
NEXT_PUBLIC_REDIS_URL=redis://your-redis-host:6379
```

## 🌐 Domain & SSL Setup

### Required Domains:
1. **Frontend**: `https://your-domain.com` (or subdomain)
2. **Backend**: `https://api.your-domain.com` (or subdomain)

### SSL Certificates:
- Use Let's Encrypt (free)
- Or provider SSL (Vercel, Netlify, etc.)

## 📦 Deployment Platforms

### Option 1: Vercel (Frontend) + Railway (Backend)
**Frontend (Vercel)**:
- Connect GitHub repo
- Set environment variables
- Auto-deploy on push

**Backend (Railway)**:
- Connect GitHub repo
- Set environment variables
- Auto-deploy on push

### Option 2: DigitalOcean App Platform
- Deploy both frontend and backend
- Set environment variables
- Auto-scaling included

### Option 3: AWS/GCP/Azure
- Use container services
- Set up load balancers
- Configure auto-scaling

## 🔧 Pre-Deployment Checklist

### Database Setup:
- [ ] Create Supabase project
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Seed initial data: `npm run seed`

### Environment Variables:
- [ ] Set all backend environment variables
- [ ] Set all frontend environment variables
- [ ] Test API connections

### Security:
- [ ] Generate strong JWT secret
- [ ] Set up CORS properly
- [ ] Configure rate limiting
- [ ] Enable HTTPS

### Testing:
- [ ] Test user registration/login
- [ ] Test job posting/application
- [ ] Test file uploads
- [ ] Test email notifications

## 💰 Estimated Monthly Costs

### Free Tier Options:
- **Supabase**: Free tier (500MB database, 50MB file storage)
- **Cloudinary**: Free tier (25GB storage, 25GB bandwidth)
- **Vercel**: Free tier (100GB bandwidth)
- **Railway**: Free tier (limited usage)

### Paid Options (Recommended for Production):
- **Supabase**: $25/month (8GB database, 100GB file storage)
- **Cloudinary**: $89/month (225GB storage, 225GB bandwidth)
- **Vercel**: $20/month (1TB bandwidth)
- **Railway**: $5/month (basic plan)

## 🚨 Security Considerations

### Environment Variables:
- Never commit `.env` files to Git
- Use secure environment variable management
- Rotate keys regularly

### Database Security:
- Use connection pooling
- Enable SSL connections
- Set up proper user permissions

### API Security:
- Implement rate limiting
- Use HTTPS everywhere
- Validate all inputs
- Sanitize user data

## 📞 Support & Troubleshooting

### Common Issues:
1. **CORS Errors**: Check FRONTEND_URL in backend
2. **Database Connection**: Verify DATABASE_URL format
3. **File Upload**: Check Cloudinary credentials
4. **Email**: Verify SMTP settings

### Monitoring:
- Set up error tracking (Sentry)
- Monitor API response times
- Track user engagement metrics

## 🔄 CI/CD Setup

### GitHub Actions Example:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

This guide covers all the essential APIs and authentication needed to deploy HappyCareer to production. Make sure to test everything in a staging environment first! 