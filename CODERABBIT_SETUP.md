# CodeRabbit Setup Guide for FreqTrade Project

## Overview
This guide explains how to use CodeRabbit to review the FreqTrade trading bot codebase.

## Prerequisites
- CodeRabbit VS Code extension installed
- Access to this FreqTrade project repository
- Understanding of Python, Docker, and trading bot concepts

## Project Structure for Review

### Key Files to Review
1. **`user_data/strategies/sample_strategy.py`** - Main trading strategy
2. **`user_data/config.json`** - Configuration and security settings
3. **`docker-compose.yml`** - Container configuration
4. **`CODE_REVIEW_SUMMARY.md`** - Project overview
5. **`SECURITY_REVIEW.md`** - Security analysis

### Supporting Files
- `user_data/strategies/sample_strategy.json` - Strategy metadata
- `user_data/backtest_results/` - Historical performance data
- `user_data/logs/` - Application logs

## CodeRabbit Configuration

### 1. Install CodeRabbit Extension
```bash
# If you have the .vsix file:
code --install-extension coderabbit.coderabbit-vscode-0.13.0.vsix
```

### 2. Configure CodeRabbit
Create `.coderabbit.yaml` in your project root:
```yaml
# .coderabbit.yaml
review:
  # Focus on critical areas
  critical_files:
    - user_data/strategies/sample_strategy.py
    - user_data/config.json
    - docker-compose.yml
  
  # Security focus
  security_checks: true
  
  # Code quality focus
  quality_checks: true
  
  # Performance focus
  performance_checks: true

# Custom prompts for trading bot context
custom_prompts:
  - "This is a financial trading application. Pay special attention to risk management and error handling."
  - "Review for potential financial losses due to bugs or security issues."
  - "Check for proper validation of trading signals and market data."
```

## Review Focus Areas

### 🔴 Critical Review Areas
1. **Risk Management Logic**
   - Stop-loss calculations
   - Position sizing
   - Leverage management
   - Error handling in trading decisions

2. **Security Vulnerabilities**
   - API key exposure
   - Authentication mechanisms
   - Network security
   - Data validation

3. **Financial Logic**
   - Entry/exit signal validation
   - Price calculation accuracy
   - Order management
   - P&L calculations

### 🟡 Important Review Areas
1. **Code Quality**
   - Error handling
   - Logging practices
   - Code organization
   - Documentation

2. **Performance**
   - Data processing efficiency
   - Memory usage
   - API call optimization
   - Database operations

3. **Maintainability**
   - Code structure
   - Configuration management
   - Testing coverage
   - Deployment process

## Running CodeRabbit Review

### 1. Open Project in VS Code
```bash
code /Users/carterpc/ft_userdata
```

### 2. Initialize CodeRabbit
- Open Command Palette (`Cmd+Shift+P`)
- Search for "CodeRabbit: Initialize"
- Follow the setup wizard

### 3. Request Review
- Select files to review
- Use Command Palette: "CodeRabbit: Request Review"
- Add context about the trading bot nature

### 4. Review Specific Areas
```bash
# Review strategy logic
coderabbit review user_data/strategies/sample_strategy.py

# Review security configuration
coderabbit review user_data/config.json

# Review Docker setup
coderabbit review docker-compose.yml
```

## Custom Review Prompts

### For Strategy Code
```
Please review this trading strategy for:
1. Risk management logic and potential edge cases
2. Mathematical accuracy of technical indicators
3. Error handling for market data issues
4. Performance optimization opportunities
5. Security considerations for financial data
```

### For Configuration
```
Please review this configuration for:
1. Security vulnerabilities and exposed secrets
2. Risk management parameters
3. Network security settings
4. Compliance with trading regulations
5. Best practices for production deployment
```

### For Docker Setup
```
Please review this Docker configuration for:
1. Security best practices
2. Resource allocation
3. Network security
4. Data persistence
5. Production readiness
```

## Expected Review Outcomes

### Code Quality Improvements
- Remove debug statements
- Improve error handling
- Add proper logging
- Refactor complex methods
- Add documentation

### Security Fixes
- Move secrets to environment variables
- Implement proper authentication
- Restrict network access
- Add input validation
- Implement audit logging

### Performance Optimizations
- Optimize data processing
- Reduce API calls
- Improve memory usage
- Add caching where appropriate

### Risk Management
- Validate trading signals
- Add circuit breakers
- Implement proper stop-losses
- Add position size limits

## Post-Review Actions

### 1. Implement Critical Fixes
- Security vulnerabilities
- Risk management issues
- Critical bugs

### 2. Test Changes
- Run backtests
- Test in dry-run mode
- Validate configuration
- Check performance

### 3. Document Changes
- Update documentation
- Create changelog
- Update deployment guide

### 4. Monitor Results
- Track performance
- Monitor logs
- Check for errors
- Validate trading logic

## Resources

### FreqTrade Documentation
- [FreqTrade Strategy Guide](https://www.freqtrade.io/en/stable/strategy-customization/)
- [FreqTrade Security](https://www.freqtrade.io/en/stable/security/)
- [FreqTrade Configuration](https://www.freqtrade.io/en/stable/configuration/)

### CodeRabbit Documentation
- [CodeRabbit VS Code Extension](https://marketplace.visualstudio.com/items?itemName=coderabbit.coderabbit-vscode)
- [CodeRabbit Best Practices](https://docs.coderabbit.ai/)

### Trading Bot Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Financial API Security](https://www.finra.org/rules-guidance/key-topics/cybersecurity)

---

**Important**: This is a financial trading application. All changes should be thoroughly tested before deployment to production. 