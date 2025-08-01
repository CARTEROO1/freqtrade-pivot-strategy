# 🚀 Enhanced PivotCamarillaStrategy for Freqtrade

A conservative, risk-managed trading strategy using Mark Fisher Pivot Range, Camarilla pivots, and EMA200 with weekly profit targets.

## 📊 Strategy Performance

- **Total Return**: 5.21% in 20 days
- **Win Rate**: 60.4%
- **Max Drawdown**: 1.38%
- **Sharpe Ratio**: 25.27
- **Optimal Timeframe**: 30m

## 🎯 Key Features

- **Conservative Risk Management**: 15% stoploss, 2x leverage
- **Weekly Profit Targets**: 3% initial ROI with trailing stops
- **Pivot-Based Entries**: Daily pivot levels for precise entries
- **Volatility Filters**: ATR-based market condition filtering
- **Volume Filters**: Ensures sufficient market liquidity

## 🏗️ Architecture

- **Timeframe**: 30m (optimal performance)
- **Stake Amount**: 500 USDT per trade
- **Max Open Trades**: 2
- **Trading Mode**: Isolated Futures
- **Exchange**: Binance

## 🚀 Quick Deployment

### Option 1: VPS Deployment (Recommended)

1. **Choose a VPS Provider**:
   - DigitalOcean ($6-12/month)
   - Linode ($5-10/month)
   - Vultr ($6-12/month)

2. **Deploy on VPS**:
   ```bash
   # Clone your repository
   git clone https://github.com/YOUR_USERNAME/freqtrade-strategies.git
   cd freqtrade-strategies
   
   # Run deployment script
   ./deploy.sh
   ```

3. **Configure API Keys**:
   ```bash
   # Edit config file
   nano user_data/config.json
   
   # Add your Binance API keys
   "exchange": {
     "name": "binance",
     "key": "YOUR_API_KEY",
     "secret": "YOUR_SECRET_KEY"
   }
   ```

4. **Start Trading**:
   ```bash
   # Start the strategy
   docker-compose up -d
   
   # Monitor logs
   docker-compose logs -f
   ```

### Option 2: Local Development

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/freqtrade-strategies.git
cd freqtrade-strategies

# Start with Docker
docker-compose up -d

# Access web interface
open http://localhost:8080
```

## 📈 Strategy Configuration

### ROI Structure (Weekly Targets)
```json
"roi": {
  "0": 0.03,    // 3% initial target
  "168": 0.02,  // 2% after 7 days
  "336": 0.01,  // 1% after 14 days
  "504": 0      // 0% after 21 days
}
```

### Trailing Stop
- **Activation**: +1% profit
- **Offset**: 2%
- **Purpose**: Maximum profit capture

### Risk Parameters
- **Stoploss**: -15%
- **Leverage**: 2x
- **Stake Amount**: 500 USDT
- **Max Open Trades**: 2

## 🔧 Monitoring & Management

### Web Interface
- **URL**: `http://your-server-ip:8080`
- **Username**: `freqtrader`
- **Password**: `carter`

### API Endpoints
- **Status**: `GET /api/v1/status`
- **Trades**: `GET /api/v1/trades`
- **Profit**: `GET /api/v1/profit`

### Logs
```bash
# View real-time logs
docker-compose logs -f

# View specific strategy logs
docker-compose logs -f freqtrade
```

## 📊 Backtesting

```bash
# Run backtest
docker run --rm -v $(pwd)/user_data:/freqtrade/user_data \
  freqtradeorg/freqtrade:develop_plot backtesting \
  --strategy PivotCamarillaStrategy \
  --timerange 20250701-20250731 \
  --pairs BTC/USDT:USDT ETH/USDT:USDT

# Generate plots
docker run --rm -v $(pwd)/user_data:/freqtrade/user_data \
  freqtradeorg/freqtrade:develop_plot plot-dataframe \
  --strategy PivotCamarillaStrategy \
  --timerange 20250701-20250731 \
  --pairs BTC/USDT:USDT
```

## 🔒 Security Considerations

1. **API Keys**: Use environment variables for production
2. **Firewall**: Restrict access to port 8080
3. **SSL**: Use reverse proxy with SSL for web interface
4. **Backups**: Regular backups of `user_data/` directory

## 📝 Environment Variables

For production, set these environment variables:

```bash
export BINANCE_API_KEY="your_api_key"
export BINANCE_SECRET_KEY="your_secret_key"
export FREQTRADE_PASSWORD="your_secure_password"
```

## 🆘 Troubleshooting

### Common Issues

1. **Strategy not starting**:
   ```bash
   docker-compose logs freqtrade
   ```

2. **API connection issues**:
   - Check API keys in config
   - Verify IP whitelist on Binance

3. **Low performance**:
   - Check VPS resources
   - Monitor system load

### Support

- Check logs: `docker-compose logs -f`
- Restart strategy: `docker-compose restart`
- Update strategy: `git pull && docker-compose up -d`

## 📄 License

This project is for educational purposes. Use at your own risk.

## ⚠️ Disclaimer

Trading cryptocurrencies involves substantial risk. This strategy is provided as-is without any guarantees. Always test thoroughly before using real funds. 