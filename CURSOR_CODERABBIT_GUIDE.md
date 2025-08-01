# CodeRabbit in Cursor - Quick Start Guide

## ✅ Setup Complete!
- ✅ CodeRabbit extension installed
- ✅ Cursor running with your project
- ✅ Configuration file created (`.coderabbit.yaml`)
- ✅ Project files cleaned and ready for review

## 🚀 How to Use CodeRabbit in Cursor

### 1. Open Command Palette
- Press `Cmd + Shift + P` (Mac)
- Type "CodeRabbit" to see available commands

### 2. Available CodeRabbit Commands
- **CodeRabbit: Initialize** - Set up CodeRabbit for the project
- **CodeRabbit: Request Review** - Request a code review
- **CodeRabbit: Review File** - Review a specific file
- **CodeRabbit: Review Workspace** - Review entire workspace

### 3. Quick Review Steps

#### Step 1: Initialize CodeRabbit
1. Open Command Palette (`Cmd + Shift + P`)
2. Type "CodeRabbit: Initialize"
3. Follow the setup wizard

#### Step 2: Review Critical Files
1. Open `user_data/strategies/sample_strategy.py`
2. Press `Cmd + Shift + P`
3. Type "CodeRabbit: Review File"
4. Add context: "This is a financial trading strategy. Focus on risk management and security."

#### Step 3: Review Configuration
1. Open `user_data/config.json`
2. Use "CodeRabbit: Review File"
3. Add context: "Review for security vulnerabilities and exposed secrets."

#### Step 4: Review Docker Setup
1. Open `docker-compose.yml`
2. Use "CodeRabbit: Review File"
3. Add context: "Review for security best practices and production readiness."

### 4. Custom Review Prompts

#### For Trading Strategy:
```
Please review this trading strategy for:
1. Risk management logic and potential edge cases
2. Mathematical accuracy of technical indicators
3. Error handling for market data issues
4. Security considerations for financial data
5. Performance optimization opportunities
```

#### For Configuration:
```
Please review this configuration for:
1. Security vulnerabilities and exposed secrets
2. Risk management parameters
3. Network security settings
4. Compliance with trading regulations
5. Best practices for production deployment
```

### 5. Review Results
- CodeRabbit will provide inline comments
- Check the "Problems" panel for issues
- Review suggestions in the "CodeRabbit" panel
- Apply suggested fixes using the quick-fix options

## 📁 Key Files Ready for Review

### High Priority:
1. **`user_data/strategies/sample_strategy.py`** - Main trading logic
2. **`user_data/config.json`** - Security and configuration
3. **`docker-compose.yml`** - Deployment setup

### Supporting Files:
- **`CODE_REVIEW_SUMMARY.md`** - Project overview
- **`SECURITY_REVIEW.md`** - Security analysis
- **`.coderabbit.yaml`** - CodeRabbit configuration

## 🎯 Focus Areas for Review

### Security (Critical):
- Exposed secrets in config
- API authentication
- Network security
- Data validation

### Risk Management (Critical):
- Stop-loss calculations
- Position sizing
- Error handling
- Circuit breakers

### Code Quality (Important):
- Error handling
- Logging practices
- Code organization
- Documentation

## 🔧 Troubleshooting

### If CodeRabbit doesn't appear:
1. Restart Cursor
2. Check if extension is enabled: `cursor --list-extensions | grep coderabbit`
3. Reinstall if needed: `cursor --install-extension "/path/to/coderabbit.vsix"`

### If reviews aren't working:
1. Check `.coderabbit.yaml` configuration
2. Ensure you're in the project root directory
3. Try reviewing individual files first

## 📞 Next Steps

1. **Start with the strategy file** - Most critical for trading logic
2. **Review configuration** - Security vulnerabilities
3. **Check Docker setup** - Production readiness
4. **Implement fixes** - Apply CodeRabbit suggestions
5. **Test changes** - Run backtests after fixes

---

**Ready to start reviewing!** 🚀

Open Cursor and use the Command Palette to begin your CodeRabbit review. 