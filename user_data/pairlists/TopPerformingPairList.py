import logging
from typing import Any, Dict, List
from freqtrade.pairlist.IPairList import IPairList
from freqtrade.exchange import timeframe_to_minutes
import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)


class TopPerformingPairList(IPairList):
    """
    PairList plugin that selects top performing pairs based on:
    - Market cap (higher is better)
    - 24h volume (higher is better)
    - Price volatility (moderate is optimal)
    - Recent price performance (momentum)
    
    This plugin will select the top N pairs from a larger pool of candidates.
    """
    
    def __init__(self, exchange, pairlistmanager, config: Dict[str, Any], pairlistconfig: Dict[str, Any],
                 pairlist_pos: int) -> None:
        super().__init__(exchange, pairlistmanager, config, pairlistconfig, pairlist_pos)
        
        # Configuration parameters
        self._max_pairs = pairlistconfig.get('max_pairs', 10)
        self._min_market_cap = pairlistconfig.get('min_market_cap', 100000000)  # $100M
        self._min_volume = pairlistconfig.get('min_volume', 10000000)  # $10M
        self._max_volatility = pairlistconfig.get('max_volatility', 0.1)  # 10%
        self._min_volatility = pairlistconfig.get('min_volatility', 0.02)  # 2%
        self._lookback_period = pairlistconfig.get('lookback_period', 24)  # hours
        self._refresh_period = pairlistconfig.get('refresh_period', 4)  # hours
        
        # Internal state
        self._last_refresh = 0
        self._cached_pairs = []
        
        logger.info(f"TopPerformingPairList initialized with max_pairs={self._max_pairs}")
    
    @property
    def needstickers(self) -> bool:
        """
        Boolean property defining if tickers are necessary.
        If no Pairlist requires tickers, an empty Dict is passed
        as tickers argument to filter_pairlist()
        """
        return True
    
    def short_desc(self) -> str:
        """
        Short description for the pairlist
        """
        return f"{self.__class__.__name__} - Top {self._max_pairs} performing pairs"
    
    def filter_pairlist(self, pairlist: List[str], tickers: Dict) -> List[str]:
        """
        Filters and sorts pairlist based on performance metrics.
        
        Args:
            pairlist: List of pairs to filter
            tickers: Dict of ticker data
            
        Returns:
            List of top performing pairs
        """
        if not pairlist:
            return []
        
        # Get current timestamp for refresh logic
        current_time = pd.Timestamp.now()
        
        # Check if we need to refresh the selection
        if (current_time - pd.Timestamp(self._last_refresh)).total_seconds() < self._refresh_period * 3600:
            return self._cached_pairs[:self._max_pairs]
        
        logger.info(f"Refreshing top performing pairs from {len(pairlist)} candidates")
        
        # Calculate performance metrics for each pair
        pair_metrics = []
        
        for pair in pairlist:
            try:
                metrics = self._calculate_pair_metrics(pair, tickers)
                if metrics:
                    pair_metrics.append(metrics)
            except Exception as e:
                logger.warning(f"Error calculating metrics for {pair}: {e}")
                continue
        
        if not pair_metrics:
            logger.warning("No valid pairs found with metrics")
            return []
        
        # Convert to DataFrame for easier analysis
        df = pd.DataFrame(pair_metrics)
        
        # Apply filters
        df = df[
            (df['market_cap'] >= self._min_market_cap) &
            (df['volume_24h'] >= self._min_volume) &
            (df['volatility'] >= self._min_volatility) &
            (df['volatility'] <= self._max_volatility)
        ]
        
        if df.empty:
            logger.warning("No pairs passed the minimum criteria")
            return []
        
        # Calculate composite score
        df['score'] = self._calculate_composite_score(df)
        
        # Sort by score and select top pairs
        df_sorted = df.sort_values('score', ascending=False)
        top_pairs = df_sorted.head(self._max_pairs)['pair'].tolist()
        
        # Cache the result
        self._cached_pairs = top_pairs
        self._last_refresh = current_time.timestamp()
        
        logger.info(f"Selected top {len(top_pairs)} pairs: {top_pairs}")
        
        return top_pairs
    
    def _calculate_pair_metrics(self, pair: str, tickers: Dict) -> Dict[str, Any]:
        """
        Calculate performance metrics for a single pair.
        
        Args:
            pair: Trading pair
            tickers: Ticker data
            
        Returns:
            Dict with metrics
        """
        if pair not in tickers:
            return None
        
        ticker = tickers[pair]
        
        # Basic metrics from ticker
        current_price = ticker.get('last', 0)
        volume_24h = ticker.get('quoteVolume', 0)
        
        if current_price <= 0 or volume_24h <= 0:
            return None
        
        # Calculate volatility (using high/low if available)
        high_24h = ticker.get('high', current_price)
        low_24h = ticker.get('low', current_price)
        volatility = (high_24h - low_24h) / current_price if current_price > 0 else 0
        
        # Estimate market cap (this is approximate)
        # In a real implementation, you'd fetch this from an API
        market_cap = volume_24h * 100  # Rough estimate
        
        # Calculate price momentum (if we have historical data)
        # For now, we'll use a simple metric based on current price
        momentum = 1.0  # Placeholder
        
        return {
            'pair': pair,
            'current_price': current_price,
            'volume_24h': volume_24h,
            'volatility': volatility,
            'market_cap': market_cap,
            'momentum': momentum
        }
    
    def _calculate_composite_score(self, df: pd.DataFrame) -> pd.Series:
        """
        Calculate composite score for ranking pairs.
        
        Args:
            df: DataFrame with pair metrics
            
        Returns:
            Series with composite scores
        """
        # Normalize metrics to 0-1 scale
        df_norm = df.copy()
        
        # Volume score (higher is better)
        df_norm['volume_score'] = (df_norm['volume_24h'] - df_norm['volume_24h'].min()) / \
                                 (df_norm['volume_24h'].max() - df_norm['volume_24h'].min())
        
        # Market cap score (higher is better)
        df_norm['market_cap_score'] = (df_norm['market_cap'] - df_norm['market_cap'].min()) / \
                                     (df_norm['market_cap'].max() - df_norm['market_cap'].min())
        
        # Volatility score (optimal range is best)
        optimal_volatility = (self._min_volatility + self._max_volatility) / 2
        df_norm['volatility_score'] = 1 - abs(df_norm['volatility'] - optimal_volatility) / optimal_volatility
        
        # Composite score (weighted average)
        composite_score = (
            df_norm['volume_score'] * 0.4 +
            df_norm['market_cap_score'] * 0.3 +
            df_norm['volatility_score'] * 0.3
        )
        
        return composite_score 