#!/usr/bin/env python3
"""
Pair Management Script for Freqtrade Strategy
Manages dynamic pair selection from a pool of 50 top cryptocurrencies
"""

import json
import requests
import pandas as pd
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PairManager:
    def __init__(self, config_file="user_data/pairlists/top_50_pairs.json"):
        """Initialize the pair manager"""
        self.config_file = config_file
        self.pairs_config = self.load_config()
        
    def load_config(self):
        """Load pair configuration from JSON file"""
        try:
            with open(self.config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.error(f"Config file {self.config_file} not found")
            return None
    
    def get_all_pairs(self):
        """Get all pairs from all categories"""
        all_pairs = []
        for category, pairs in self.pairs_config['top_50_pairs']['categories'].items():
            all_pairs.extend(pairs)
        return all_pairs
    
    def get_pairs_by_category(self, category):
        """Get pairs for a specific category"""
        return self.pairs_config['top_50_pairs']['categories'].get(category, [])
    
    def get_market_data(self, pairs, limit=50):
        """Get market data for pairs from CoinGecko API"""
        try:
            # Convert pair format from BTC/USDT:USDT to btc
            symbols = []
            for pair in pairs[:limit]:
                symbol = pair.split('/')[0].lower()
                symbols.append(symbol)
            
            # Get market data from CoinGecko
            url = "https://api.coingecko.com/api/v3/coins/markets"
            params = {
                'vs_currency': 'usd',
                'ids': ','.join(symbols),
                'order': 'market_cap_desc',
                'per_page': limit,
                'page': 1,
                'sparkline': False
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            return response.json()
            
        except Exception as e:
            logger.error(f"Error fetching market data: {e}")
            return []
    
    def analyze_pairs(self, market_data):
        """Analyze pairs based on market data"""
        if not market_data:
            return pd.DataFrame()
        
        analysis = []
        for coin in market_data:
            # Calculate volatility (price change percentage)
            price_change_24h = abs(coin.get('price_change_percentage_24h', 0)) / 100
            
            analysis.append({
                'symbol': coin['symbol'].upper(),
                'name': coin['name'],
                'current_price': coin['current_price'],
                'market_cap': coin['market_cap'],
                'volume_24h': coin['total_volume'],
                'price_change_24h': coin['price_change_percentage_24h'],
                'volatility': price_change_24h,
                'market_cap_rank': coin['market_cap_rank']
            })
        
        return pd.DataFrame(analysis)
    
    def select_top_pairs(self, analysis_df, max_pairs=10):
        """Select top performing pairs based on criteria"""
        if analysis_df.empty:
            return []
        
        criteria = self.pairs_config['top_50_pairs']['selection_criteria']
        
        # Apply filters
        filtered_df = analysis_df[
            (analysis_df['volume_24h'] >= criteria['volume_min']) &
            (analysis_df['market_cap'] >= criteria['market_cap_min']) &
            (analysis_df['volatility'] >= criteria['min_volatility']) &
            (analysis_df['volatility'] <= criteria['max_volatility'])
        ]
        
        if filtered_df.empty:
            logger.warning("No pairs passed the criteria")
            return []
        
        # Calculate composite score
        filtered_df['score'] = self.calculate_score(filtered_df)
        
        # Sort by score and select top pairs
        top_pairs = filtered_df.nlargest(max_pairs, 'score')
        
        return top_pairs
    
    def calculate_score(self, df):
        """Calculate composite score for pair ranking"""
        # Normalize metrics
        df_norm = df.copy()
        
        # Volume score (higher is better)
        df_norm['volume_score'] = (df_norm['volume_24h'] - df_norm['volume_24h'].min()) / \
                                 (df_norm['volume_24h'].max() - df_norm['volume_24h'].min())
        
        # Market cap score (higher is better)
        df_norm['market_cap_score'] = (df_norm['market_cap'] - df_norm['market_cap'].min()) / \
                                     (df_norm['market_cap'].max() - df_norm['market_cap'].min())
        
        # Volatility score (optimal range is best)
        optimal_volatility = 0.05  # 5% volatility is optimal
        df_norm['volatility_score'] = 1 - abs(df_norm['volatility'] - optimal_volatility) / optimal_volatility
        
        # Composite score
        score = (
            df_norm['volume_score'] * 0.4 +
            df_norm['market_cap_score'] * 0.3 +
            df_norm['volatility_score'] * 0.3
        )
        
        return score
    
    def generate_pairlist(self, max_pairs=10):
        """Generate a new pairlist for Freqtrade"""
        all_pairs = self.get_all_pairs()
        market_data = self.get_market_data(all_pairs)
        analysis = self.analyze_pairs(market_data)
        top_pairs = self.select_top_pairs(analysis, max_pairs)
        
        if top_pairs.empty:
            logger.error("No pairs selected")
            return []
        
        # Convert back to Freqtrade format
        selected_pairs = []
        for _, row in top_pairs.iterrows():
            pair = f"{row['symbol']}/USDT:USDT"
            selected_pairs.append(pair)
        
        return selected_pairs
    
    def print_analysis(self, max_pairs=10):
        """Print detailed analysis of selected pairs"""
        print(f"\n{'='*60}")
        print(f"PAIR ANALYSIS REPORT - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*60}")
        
        all_pairs = self.get_all_pairs()
        market_data = self.get_market_data(all_pairs)
        analysis = self.analyze_pairs(market_data)
        top_pairs = self.select_top_pairs(analysis, max_pairs)
        
        if top_pairs.empty:
            print("❌ No pairs passed the selection criteria")
            return
        
        print(f"\n📊 TOP {len(top_pairs)} SELECTED PAIRS:")
        print(f"{'Rank':<4} {'Symbol':<8} {'Name':<20} {'Price':<12} {'Volume':<15} {'Volatility':<12} {'Score':<8}")
        print("-" * 80)
        
        for i, (_, row) in enumerate(top_pairs.iterrows(), 1):
            print(f"{i:<4} {row['symbol']:<8} {row['name'][:18]:<20} "
                  f"${row['current_price']:<11.4f} ${row['volume_24h']/1e6:<14.1f}M "
                  f"{row['volatility']*100:<11.2f}% {row['score']:<8.3f}")
        
        print(f"\n📈 SUMMARY STATISTICS:")
        print(f"Total pairs analyzed: {len(analysis)}")
        print(f"Pairs passing filters: {len(top_pairs)}")
        print(f"Average volume: ${top_pairs['volume_24h'].mean()/1e6:.1f}M")
        print(f"Average volatility: {top_pairs['volatility'].mean()*100:.2f}%")
        print(f"Average score: {top_pairs['score'].mean():.3f}")
        
        # Category breakdown
        print(f"\n🏷️  CATEGORY BREAKDOWN:")
        categories = self.pairs_config['top_50_pairs']['categories']
        for category, pairs in categories.items():
            category_pairs = [p for p in pairs if p in [f"{row['symbol']}/USDT:USDT" for _, row in top_pairs.iterrows()]]
            if category_pairs:
                print(f"{category.replace('_', ' ').title()}: {len(category_pairs)} pairs")

def main():
    """Main function to run pair analysis"""
    manager = PairManager()
    
    # Generate and print analysis
    manager.print_analysis(max_pairs=10)
    
    # Generate pairlist for Freqtrade
    selected_pairs = manager.generate_pairlist(max_pairs=10)
    
    if selected_pairs:
        print(f"\n🎯 RECOMMENDED PAIRLIST FOR FREQTRADE:")
        print("Add these to your config.json pair_whitelist:")
        for pair in selected_pairs:
            print(f'    "{pair}",')
    
    print(f"\n✅ Analysis complete!")

if __name__ == "__main__":
    main() 