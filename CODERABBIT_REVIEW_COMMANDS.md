# 🔍 CodeRabbit Review Commands for HappyCareer

## 🚀 Quick Start Commands

### **1. Install CodeRabbit**
```bash
# Install globally
npm install -g @coderabbit/cli

# Or use npx (recommended)
npx @coderabbit/cli@latest
```

### **2. Initialize in Project**
```bash
# Navigate to project root
cd /Users/carterpc/ft_userdata

# Initialize CodeRabbit
coderabbit init

# Authenticate with GitHub
coderabbit auth
```

---

## 🧠 Psychology Framework Reviews

### **Dopamine Engine Review**
```bash
# Review the dopamine trigger implementation
coderabbit review frontend/src/components/psychology/DopamineEngine.tsx \
  --prompt "Review the implementation of variable reward schedules, probability calculations, user engagement triggers, and ethical considerations for psychological manipulation"

# Review with focus on gamification
coderabbit review frontend/src/components/psychology/DopamineEngine.tsx \
  --focus psychology \
  --prompt "Check for proper gamification implementation, user consent, accessibility, and ethical use of psychological triggers"
```

### **Social Proof Review**
```bash
# Review social proof implementation
coderabbit review frontend/src/components/psychology/SocialProof.tsx \
  --prompt "Review social proof psychology implementation, live activity feeds, testimonials, trust signals, and ethical considerations"

# Review with focus on user trust
coderabbit review frontend/src/components/psychology/SocialProof.tsx \
  --focus psychology \
  --prompt "Analyze trust building mechanisms, authenticity of social proof, and potential for manipulation"
```

### **Business Analytics Review**
```bash
# Review analytics dashboard
coderabbit review frontend/src/components/analytics/BusinessDashboard.tsx \
  --prompt "Review analytics implementation, conversion tracking, psychological insights, and data privacy considerations"

# Review with focus on business metrics
coderabbit review frontend/src/components/analytics/BusinessDashboard.tsx \
  --focus business \
  --prompt "Check for proper KPI tracking, conversion funnel analysis, and business intelligence implementation"
```

---

## 🎨 Frontend Component Reviews

### **Hero Component Review**
```bash
# Review the main hero component
coderabbit review frontend/src/components/home/ModernHero.tsx \
  --prompt "Review React component implementation, TypeScript types, accessibility, performance optimizations, and psychological trigger integration"

# Review with focus on UX
coderabbit review frontend/src/components/home/ModernHero.tsx \
  --focus ux \
  --prompt "Analyze user experience, conversion optimization, call-to-action effectiveness, and mobile responsiveness"
```

### **Featured Jobs Review**
```bash
# Review job listings component
coderabbit review frontend/src/components/home/FeaturedJobs.tsx \
  --prompt "Review job listing implementation, API integration, error handling, loading states, and user interaction patterns"

# Review with focus on performance
coderabbit review frontend/src/components/home/FeaturedJobs.tsx \
  --focus performance \
  --prompt "Check for proper data fetching, caching strategies, bundle optimization, and rendering performance"
```

### **CSS and Styling Review**
```bash
# Review global styles
coderabbit review frontend/src/app/globals.css \
  --prompt "Review CSS implementation, animations, accessibility, color contrast, and responsive design"

# Review with focus on accessibility
coderabbit review frontend/src/app/globals.css \
  --focus accessibility \
  --prompt "Check for proper color contrast, focus management, screen reader compatibility, and keyboard navigation"
```

---

## 🔧 Backend API Reviews

### **Authentication Review**
```bash
# Review authentication routes
coderabbit review backend/src/routes/auth.ts \
  --prompt "Review JWT implementation, password hashing, authentication security, input validation, and error handling"

# Review with focus on security
coderabbit review backend/src/routes/auth.ts \
  --focus security \
  --prompt "Analyze security vulnerabilities, authentication bypass risks, session management, and data protection"
```

### **API Endpoints Review**
```bash
# Review all API routes
coderabbit review backend/src/routes/ \
  --prompt "Review API design, RESTful principles, error handling, input validation, and business logic implementation"

# Review with focus on performance
coderabbit review backend/src/routes/ \
  --focus performance \
  --prompt "Check for proper database queries, caching strategies, response optimization, and scalability considerations"
```

### **Middleware Review**
```bash
# Review middleware implementation
coderabbit review backend/src/middleware/ \
  --prompt "Review CORS configuration, rate limiting, authentication middleware, error handling, and security headers"

# Review with focus on security
coderabbit review backend/src/middleware/ \
  --focus security \
  --prompt "Analyze security middleware, input sanitization, XSS prevention, and CSRF protection"
```

---

## 🗄️ Database and Schema Reviews

### **Prisma Schema Review**
```bash
# Review database schema
coderabbit review backend/prisma/schema.prisma \
  --prompt "Review database schema design, relationships, constraints, indexes, and data integrity"

# Review with focus on performance
coderabbit review backend/prisma/schema.prisma \
  --focus performance \
  --prompt "Check for proper indexing, query optimization, normalization, and scalability considerations"
```

### **Database Seeding Review**
```bash
# Review seed script
coderabbit review backend/src/scripts/seed.ts \
  --prompt "Review database seeding implementation, data quality, relationships, and sample data generation"

# Review with focus on data integrity
coderabbit review backend/src/scripts/seed.ts \
  --focus database \
  --prompt "Check for proper data relationships, foreign key constraints, and data consistency"
```

---

## 🔒 Security Reviews

### **Comprehensive Security Review**
```bash
# Review entire backend for security
coderabbit review backend/src/ \
  --focus security \
  --prompt "Comprehensive security review: authentication, authorization, input validation, SQL injection prevention, XSS protection, and data encryption"

# Review frontend for security
coderabbit review frontend/src/ \
  --focus security \
  --prompt "Frontend security review: XSS prevention, CSRF protection, input sanitization, and secure data handling"
```

### **Environment Configuration Review**
```bash
# Review environment setup
coderabbit review backend/env.example \
  --prompt "Review environment configuration, security best practices, and sensitive data handling"

# Review with focus on secrets management
coderabbit review backend/env.example \
  --focus security \
  --prompt "Check for proper secrets management, environment variable security, and configuration validation"
```

---

## ⚡ Performance Reviews

### **Frontend Performance Review**
```bash
# Review frontend performance
coderabbit review frontend/src/ \
  --focus performance \
  --prompt "Frontend performance review: bundle optimization, lazy loading, memoization, image optimization, and rendering performance"

# Review specific performance aspects
coderabbit review frontend/src/ \
  --prompt "Check for React performance optimizations, unnecessary re-renders, memory leaks, and code splitting"
```

### **Backend Performance Review**
```bash
# Review backend performance
coderabbit review backend/src/ \
  --focus performance \
  --prompt "Backend performance review: database queries, caching strategies, API response optimization, and resource management"

# Review with focus on scalability
coderabbit review backend/src/ \
  --prompt "Analyze scalability considerations, database connection pooling, memory usage, and concurrent request handling"
```

---

## 🧪 Testing Reviews

### **Test Coverage Review**
```bash
# Review test implementation
coderabbit review frontend/src/components/home/Hero.test.tsx \
  --prompt "Review test implementation, coverage, mocking strategies, and test quality"

# Review with focus on testing best practices
coderabbit review frontend/src/components/home/Hero.test.tsx \
  --focus testing \
  --prompt "Check for proper test structure, assertions, mocking, and edge case coverage"
```

---

## 📊 Business Logic Reviews

### **Conversion Optimization Review**
```bash
# Review conversion optimization
coderabbit review frontend/src/ \
  --focus business \
  --prompt "Review conversion optimization implementation, user flow analysis, A/B testing setup, and analytics integration"

# Review with focus on user experience
coderabbit review frontend/src/ \
  --prompt "Analyze user experience optimization, conversion funnel implementation, and business intelligence features"
```

### **Analytics Implementation Review**
```bash
# Review analytics setup
coderabbit review frontend/src/components/analytics/ \
  --focus business \
  --prompt "Review analytics implementation, data tracking, privacy compliance, and business intelligence features"

# Review with focus on data privacy
coderabbit review frontend/src/components/analytics/ \
  --prompt "Check for proper data privacy implementation, GDPR compliance, user consent, and data anonymization"
```

---

## 🎯 Comprehensive Reviews

### **Full Project Review**
```bash
# Review entire project
coderabbit review . \
  --prompt "Comprehensive review of HappyCareer project: code quality, security, performance, psychology implementation, business logic, and best practices"

# Generate comprehensive report
coderabbit report --output comprehensive-review.md
```

### **Psychology Framework Comprehensive Review**
```bash
# Review all psychology components
coderabbit review frontend/src/components/psychology/ \
  --prompt "Comprehensive review of psychology framework: ethical implementation, user consent, accessibility, data privacy, and business impact"

# Generate psychology-specific report
coderabbit report --focus psychology --output psychology-review.md
```

### **Security Comprehensive Review**
```bash
# Review all security aspects
coderabbit review . \
  --focus security \
  --prompt "Comprehensive security review: authentication, authorization, data protection, input validation, and vulnerability assessment"

# Generate security report
coderabbit report --focus security --output security-review.md
```

---

## 📈 Report Generation

### **Generate Specific Reports**
```bash
# Generate psychology framework report
coderabbit report --focus psychology --output psychology-report.md

# Generate security report
coderabbit report --focus security --output security-report.md

# Generate performance report
coderabbit report --focus performance --output performance-report.md

# Generate business logic report
coderabbit report --focus business --output business-report.md

# Generate accessibility report
coderabbit report --focus accessibility --output accessibility-report.md
```

### **Generate Trend Analysis**
```bash
# Generate trend analysis
coderabbit trends --period 30d --output trends-report.md

# Generate comparison report
coderabbit compare --baseline main --output comparison-report.md
```

---

## 🎮 Interactive Reviews

### **Dashboard Access**
```bash
# Open CodeRabbit dashboard
coderabbit dashboard

# View metrics
coderabbit metrics

# View logs
coderabbit logs
```

### **Real-time Monitoring**
```bash
# Monitor reviews in real-time
coderabbit monitor

# Watch specific files
coderabbit watch frontend/src/components/psychology/
```

---

## 🚨 Quick Fix Commands

### **Auto-fix Safe Issues**
```bash
# Auto-fix formatting issues
coderabbit fix --safe-only

# Auto-fix specific file
coderabbit fix frontend/src/components/psychology/DopamineEngine.tsx

# Auto-fix with specific focus
coderabbit fix --focus formatting frontend/src/
```

### **Validation Commands**
```bash
# Validate configuration
coderabbit validate

# Check project status
coderabbit status

# Test configuration
coderabbit test
```

---

**🎯 These commands will help you comprehensively review your HappyCareer project using CodeRabbit's AI-powered analysis!**

Each command is specifically tailored to review different aspects of your psychologically-optimized business platform, ensuring code quality, security, performance, and ethical implementation. 