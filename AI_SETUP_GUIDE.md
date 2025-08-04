# 🤖 AI Integration Setup Guide

This guide will help you set up the AI features in HappyCareer using Kimi K2 (Moonshot AI) and LangChain.

## 🚀 Quick Start

### 1. Get Moonshot AI API Key

1. Visit [Moonshot AI Platform](https://platform.moonshot.cn/)
2. Sign up for an account
3. Navigate to the API section
4. Generate a new API key
5. Copy the API key for use in your application

### 2. Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
# Frontend Environment Variables

# AI Configuration
NEXT_PUBLIC_MOONSHOT_API_KEY=your_moonshot_api_key_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Other Configuration
NEXT_PUBLIC_APP_NAME=HappyCareer
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Install Dependencies

The required dependencies are already installed:
- `@langchain/community` - LangChain community providers
- `@langchain/core` - Core LangChain functionality

### 4. Test the Integration

1. Start your development servers:
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm run dev
   ```

2. Navigate to the jobs page and look for the "AI-Powered Job Recommendations" section
3. Click "Get AI Recommendations" to test the integration

## 🎯 AI Features Available

### 1. Job Recommendations
- **Location**: Jobs page (`/jobs`)
- **Function**: Analyzes user profile and available jobs to provide personalized recommendations
- **API Endpoint**: `/api/ai/recommendations`

### 2. Resume Analysis
- **Location**: Dashboard (`/dashboard`)
- **Function**: Extracts skills, experience, and information from resume text
- **API Endpoint**: `/api/ai/resume-analysis`

### 3. Job Description Enhancement
- **Location**: Post Job page (`/post-job`)
- **Function**: Improves job descriptions with AI suggestions
- **API Endpoint**: `/api/ai/enhance-description`

## 🔧 Configuration Options

### AI Service Configuration

You can modify the AI service configuration in `frontend/src/lib/ai-service.ts`:

```typescript
// Model configuration
this.model = new ChatMoonshot({
  apiKey: process.env.NEXT_PUBLIC_MOONSHOT_API_KEY || "placeholder",
  model: "moonshot-v1-8k", // or "moonshot-v1-32k" for longer context
  temperature: 0.7, // Adjust creativity (0.0 = deterministic, 1.0 = creative)
});
```

### Prompt Customization

You can customize the AI prompts in the same file:

```typescript
// Example: Customize job matching prompt
const jobMatchingPrompt = ChatPromptTemplate.fromTemplate(`
Your custom prompt here...
`);
```

## 🧪 Testing AI Features

### Test Job Recommendations

1. Create a user account with skills and experience
2. Add some sample jobs to the database
3. Navigate to `/jobs`
4. Click "Get AI Recommendations"
5. Verify that recommendations are generated with match scores

### Test Resume Analysis

1. Navigate to `/dashboard`
2. Click "Analyze Resume"
3. Upload a text resume or paste resume text
4. Verify that skills and experience are extracted

### Test Description Enhancement

1. Navigate to `/post-job`
2. Enter a basic job description
3. Click "Enhance with AI"
4. Verify that the description is improved

## 🚨 Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Ensure `NEXT_PUBLIC_MOONSHOT_API_KEY` is set in `.env.local`
   - Restart the development server after adding the environment variable

2. **"Failed to get AI recommendations" error**
   - Check your internet connection
   - Verify the API key is valid
   - Check the browser console for detailed error messages

3. **Slow response times**
   - This is normal for AI processing
   - Consider implementing loading states
   - The first request may take longer due to cold start

4. **JSON parsing errors**
   - The AI might return malformed JSON
   - Check the AI service error handling
   - Consider adding retry logic

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```bash
NEXT_PUBLIC_DEBUG_AI=true
```

This will log AI requests and responses to the console.

## 📊 Performance Optimization

### 1. Caching
Consider implementing caching for AI responses:

```typescript
// Example: Cache job recommendations
const cacheKey = `recommendations_${userProfile.id}_${jobsHash}`
const cached = localStorage.getItem(cacheKey)
if (cached) {
  return JSON.parse(cached)
}
```

### 2. Batch Processing
For multiple AI operations, consider batching:

```typescript
// Example: Batch resume analysis
const batchAnalysis = await Promise.all(
  resumes.map(resume => aiService.analyzeResume(resume))
)
```

### 3. Rate Limiting
Implement client-side rate limiting:

```typescript
// Example: Rate limiting
const RATE_LIMIT_DELAY = 1000 // 1 second
let lastRequest = 0

const rateLimitedRequest = async () => {
  const now = Date.now()
  if (now - lastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY))
  }
  lastRequest = now
  // Make AI request
}
```

## 🔒 Security Considerations

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables
   - Consider using a backend proxy for production

2. **Input Validation**
   - Validate all user inputs before sending to AI
   - Sanitize resume text and job descriptions
   - Implement input length limits

3. **Error Handling**
   - Don't expose sensitive information in error messages
   - Log errors securely
   - Implement graceful fallbacks

## 🚀 Production Deployment

### 1. Environment Variables
Set production environment variables:

```bash
# Production
NEXT_PUBLIC_MOONSHOT_API_KEY=your_production_api_key
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### 2. API Key Management
For production, consider:
- Using a backend proxy to hide API keys
- Implementing API key rotation
- Monitoring API usage and costs

### 3. Monitoring
Implement monitoring for:
- AI request success rates
- Response times
- Error rates
- API usage costs

## 📈 Cost Optimization

### 1. Request Optimization
- Limit the number of jobs sent to AI (currently 15)
- Cache responses when possible
- Implement user quotas

### 2. Model Selection
- Use `moonshot-v1-8k` for most use cases
- Use `moonshot-v1-32k` only for complex analysis
- Monitor token usage

### 3. Prompt Optimization
- Keep prompts concise
- Use structured output formats
- Avoid redundant information

## 🎉 Success Metrics

Track these metrics to measure AI feature success:

1. **User Engagement**
   - Percentage of users using AI features
   - Time spent on AI-enhanced pages
   - Feature adoption rates

2. **Quality Metrics**
   - Job application success rates
   - User satisfaction scores
   - Recommendation click-through rates

3. **Technical Metrics**
   - AI response times
   - Error rates
   - API usage costs

## 📚 Additional Resources

- [Moonshot AI Documentation](https://platform.moonshot.cn/docs)
- [LangChain Documentation](https://js.langchain.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

Happy coding! 🚀 