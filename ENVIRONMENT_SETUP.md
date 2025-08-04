# 🔧 Environment Setup Guide - Enhanced AI Features

This guide covers the complete environment setup for HappyCareer with all the new AI optimizations and monitoring features.

## 🚀 Quick Setup

### **1. Frontend Environment Variables**

Create a `.env.local` file in the `frontend` directory:

```bash
# AI Configuration
NEXT_PUBLIC_MOONSHOT_API_KEY=your_moonshot_api_key_here

# Redis Configuration (Optional - for caching)
NEXT_PUBLIC_REDIS_URL=redis://localhost:6379

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# App Configuration
NEXT_PUBLIC_APP_NAME=HappyCareer
NEXT_PUBLIC_APP_VERSION=1.0.0

# Performance Monitoring
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_DEBUG_AI=false
```

### **2. Backend Environment Variables**

Create a `.env` file in the `backend` directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/happycareer"

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=4000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Redis Configuration (for session storage and caching)
REDIS_URL=redis://localhost:6379

# AI Service Configuration
MOONSHOT_API_KEY=your_moonshot_api_key_here

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## 🔧 Installation Steps

### **1. Install Dependencies**

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

### **2. Database Setup**

```bash
# Generate Prisma client
cd backend
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database (optional)
npm run db:seed
```

### **3. Redis Setup (Optional but Recommended)**

**For Development:**
```bash
# Install Redis on macOS
brew install redis

# Start Redis
brew services start redis

# Test Redis connection
redis-cli ping
```

**For Production:**
```bash
# Using Docker
docker run -d --name redis -p 6379:6379 redis:alpine

# Or use a cloud Redis service (Redis Cloud, AWS ElastiCache, etc.)
```

### **4. Start Development Servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🎯 Feature Configuration

### **AI Service Configuration**

The AI service automatically configures based on environment variables:

```typescript
// Automatic configuration in ai-service.ts
this.model = new ChatMoonshot({
  apiKey: process.env.NEXT_PUBLIC_MOONSHOT_API_KEY || "placeholder",
  model: "moonshot-v1-8k", // or "moonshot-v1-32k"
  temperature: 0.7,
});

// Redis caching (optional)
if (process.env.NEXT_PUBLIC_REDIS_URL) {
  this.redis = new Redis(process.env.NEXT_PUBLIC_REDIS_URL);
}
```

### **Rate Limiting Configuration**

Client-side rate limiting is configured per feature:

```typescript
// Rate limits for different AI operations
export const aiRateLimiter = new RateLimiter({
  maxRequests: 5,  // 5 requests per minute
  windowMs: 60000  // 1 minute window
});

export const recommendationRateLimiter = new RateLimiter({
  maxRequests: 3,  // 3 recommendation requests per minute
  windowMs: 60000
});

export const resumeAnalysisRateLimiter = new RateLimiter({
  maxRequests: 2,  // 2 resume analysis requests per minute
  windowMs: 60000
});
```

### **Performance Monitoring Configuration**

Performance monitoring is enabled by default and tracks:

- AI operation response times
- Success/failure rates
- User interactions
- Cache hit rates

```typescript
// Enable/disable monitoring
performanceMonitor.setEnabled(true);

// Track custom operations
performanceMonitor.trackOperation('custom-ai-operation', startTime, success, error);
```

## 🔒 Security Configuration

### **API Key Management**

1. **Never commit API keys to version control**
2. **Use environment variables for all sensitive data**
3. **Rotate API keys regularly**
4. **Use different keys for development and production**

### **Rate Limiting**

The application implements multiple layers of rate limiting:

1. **Client-side rate limiting** - Prevents excessive requests from the browser
2. **Server-side rate limiting** - Protects the API from abuse
3. **AI-specific rate limiting** - Controls AI service usage

### **CORS Configuration**

```typescript
// Backend CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 📊 Monitoring and Analytics

### **Performance Metrics**

The application automatically tracks:

- **AI Response Times**: Average, min, max response times
- **Success Rates**: Percentage of successful AI operations
- **Cache Performance**: Hit rates and cache efficiency
- **User Interactions**: Feature usage and engagement

### **Accessing Performance Data**

```typescript
// Get performance statistics
const stats = performanceMonitor.getStats('job-recommendations');
console.log(`Average response time: ${stats.averageDuration}ms`);
console.log(`Success rate: ${stats.successRate}%`);

// Get user interaction analytics
const interactions = performanceMonitor.getInteractionStats();
console.log('Feature usage:', interactions);

// Export all data
const allData = performanceMonitor.exportData();
```

### **Production Monitoring**

In production, metrics are automatically sent to the backend:

```typescript
// Auto-send metrics every 5 minutes
setInterval(() => {
  performanceMonitor.sendMetricsToBackend()
}, 5 * 60 * 1000);
```

## 🚀 Production Deployment

### **Environment Variables for Production**

```bash
# Production environment variables
NODE_ENV=production
NEXT_PUBLIC_MOONSHOT_API_KEY=your_production_api_key
NEXT_PUBLIC_REDIS_URL=redis://your-redis-instance:6379
NEXT_PUBLIC_API_URL=https://your-api-domain.com
DATABASE_URL=postgresql://user:pass@your-db-instance:5432/happycareer
JWT_SECRET=your_production_jwt_secret
```

### **Docker Configuration**

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_MOONSHOT_API_KEY=${MOONSHOT_API_KEY}
      - NEXT_PUBLIC_REDIS_URL=${REDIS_URL}
  
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=happycareer
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## 🔧 Troubleshooting

### **Common Issues**

1. **"API key not configured" error**
   - Ensure `NEXT_PUBLIC_MOONSHOT_API_KEY` is set
   - Restart the development server after adding environment variables

2. **Redis connection errors**
   - Check if Redis is running: `redis-cli ping`
   - Verify `NEXT_PUBLIC_REDIS_URL` format
   - The app will work without Redis (caching disabled)

3. **Rate limiting issues**
   - Check browser console for rate limit messages
   - Wait for the rate limit window to reset
   - Adjust rate limits in `rate-limiter.ts` if needed

4. **Performance monitoring not working**
   - Check if `NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING` is set to `true`
   - Look for console logs from performance monitor
   - Check localStorage for stored metrics

### **Debug Mode**

Enable debug logging by setting:

```bash
NEXT_PUBLIC_DEBUG_AI=true
```

This will log detailed AI requests and responses to the console.

## 📈 Performance Optimization

### **Caching Strategy**

- **AI Responses**: Cached for 1 hour in Redis
- **User Data**: Cached in localStorage
- **Static Assets**: Cached by browser

### **Rate Limiting Strategy**

- **Job Recommendations**: 3 requests per minute
- **Resume Analysis**: 2 requests per minute
- **Description Enhancement**: 5 requests per minute

### **Error Handling**

- **Graceful Degradation**: Features work without AI
- **Retry Logic**: Automatic retries for failed requests
- **User Feedback**: Clear error messages and recovery options

## 🎉 Success Metrics

Track these metrics to measure success:

1. **AI Performance**
   - Average response time < 3 seconds
   - Success rate > 95%
   - Cache hit rate > 60%

2. **User Engagement**
   - AI feature usage > 70%
   - User satisfaction scores
   - Feature adoption rates

3. **System Performance**
   - API response times < 500ms
   - Error rates < 1%
   - Uptime > 99.9%

---

*Environment setup completed! Your HappyCareer application is now ready with enhanced AI features, caching, rate limiting, and performance monitoring.* 🚀 