# 🔍 CodeRabbit Setup Guide for HappyCareer

## 🎯 Overview

This guide will help you set up CodeRabbit for comprehensive AI-powered code reviews of the HappyCareer project. CodeRabbit will analyze your code for:

- **Code Quality** & Best Practices
- **Security Vulnerabilities**
- **Performance Issues**
- **Accessibility Concerns**
- **Psychological Framework Implementation**
- **Business Logic Validation**

---

## 🚀 Quick Setup

### 1. **Install CodeRabbit CLI**
```bash
# Install globally
npm install -g @coderabbit/cli

# Or use npx
npx @coderabbit/cli@latest
```

### 2. **Initialize CodeRabbit**
```bash
# Navigate to your project root
cd /path/to/happycareer

# Initialize CodeRabbit
coderabbit init
```

### 3. **Configure GitHub Integration**
```bash
# Authenticate with GitHub
coderabbit auth

# Connect to your repository
coderabbit connect --repo your-username/happycareer
```

---

## 📋 Configuration Details

### **Current Configuration**
The `.coderabbit.yaml` file is already configured with:

#### **Review Areas**
- ✅ **Frontend**: React/Next.js, TypeScript, CSS
- ✅ **Backend**: Node.js, Express, Prisma
- ✅ **Psychology**: Dopamine triggers, social proof, gamification
- ✅ **Business**: Analytics, conversion optimization, user flow
- ✅ **Security**: Authentication, authorization, data validation
- ✅ **Performance**: Bundle optimization, caching, database queries

#### **Quality Gates**
- **Minimum Code Quality Score**: 7.0/10
- **Minimum Security Score**: 8.0/10
- **Minimum Test Coverage**: 70%
- **Maximum Complexity**: 10
- **Maximum Function Length**: 50 lines

---

## 🎮 How to Use CodeRabbit

### **1. Automatic Reviews**
CodeRabbit will automatically review:
- All pull requests
- Commits to main branch
- File changes
- New code additions

### **2. Manual Reviews**
```bash
# Review specific files
coderabbit review frontend/src/components/psychology/DopamineEngine.tsx

# Review entire directory
coderabbit review frontend/src/

# Review with specific focus
coderabbit review --focus security backend/src/
```

### **3. Custom Review Prompts**
```bash
# Review psychology implementation
coderabbit review --prompt "Review the implementation of variable reward schedules and dopamine triggers"

# Review business logic
coderabbit review --prompt "Check for proper conversion optimization and user flow implementation"

# Review security
coderabbit review --prompt "Analyze authentication, authorization, and data validation"
```

---

## 🔍 Review Focus Areas

### **1. Frontend Components**
```bash
# Review React components
coderabbit review frontend/src/components/ --focus frontend

# Review TypeScript types
coderabbit review frontend/src/types/ --focus typescript

# Review CSS and styling
coderabbit review frontend/src/styles/ --focus css
```

### **2. Backend API**
```bash
# Review API endpoints
coderabbit review backend/src/routes/ --focus backend

# Review database schema
coderabbit review backend/prisma/ --focus database

# Review authentication
coderabbit review backend/src/middleware/ --focus security
```

### **3. Psychology Framework**
```bash
# Review dopamine engine
coderabbit review frontend/src/components/psychology/ --focus psychology

# Review social proof implementation
coderabbit review --prompt "Review social proof psychology implementation"

# Review gamification elements
coderabbit review --prompt "Check gamification and engagement features"
```

### **4. Business Analytics**
```bash
# Review analytics dashboard
coderabbit review frontend/src/components/analytics/ --focus business

# Review conversion optimization
coderabbit review --prompt "Review conversion funnel and optimization"

# Review user experience
coderabbit review --prompt "Analyze user experience and interface design"
```

---

## 📊 Review Reports

### **1. Generate Reports**
```bash
# Generate comprehensive report
coderabbit report --output report.md

# Generate security report
coderabbit report --focus security --output security-report.md

# Generate performance report
coderabbit report --focus performance --output performance-report.md

# Generate psychology framework report
coderabbit report --focus psychology --output psychology-report.md
```

### **2. View Dashboard**
```bash
# Open CodeRabbit dashboard
coderabbit dashboard

# View trends and metrics
coderabbit metrics
```

---

## 🎯 Specific Review Commands

### **Psychology Framework Review**
```bash
# Review dopamine triggers
coderabbit review frontend/src/components/psychology/DopamineEngine.tsx \
  --prompt "Review variable reward schedules, probability calculations, and user engagement triggers"

# Review social proof
coderabbit review frontend/src/components/psychology/SocialProof.tsx \
  --prompt "Review social proof implementation, live activity feeds, and trust signals"

# Review business analytics
coderabbit review frontend/src/components/analytics/BusinessDashboard.tsx \
  --prompt "Review analytics implementation, conversion tracking, and psychological insights"
```

### **Security Review**
```bash
# Review authentication
coderabbit review backend/src/routes/auth.ts \
  --prompt "Review JWT implementation, password hashing, and authentication security"

# Review API security
coderabbit review backend/src/middleware/ \
  --prompt "Review CORS, rate limiting, input validation, and security headers"

# Review data validation
coderabbit review backend/src/ \
  --prompt "Review input sanitization, SQL injection prevention, and data validation"
```

### **Performance Review**
```bash
# Review frontend performance
coderabbit review frontend/src/ \
  --prompt "Review bundle optimization, lazy loading, memoization, and performance best practices"

# Review backend performance
coderabbit review backend/src/ \
  --prompt "Review database queries, caching strategies, and API response optimization"

# Review database performance
coderabbit review backend/prisma/ \
  --prompt "Review database schema, indexes, relationships, and query optimization"
```

---

## 🔧 Custom Configuration

### **Add Custom Rules**
```yaml
# Add to .coderabbit.yaml
rules:
  psychology:
    - "Variable reward schedules must be properly implemented"
    - "Social proof elements must be ethically designed"
    - "Gamification must not be manipulative"
    - "User consent must be obtained for psychological triggers"
  
  business:
    - "Conversion optimization must be data-driven"
    - "Analytics must respect user privacy"
    - "User experience must be accessible to all"
    - "Business logic must be clearly documented"
```

### **Custom Review Templates**
```yaml
# Add to .coderabbit.yaml
templates:
  psychology_review: |
    ## 🧠 Psychology Framework Review
    
    ### ✅ Strengths
    - [List positive psychological implementations]
    
    ### ⚠️ Areas for Improvement
    - [List areas needing attention]
    
    ### 🚨 Ethical Concerns
    - [List any ethical issues]
    
    ### 💡 Suggestions
    - [List improvement suggestions]
    
    ### 📊 Impact Assessment
    - User engagement potential: [X/10]
    - Ethical implementation: [X/10]
    - Accessibility compliance: [X/10]
```

---

## 📈 Continuous Integration

### **GitHub Actions Integration**
```yaml
# .github/workflows/coderabbit.yml
name: CodeRabbit Review

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main ]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: coderabbit/action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          config: .coderabbit.yaml
```

### **Pre-commit Hooks**
```bash
# Install pre-commit
pip install pre-commit

# Add to .pre-commit-config.yaml
repos:
  - repo: https://github.com/coderabbit/pre-commit
    rev: v1.0.0
    hooks:
      - id: coderabbit
        args: [--config, .coderabbit.yaml]
```

---

## 🎯 Review Checklist

### **Before Running Reviews**
- [ ] Code is committed and pushed
- [ ] Tests are passing
- [ ] Documentation is updated
- [ ] Environment variables are configured
- [ ] Dependencies are installed

### **Review Focus Areas**
- [ ] **Code Quality**: TypeScript types, error handling, documentation
- [ ] **Security**: Authentication, authorization, input validation
- [ ] **Performance**: Bundle size, database queries, caching
- [ ] **Psychology**: Ethical implementation, user consent, accessibility
- [ ] **Business**: Conversion optimization, analytics, user experience
- [ ] **Testing**: Coverage, quality, mocking strategies

---

## 🚨 Common Issues & Solutions

### **1. Authentication Issues**
```bash
# Re-authenticate with GitHub
coderabbit auth --force

# Check token permissions
coderabbit status
```

### **2. Configuration Issues**
```bash
# Validate configuration
coderabbit validate

# Reset configuration
coderabbit init --force
```

### **3. Review Failures**
```bash
# Check logs
coderabbit logs

# Run with verbose output
coderabbit review --verbose

# Check specific file
coderabbit review --debug filename.ts
```

---

## 📊 Metrics & Analytics

### **Track Review Quality**
```bash
# View review metrics
coderabbit metrics

# Export review data
coderabbit export --format json

# Generate trend analysis
coderabbit trends --period 30d
```

### **Quality Gates**
- **Code Quality**: Must score 7.0+ to pass
- **Security**: Must score 8.0+ to pass
- **Performance**: Must meet optimization targets
- **Psychology**: Must be ethically implemented
- **Business**: Must follow best practices

---

## 🎉 Success Metrics

### **Short-term Goals**
- [ ] All critical security issues resolved
- [ ] Code quality score above 8.0
- [ ] Performance optimizations implemented
- [ ] Psychology framework ethically implemented

### **Long-term Goals**
- [ ] Automated review pipeline established
- [ ] Continuous improvement process in place
- [ ] Team adoption of CodeRabbit reviews
- [ ] Quality metrics consistently high

---

**🎯 Your HappyCareer project is now ready for comprehensive AI-powered code reviews with CodeRabbit!**

The configuration covers all aspects of your psychologically-optimized business platform, ensuring code quality, security, performance, and ethical implementation of psychological principles. 