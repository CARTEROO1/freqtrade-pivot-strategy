#!/usr/bin/env python3
"""
Performance Monitor for Pair Selection Methods
Tracks and compares the performance of different pair selection strategies
"""

import time
import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
from dataclasses import dataclass
from pathlib import Path
import logging

# Import both selectors for comparison
from simple_pair_selector import SimplePairSelector
from optimized_pair_selector import OptimizedPairSelector

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class PerformanceMetrics:
    """Performance metrics for comparison"""
    method_name: str
    execution_time: float
    memory_usage: float
    pairs_selected: int
    cache_hits: int = 0
    cache_misses: int = 0

class PerformanceMonitor:
    """Monitor and compare performance of different pair selection methods"""
    
    def __init__(self):
        self.simple_selector = SimplePairSelector()
        self.optimized_selector = OptimizedPairSelector()
        self.results = []
    
    def measure_execution_time(self, func, *args, **kwargs) -> Tuple[float, any]:
        """Measure execution time of a function"""
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        execution_time = end_time - start_time
        return execution_time, result
    
    def benchmark_simple_selector(self, iterations: int = 100) -> List[PerformanceMetrics]:
        """Benchmark the simple pair selector"""
        metrics = []
        
        for i in range(iterations):
            # Test category-weighted selection
            exec_time, pairs = self.measure_execution_time(
                self.simple_selector.select_by_category_weights, 10
            )
            metrics.append(PerformanceMetrics(
                method_name="Simple Category-Weighted",
                execution_time=exec_time,
                memory_usage=0,  # Simple estimation
                pairs_selected=len(pairs)
            ))
            
            # Test random selection
            exec_time, pairs = self.measure_execution_time(
                self.simple_selector.select_random_top_pairs, 10
            )
            metrics.append(PerformanceMetrics(
                method_name="Simple Random",
                execution_time=exec_time,
                memory_usage=0,
                pairs_selected=len(pairs)
            ))
        
        return metrics
    
    def benchmark_optimized_selector(self, iterations: int = 100) -> List[PerformanceMetrics]:
        """Benchmark the optimized pair selector"""
        metrics = []
        
        for i in range(iterations):
            # Test category-weighted selection
            exec_time, pairs = self.measure_execution_time(
                self.optimized_selector.select_by_category_weights, 10
            )
            metrics.append(PerformanceMetrics(
                method_name="Optimized Category-Weighted",
                execution_time=exec_time,
                memory_usage=0,
                pairs_selected=len(pairs)
            ))
            
            # Test performance-based selection
            exec_time, pair_metrics = self.measure_execution_time(
                self.optimized_selector.select_by_performance_score, 10
            )
            metrics.append(PerformanceMetrics(
                method_name="Optimized Performance-Based",
                execution_time=exec_time,
                memory_usage=0,
                pairs_selected=len(pair_metrics)
            ))
            
            # Test balanced portfolio
            exec_time, pairs = self.measure_execution_time(
                self.optimized_selector.select_balanced_portfolio, 10
            )
            metrics.append(PerformanceMetrics(
                method_name="Optimized Balanced Portfolio",
                execution_time=exec_time,
                memory_usage=0,
                pairs_selected=len(pairs)
            ))
        
        return metrics
    
    def analyze_performance(self, metrics: List[PerformanceMetrics]) -> Dict:
        """Analyze performance metrics"""
        analysis = {}
        
        for metric in metrics:
            method = metric.method_name
            if method not in analysis:
                analysis[method] = {
                    'count': 0,
                    'total_time': 0,
                    'avg_time': 0,
                    'min_time': float('inf'),
                    'max_time': 0,
                    'total_pairs': 0
                }
            
            analysis[method]['count'] += 1
            analysis[method]['total_time'] += metric.execution_time
            analysis[method]['min_time'] = min(analysis[method]['min_time'], metric.execution_time)
            analysis[method]['max_time'] = max(analysis[method]['max_time'], metric.execution_time)
            analysis[method]['total_pairs'] += metric.pairs_selected
        
        # Calculate averages
        for method, data in analysis.items():
            data['avg_time'] = data['total_time'] / data['count']
            data['avg_pairs'] = data['total_pairs'] / data['count']
        
        return analysis
    
    def print_performance_report(self, analysis: Dict) -> None:
        """Print detailed performance report"""
        print(f"\n{'='*100}")
        print(f"📊 PERFORMANCE BENCHMARK REPORT")
        print(f"{'='*100}")
        print(f"🕒 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        print(f"\n{'Method':<35} {'Count':<8} {'Avg Time (ms)':<15} {'Min Time (ms)':<15} {'Max Time (ms)':<15} {'Avg Pairs':<10}")
        print("-" * 100)
        
        # Sort by average execution time
        sorted_methods = sorted(analysis.items(), key=lambda x: x[1]['avg_time'])
        
        for method, data in sorted_methods:
            print(f"{method:<35} {data['count']:<8} {data['avg_time']*1000:<15.3f} "
                  f"{data['min_time']*1000:<15.3f} {data['max_time']*1000:<15.3f} {data['avg_pairs']:<10.1f}")
        
        # Performance comparison
        print(f"\n🏆 PERFORMANCE COMPARISON:")
        if len(sorted_methods) >= 2:
            fastest = sorted_methods[0]
            slowest = sorted_methods[-1]
            speedup = slowest[1]['avg_time'] / fastest[1]['avg_time']
            
            print(f"  Fastest Method: {fastest[0]} ({fastest[1]['avg_time']*1000:.3f} ms)")
            print(f"  Slowest Method: {slowest[0]} ({slowest[1]['avg_time']*1000:.3f} ms)")
            print(f"  Speedup Factor: {speedup:.2f}x")
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        print(f"  • Use {sorted_methods[0][0]} for fastest execution")
        print(f"  • Use {sorted_methods[-1][0]} for most comprehensive analysis")
        print(f"  • Consider caching for frequently used selections")
    
    def run_comprehensive_benchmark(self, iterations: int = 100) -> None:
        """Run comprehensive performance benchmark"""
        print("🚀 Starting Performance Benchmark...")
        print(f"Running {iterations} iterations for each method...")
        
        # Benchmark simple selector
        print("\n📈 Benchmarking Simple Selector...")
        simple_metrics = self.benchmark_simple_selector(iterations)
        
        # Benchmark optimized selector
        print("📈 Benchmarking Optimized Selector...")
        optimized_metrics = self.benchmark_optimized_selector(iterations)
        
        # Combine metrics
        all_metrics = simple_metrics + optimized_metrics
        
        # Analyze results
        analysis = self.analyze_performance(all_metrics)
        
        # Print report
        self.print_performance_report(analysis)
        
        # Save results
        self.save_results(analysis)
    
    def save_results(self, analysis: Dict) -> None:
        """Save benchmark results to file"""
        results_file = Path("user_data/benchmark_results.json")
        results_file.parent.mkdir(exist_ok=True)
        
        results = {
            'timestamp': datetime.now().isoformat(),
            'analysis': analysis,
            'summary': {
                'total_methods': len(analysis),
                'fastest_method': min(analysis.items(), key=lambda x: x[1]['avg_time'])[0],
                'slowest_method': max(analysis.items(), key=lambda x: x[1]['avg_time'])[0]
            }
        }
        
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n💾 Results saved to: {results_file}")
    
    def compare_selection_methods(self, max_pairs: int = 10) -> None:
        """Compare different selection methods side by side"""
        print(f"\n{'='*80}")
        print(f"🔄 SELECTION METHOD COMPARISON")
        print(f"{'='*80}")
        
        methods = [
            ("Simple Category-Weighted", lambda: self.simple_selector.select_by_category_weights(max_pairs)),
            ("Simple Random", lambda: self.simple_selector.select_random_top_pairs(max_pairs)),
            ("Optimized Category-Weighted", lambda: self.optimized_selector.select_by_category_weights(max_pairs)),
            ("Optimized Performance-Based", lambda: [pm.pair for pm in self.optimized_selector.select_by_performance_score(max_pairs)]),
            ("Optimized Balanced Portfolio", lambda: self.optimized_selector.select_balanced_portfolio(max_pairs)),
            ("Optimized Market Cap Ranking", lambda: self.optimized_selector.select_by_market_cap_ranking(max_pairs))
        ]
        
        results = []
        for method_name, method_func in methods:
            exec_time, pairs = self.measure_execution_time(method_func)
            results.append({
                'method': method_name,
                'pairs': pairs,
                'execution_time': exec_time,
                'pair_count': len(pairs)
            })
        
        # Print comparison table
        print(f"\n{'Method':<35} {'Execution Time (ms)':<20} {'Pairs Selected':<15} {'Sample Pairs':<20}")
        print("-" * 90)
        
        for result in results:
            sample_pairs = ', '.join([p.split('/')[0] for p in result['pairs'][:3]])
            print(f"{result['method']:<35} {result['execution_time']*1000:<20.3f} "
                  f"{result['pair_count']:<15} {sample_pairs:<20}")
        
        # Find best method
        fastest = min(results, key=lambda x: x['execution_time'])
        print(f"\n🏆 Fastest Method: {fastest['method']} ({fastest['execution_time']*1000:.3f} ms)")
        
        return results

def main():
    """Main function for performance monitoring"""
    monitor = PerformanceMonitor()
    
    print("🚀 Performance Monitor for Pair Selection Methods")
    print("=" * 60)
    print("Choose operation:")
    print("1. Run comprehensive benchmark (100 iterations)")
    print("2. Quick comparison (single run)")
    print("3. Custom benchmark")
    
    try:
        choice = input("\nEnter choice (1-3): ").strip()
        
        if choice == "1":
            iterations = int(input("Number of iterations (default 100): ") or "100")
            monitor.run_comprehensive_benchmark(iterations)
            
        elif choice == "2":
            max_pairs = int(input("Number of pairs to select (default 10): ") or "10")
            monitor.compare_selection_methods(max_pairs)
            
        elif choice == "3":
            iterations = int(input("Number of iterations: "))
            max_pairs = int(input("Number of pairs to select: "))
            monitor.run_comprehensive_benchmark(iterations)
            
        else:
            print("Invalid choice. Running quick comparison...")
            monitor.compare_selection_methods(10)
            
    except ValueError as e:
        print(f"Invalid input: {e}")
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main() 