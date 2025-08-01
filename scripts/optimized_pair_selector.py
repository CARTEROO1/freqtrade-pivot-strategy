#!/usr/bin/env python3
"""
Optimized Pair Selector for Freqtrade Strategy
Enhanced version with caching, performance optimizations, and advanced features
"""

import json
import random
import os
import pickle
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class PairMetrics:
    """Data class for pair metrics"""
    symbol: str
    pair: str
    category: str
    volume_24h: float = 0.0
    market_cap: float = 0.0
    price_change_24h: float = 0.0
    volatility: float = 0.0
    score: float = 0.0

class OptimizedPairSelector:
    """
    Optimized pair selector with caching, performance improvements, and advanced features
    """
    
    def __init__(self, config_file: str = "user_data/pairlists/top_50_pairs.json", 
                 cache_dir: str = "user_data/cache"):
        """Initialize the optimized pair selector"""
        self.config_file = Path(config_file)
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        
        # Load configuration
        self.pairs_config = self._load_config()
        if not self.pairs_config:
            raise ValueError(f"Failed to load configuration from {config_file}")
        
        # Initialize cache
        self._cache_file = self.cache_dir / "pair_selection_cache.pkl"
        self._cache_duration = timedelta(hours=6)  # Cache for 6 hours
        
        # Performance optimizations
        self._all_pairs_cache = None
        self._category_pairs_cache = {}
        
        logger.info("OptimizedPairSelector initialized successfully")
    
    def _load_config(self) -> Optional[Dict]:
        """Load configuration with error handling"""
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            logger.info(f"Configuration loaded from {self.config_file}")
            return config
        except FileNotFoundError:
            logger.error(f"Config file {self.config_file} not found")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in config file: {e}")
            return None
        except Exception as e:
            logger.error(f"Error loading config: {e}")
            return None
    
    def _load_cache(self) -> Optional[Dict]:
        """Load cached data if valid"""
        try:
            if not self._cache_file.exists():
                return None
            
            # Check cache age
            cache_age = datetime.now() - datetime.fromtimestamp(self._cache_file.stat().st_mtime)
            if cache_age > self._cache_duration:
                logger.info("Cache expired, will refresh")
                return None
            
            with open(self._cache_file, 'rb') as f:
                cache_data = pickle.load(f)
            logger.info("Cache loaded successfully")
            return cache_data
            
        except Exception as e:
            logger.warning(f"Failed to load cache: {e}")
            return None
    
    def _save_cache(self, data: Dict) -> None:
        """Save data to cache"""
        try:
            with open(self._cache_file, 'wb') as f:
                pickle.dump(data, f)
            logger.info("Cache saved successfully")
        except Exception as e:
            logger.warning(f"Failed to save cache: {e}")
    
    def get_all_pairs(self) -> List[str]:
        """Get all pairs with caching"""
        if self._all_pairs_cache is None:
            all_pairs = []
            for category, pairs in self.pairs_config['top_50_pairs']['categories'].items():
                all_pairs.extend(pairs)
            self._all_pairs_cache = all_pairs
        return self._all_pairs_cache
    
    def get_pairs_by_category(self, category: str) -> List[str]:
        """Get pairs for a specific category with caching"""
        if category not in self._category_pairs_cache:
            self._category_pairs_cache[category] = self.pairs_config['top_50_pairs']['categories'].get(category, [])
        return self._category_pairs_cache[category]
    
    def select_by_category_weights(self, max_pairs: int = 10, 
                                 custom_weights: Optional[Dict[str, float]] = None) -> List[str]:
        """
        Select pairs based on category weights with improved algorithm
        
        Args:
            max_pairs: Maximum number of pairs to select
            custom_weights: Custom category weights (optional)
        """
        strategy = self.pairs_config['top_50_pairs']['selection_strategy']
        categories = self.pairs_config['top_50_pairs']['categories']
        
        # Use custom weights if provided, otherwise use default
        weights = custom_weights or {
            'blue_chips': strategy['blue_chips_weight'],
            'defi_tokens': strategy['defi_weight'],
            'layer1_blockchains': strategy['layer1_weight'],
            'gaming_metaverse': strategy['gaming_weight'],
            'other': strategy.get('other_weight', 0.1)
        }
        
        selected_pairs = []
        remaining_weight = 1.0
        
        # Process each category
        for category, weight in weights.items():
            if remaining_weight <= 0 or len(selected_pairs) >= max_pairs:
                break
            
            category_pairs = categories.get(category, [])
            if not category_pairs:
                continue
            
            # Calculate how many pairs to select from this category
            category_count = min(
                int(max_pairs * weight),
                len(category_pairs),
                max_pairs - len(selected_pairs)
            )
            
            if category_count > 0:
                selected_pairs.extend(category_pairs[:category_count])
                remaining_weight -= weight
        
        # Fill remaining slots with best available pairs
        remaining_slots = max_pairs - len(selected_pairs)
        if remaining_slots > 0:
            all_available = self.get_all_pairs()
            available_pairs = [p for p in all_available if p not in selected_pairs]
            selected_pairs.extend(available_pairs[:remaining_slots])
        
        return selected_pairs[:max_pairs]
    
    def select_by_performance_score(self, max_pairs: int = 10, 
                                  min_volume: float = 10_000_000,
                                  max_volatility: float = 0.15) -> List[PairMetrics]:
        """
        Select pairs based on performance scoring with real market data simulation
        """
        # Simulate market data (in real implementation, this would fetch from API)
        all_pairs = self.get_all_pairs()
        pair_metrics = []
        
        for pair in all_pairs:
            symbol = pair.split('/')[0]
            category = self._get_pair_category(pair)
            
            # Simulate realistic market data
            volume = random.uniform(5_000_000, 500_000_000)
            market_cap = volume * random.uniform(50, 500)
            price_change = random.uniform(-0.2, 0.2)
            volatility = abs(price_change)
            
            # Apply filters
            if volume < min_volume or volatility > max_volatility:
                continue
            
            # Calculate score
            score = self._calculate_performance_score(volume, market_cap, volatility)
            
            metrics = PairMetrics(
                symbol=symbol,
                pair=pair,
                category=category,
                volume_24h=volume,
                market_cap=market_cap,
                price_change_24h=price_change,
                volatility=volatility,
                score=score
            )
            pair_metrics.append(metrics)
        
        # Sort by score and return top pairs
        pair_metrics.sort(key=lambda x: x.score, reverse=True)
        return pair_metrics[:max_pairs]
    
    def select_by_market_cap_ranking(self, max_pairs: int = 10) -> List[str]:
        """Select pairs based on market cap ranking"""
        # Simulate market cap ranking (in real implementation, fetch from API)
        market_cap_order = [
            'BTC/USDT:USDT', 'ETH/USDT:USDT', 'BNB/USDT:USDT', 'SOL/USDT:USDT',
            'XRP/USDT:USDT', 'ADA/USDT:USDT', 'AVAX/USDT:USDT', 'DOT/USDT:USDT',
            'MATIC/USDT:USDT', 'LINK/USDT:USDT', 'UNI/USDT:USDT', 'LTC/USDT:USDT',
            'BCH/USDT:USDT', 'ATOM/USDT:USDT', 'NEAR/USDT:USDT', 'OP/USDT:USDT',
            'ARB/USDT:USDT', 'MKR/USDT:USDT', 'AAVE/USDT:USDT', 'COMP/USDT:USDT'
        ]
        
        return market_cap_order[:max_pairs]
    
    def select_balanced_portfolio(self, max_pairs: int = 10) -> List[str]:
        """
        Select pairs for a balanced portfolio across different market sectors
        """
        # Define sector weights for balanced portfolio
        sector_weights = {
            'blue_chips': 0.4,      # 40% blue chips
            'defi_tokens': 0.2,     # 20% DeFi
            'layer1_blockchains': 0.2,  # 20% Layer 1
            'gaming_metaverse': 0.1,    # 10% Gaming
            'payment_solutions': 0.1    # 10% Payment
        }
        
        return self.select_by_category_weights(max_pairs, sector_weights)
    
    def _get_pair_category(self, pair: str) -> str:
        """Get the category of a pair"""
        categories = self.pairs_config['top_50_pairs']['categories']
        for category, pairs in categories.items():
            if pair in pairs:
                return category
        return 'unknown'
    
    def _calculate_performance_score(self, volume: float, market_cap: float, volatility: float) -> float:
        """Calculate performance score for a pair"""
        # Normalize metrics to 0-1 scale
        volume_score = min(volume / 100_000_000, 1.0)  # Cap at 100M
        market_cap_score = min(market_cap / 1_000_000_000, 1.0)  # Cap at 1B
        
        # Volatility score (lower is better for stability)
        volatility_score = max(0, 1 - volatility)
        
        # Weighted composite score
        score = (volume_score * 0.4 + market_cap_score * 0.3 + volatility_score * 0.3)
        return score
    
    def generate_freqtrade_config(self, selected_pairs: List[str]) -> str:
        """Generate Freqtrade configuration snippet"""
        config_lines = ['"pair_whitelist": [']
        for pair in selected_pairs:
            config_lines.append(f'    "{pair}",')
        config_lines.append('],')
        
        return '\n'.join(config_lines)
    
    def print_detailed_analysis(self, selected_pairs: List[str], method_name: str) -> None:
        """Print detailed analysis with enhanced formatting"""
        print(f"\n{'='*80}")
        print(f"📊 PAIR SELECTION ANALYSIS REPORT")
        print(f"{'='*80}")
        print(f"🕒 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🎯 Method: {method_name}")
        print(f"📈 Total Pairs: {len(selected_pairs)}")
        
        # Pair details
        print(f"\n{'Rank':<4} {'Symbol':<8} {'Category':<20} {'Pair':<20}")
        print("-" * 60)
        
        categories = self.pairs_config['top_50_pairs']['categories']
        for i, pair in enumerate(selected_pairs, 1):
            symbol = pair.split('/')[0]
            category = self._get_pair_category(pair)
            print(f"{i:<4} {symbol:<8} {category.replace('_', ' ').title():<20} {pair:<20}")
        
        # Category breakdown
        print(f"\n🏷️  CATEGORY BREAKDOWN:")
        category_counts = {}
        for pair in selected_pairs:
            category = self._get_pair_category(pair)
            category_counts[category] = category_counts.get(category, 0) + 1
        
        for category, count in sorted(category_counts.items()):
            percentage = (count / len(selected_pairs)) * 100
            print(f"  {category.replace('_', ' ').title()}: {count} pairs ({percentage:.1f}%)")
        
        # Risk analysis
        print(f"\n⚠️  RISK ANALYSIS:")
        blue_chip_count = category_counts.get('blue_chips', 0)
        defi_count = category_counts.get('defi_tokens', 0)
        layer1_count = category_counts.get('layer1_blockchains', 0)
        
        risk_score = (blue_chip_count * 0.1 + defi_count * 0.3 + layer1_count * 0.2) / len(selected_pairs)
        print(f"  Risk Score: {risk_score:.2f} (Lower is safer)")
        print(f"  Blue Chip Exposure: {blue_chip_count}/{len(selected_pairs)} ({blue_chip_count/len(selected_pairs)*100:.1f}%)")
        
        # Configuration output
        print(f"\n🎯 FREQTRADE CONFIGURATION:")
        print("Add this to your config.json:")
        print(self.generate_freqtrade_config(selected_pairs))
        
        print(f"\n✅ Analysis complete!")

def main():
    """Main function with enhanced user interface"""
    try:
        selector = OptimizedPairSelector()
        
        print("🚀 Optimized Pair Selector for Freqtrade")
        print("=" * 50)
        print("Choose selection method:")
        print("1. Category-weighted selection (recommended)")
        print("2. Performance-based selection")
        print("3. Market cap ranking")
        print("4. Balanced portfolio")
        print("5. Random selection")
        print("6. Custom weights")
        
        try:
            choice = input("\nEnter choice (1-6): ").strip()
            max_pairs = int(input("Number of pairs to select (default 10): ") or "10")
            
            if choice == "1":
                selected_pairs = selector.select_by_category_weights(max_pairs)
                selector.print_detailed_analysis(selected_pairs, "Category-Weighted")
                
            elif choice == "2":
                pair_metrics = selector.select_by_performance_score(max_pairs)
                selected_pairs = [pm.pair for pm in pair_metrics]
                selector.print_detailed_analysis(selected_pairs, "Performance-Based")
                
            elif choice == "3":
                selected_pairs = selector.select_by_market_cap_ranking(max_pairs)
                selector.print_detailed_analysis(selected_pairs, "Market Cap Ranking")
                
            elif choice == "4":
                selected_pairs = selector.select_balanced_portfolio(max_pairs)
                selector.print_detailed_analysis(selected_pairs, "Balanced Portfolio")
                
            elif choice == "5":
                all_pairs = selector.get_all_pairs()
                selected_pairs = random.sample(all_pairs, min(max_pairs, len(all_pairs)))
                selector.print_detailed_analysis(selected_pairs, "Random Selection")
                
            elif choice == "6":
                print("\nEnter custom weights (must sum to 1.0):")
                custom_weights = {}
                categories = ['blue_chips', 'defi_tokens', 'layer1_blockchains', 'gaming_metaverse', 'payment_solutions']
                
                for category in categories:
                    weight = float(input(f"{category.replace('_', ' ').title()} weight: ") or "0.2")
                    custom_weights[category] = weight
                
                selected_pairs = selector.select_by_category_weights(max_pairs, custom_weights)
                selector.print_detailed_analysis(selected_pairs, "Custom Weights")
                
            else:
                print("Invalid choice. Using category-weighted selection.")
                selected_pairs = selector.select_by_category_weights(max_pairs)
                selector.print_detailed_analysis(selected_pairs, "Category-Weighted")
                
        except ValueError as e:
            print(f"Invalid input: {e}")
            return
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main() 