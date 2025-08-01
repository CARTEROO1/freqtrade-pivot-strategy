#!/usr/bin/env python3
"""
Simple Pair Selector for Freqtrade Strategy
Selects top performing pairs from a predefined list without external API calls
"""

import json
import random
from datetime import datetime

class SimplePairSelector:
    def __init__(self, config_file="user_data/pairlists/top_50_pairs.json"):
        """Initialize the pair selector"""
        self.config_file = config_file
        self.pairs_config = self.load_config()
        
    def load_config(self):
        """Load pair configuration from JSON file"""
        try:
            with open(self.config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Config file {self.config_file} not found")
            return None
    
    def get_all_pairs(self):
        """Get all pairs from all categories"""
        all_pairs = []
        for category, pairs in self.pairs_config['top_50_pairs']['categories'].items():
            all_pairs.extend(pairs)
        return all_pairs
    
    def select_by_category_weights(self, max_pairs=10):
        """Select pairs based on category weights"""
        strategy = self.pairs_config['top_50_pairs']['selection_strategy']
        categories = self.pairs_config['top_50_pairs']['categories']
        
        selected_pairs = []
        
        # Blue chips (30% weight)
        blue_chip_count = int(max_pairs * strategy['blue_chips_weight'])
        blue_chips = categories['blue_chips'][:blue_chip_count]
        selected_pairs.extend(blue_chips)
        
        # DeFi tokens (25% weight)
        defi_count = int(max_pairs * strategy['defi_weight'])
        defi_tokens = categories['defi_tokens'][:defi_count]
        selected_pairs.extend(defi_tokens)
        
        # Layer 1 blockchains (25% weight)
        layer1_count = int(max_pairs * strategy['layer1_weight'])
        layer1_tokens = categories['layer1_blockchains'][:layer1_count]
        selected_pairs.extend(layer1_tokens)
        
        # Gaming/Metaverse (10% weight)
        gaming_count = int(max_pairs * strategy['gaming_weight'])
        gaming_tokens = categories['gaming_metaverse'][:gaming_count]
        selected_pairs.extend(gaming_tokens)
        
        # Fill remaining slots with other categories
        remaining_slots = max_pairs - len(selected_pairs)
        if remaining_slots > 0:
            other_categories = ['payment_solutions', 'enterprise_blockchains', 'utility_tokens']
            for category in other_categories:
                if remaining_slots <= 0:
                    break
                category_pairs = categories[category][:remaining_slots]
                selected_pairs.extend(category_pairs)
                remaining_slots -= len(category_pairs)
        
        return selected_pairs[:max_pairs]
    
    def select_random_top_pairs(self, max_pairs=10):
        """Select random pairs from the top 50"""
        all_pairs = self.get_all_pairs()
        return random.sample(all_pairs, min(max_pairs, len(all_pairs)))
    
    def select_by_volume_priority(self, max_pairs=10):
        """Select pairs prioritizing high volume coins"""
        # Priority order based on typical volume
        priority_order = [
            'BTC/USDT:USDT', 'ETH/USDT:USDT', 'BNB/USDT:USDT', 'SOL/USDT:USDT',
            'XRP/USDT:USDT', 'ADA/USDT:USDT', 'AVAX/USDT:USDT', 'DOT/USDT:USDT',
            'MATIC/USDT:USDT', 'LINK/USDT:USDT', 'UNI/USDT:USDT', 'LTC/USDT:USDT',
            'BCH/USDT:USDT', 'ATOM/USDT:USDT', 'NEAR/USDT:USDT', 'OP/USDT:USDT',
            'ARB/USDT:USDT', 'MKR/USDT:USDT', 'AAVE/USDT:USDT', 'COMP/USDT:USDT'
        ]
        
        return priority_order[:max_pairs]
    
    def print_selection(self, selected_pairs, method_name):
        """Print the selected pairs"""
        print(f"\n{'='*60}")
        print(f"PAIR SELECTION REPORT - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*60}")
        print(f"Selection Method: {method_name}")
        print(f"Total Pairs Selected: {len(selected_pairs)}")
        
        print(f"\n📊 SELECTED PAIRS:")
        for i, pair in enumerate(selected_pairs, 1):
            symbol = pair.split('/')[0]
            print(f"{i:2d}. {symbol:<8} ({pair})")
        
        # Category breakdown
        categories = self.pairs_config['top_50_pairs']['categories']
        print(f"\n🏷️  CATEGORY BREAKDOWN:")
        for category, pairs in categories.items():
            category_pairs = [p for p in pairs if p in selected_pairs]
            if category_pairs:
                print(f"{category.replace('_', ' ').title()}: {len(category_pairs)} pairs")
        
        print(f"\n🎯 FREQTRADE CONFIG:")
        print("Add these to your config.json pair_whitelist:")
        for pair in selected_pairs:
            print(f'    "{pair}",')
        
        print(f"\n✅ Selection complete!")

def main():
    """Main function to run pair selection"""
    selector = SimplePairSelector()
    
    if not selector.pairs_config:
        print("❌ Failed to load configuration")
        return
    
    print("🚀 Simple Pair Selector for Freqtrade")
    print("Choose selection method:")
    print("1. Category-weighted selection (recommended)")
    print("2. Random selection from top 50")
    print("3. Volume-priority selection")
    
    try:
        choice = input("\nEnter choice (1-3): ").strip()
        
        if choice == "1":
            selected_pairs = selector.select_by_category_weights(max_pairs=10)
            selector.print_selection(selected_pairs, "Category-Weighted")
        elif choice == "2":
            selected_pairs = selector.select_random_top_pairs(max_pairs=10)
            selector.print_selection(selected_pairs, "Random Selection")
        elif choice == "3":
            selected_pairs = selector.select_by_volume_priority(max_pairs=10)
            selector.print_selection(selected_pairs, "Volume-Priority")
        else:
            print("Invalid choice. Using category-weighted selection.")
            selected_pairs = selector.select_by_category_weights(max_pairs=10)
            selector.print_selection(selected_pairs, "Category-Weighted")
            
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")

if __name__ == "__main__":
    main() 