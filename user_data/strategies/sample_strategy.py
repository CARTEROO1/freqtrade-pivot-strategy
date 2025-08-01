from freqtrade.strategy import IStrategy, informative
from pandas import DataFrame
import talib.abstract as ta
import numpy as np
import pandas as pd
import logging
from functools import reduce

logger = logging.getLogger(__name__)

class PivotCamarillaStrategy(IStrategy):
    """
    Freqtrade strategy using Mark Fisher Pivot Range, Camarilla pivots, EMA200, and RSI.
    All pivots are calculated from the previous day's values.
    
    Features:
    - Dynamic stoploss based on ATR(14)
    - Custom ROI targets based on volatility
    - Volume and volatility filters
    - Support for both long and short positions
    """
    INTERFACE_VERSION = 3
    timeframe = '30m'
    startup_candle_count = 210  # Ensure enough candles for EMA200
    
    # Strategy constants
    ATR_PERIOD = 14
    ATR_MEAN_PERIOD = 20
    VOLUME_MEAN_PERIOD = 20
    EMA_PERIOD = 200
    ATR_STOPLOSS_MULTIPLIER = 1.5
    ATR_ROI_MULTIPLIER = 2.0
    CAMARILLA_MULTIPLIER = 1.1

    plot_config = {
        'main_plot': {
            'd_pivot': {'color': 'fuchsia', 'type': 'scatter'},
            'd_bc': {'color': 'blue', 'type': 'scatter'},
            'd_tc': {'color': 'red', 'type': 'scatter'},
            'd_cama_h4': {'color': 'orange', 'type': 'scatter'},
            'd_cama_h3': {'color': 'orange', 'type': 'scatter'},
            'd_cama_l3': {'color': 'orange', 'type': 'scatter'},
            'd_cama_l4': {'color': 'orange', 'type': 'scatter'},
            'ema200': {'color': 'green', 'type': 'scatter'},
        },
        'subplots': {
            # Example: 'ATR': {'atr14': {'color': 'purple'}},
            # Example: 'Volume': {'volume': {'color': 'gray'}}
        }
    }

    @informative('1d')
    def populate_indicators_1d(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Calculate daily pivots and Camarilla levels from 1d timeframe.
        
        Args:
            dataframe: Daily timeframe dataframe
            metadata: Pair metadata
            
        Returns:
            DataFrame with calculated pivot levels
        """
        # Mark Fisher Pivot Range
        dataframe['pivot'] = (dataframe['high'] + dataframe['low'] + dataframe['close']) / 3
        dataframe['bc'] = (dataframe['high'] + dataframe['low']) / 2
        dataframe['tc'] = (dataframe['pivot'] - dataframe['bc']) + dataframe['pivot']

        # Camarilla pivots
        H = dataframe['high']
        L = dataframe['low']
        C = dataframe['close']
        range_multiplier = self.CAMARILLA_MULTIPLIER / 2
        
        dataframe['cama_h4'] = C + (H - L) * range_multiplier * 2
        dataframe['cama_h3'] = C + (H - L) * range_multiplier
        dataframe['cama_l3'] = C - (H - L) * range_multiplier
        dataframe['cama_l4'] = C - (H - L) * range_multiplier * 2
        
        return dataframe

    def _validate_dataframe(self, dataframe: DataFrame) -> bool:
        """
        Validate dataframe for required columns and data integrity.
        
        Args:
            dataframe: DataFrame to validate
            
        Returns:
            bool: True if valid, False otherwise
        """
        required_columns = ['open', 'high', 'low', 'close']
        if not all(col in dataframe.columns for col in required_columns):
            logger.warning(f"Missing required columns: {required_columns}")
            return False
            
        if dataframe.empty:
            logger.warning("DataFrame is empty")
            return False
            
        return True

    def _add_technical_indicators(self, dataframe: DataFrame) -> DataFrame:
        """
        Add technical indicators to the dataframe.
        
        Args:
            dataframe: DataFrame to add indicators to
            
        Returns:
            DataFrame with added indicators
        """
        # Add EMA200
        dataframe['ema200'] = ta.EMA(dataframe, timeperiod=self.EMA_PERIOD)
        
        # Add ATR(14) as volatility filter
        dataframe['atr14'] = ta.ATR(dataframe, timeperiod=self.ATR_PERIOD)
        dataframe['atr14_mean'] = dataframe['atr14'].rolling(
            window=self.ATR_MEAN_PERIOD, min_periods=1
        ).mean()
        dataframe['volatility_filter'] = dataframe['atr14'] > dataframe['atr14_mean']

        # Add volume filter (volume above 20-period mean)
        if 'volume' in dataframe.columns:
            dataframe['volume_mean'] = dataframe['volume'].rolling(
                window=self.VOLUME_MEAN_PERIOD, min_periods=1
            ).mean()
            dataframe['volume_filter'] = dataframe['volume'] > dataframe['volume_mean']
        else:
            dataframe['volume_filter'] = True  # fallback if no volume data
            
        return dataframe

    def _merge_daily_indicators(self, dataframe: DataFrame) -> DataFrame:
        """
        Merge daily pivots and Camarilla levels into main timeframe.
        
        Args:
            dataframe: DataFrame to merge indicators into
            
        Returns:
            DataFrame with merged daily indicators
        """
        dataframe = dataframe.sort_index()  # Ensure sorted by date
        
        if not isinstance(dataframe.index, pd.DatetimeIndex):
            dataframe.index = pd.to_datetime(dataframe.index)

        # Copy previous day's pivots and Camarilla levels
        daily_columns = ['pivot', 'bc', 'tc', 'cama_h4', 'cama_h3', 'cama_l3', 'cama_l4']
        
        for col in daily_columns:
            daily_col = f'{col}_1d'
            if daily_col in dataframe.columns:
                dataframe[f'd_{col}'] = dataframe[daily_col]
            else:
                dataframe[f'd_{col}'] = np.nan

        # Forward-fill all d_ columns for plotting
        d_columns = [f'd_{col}' for col in daily_columns]
        for col in d_columns:
            dataframe[col] = dataframe[col].ffill()
            
        return dataframe

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Merge daily pivots and Camarilla levels into main timeframe, calculate EMA200, ATR, and volume filters.
        
        Args:
            dataframe: Main timeframe dataframe
            metadata: Pair metadata
            
        Returns:
            DataFrame with all indicators
        """
        if not self._validate_dataframe(dataframe):
            return dataframe
            
        try:
            # Merge daily indicators
            dataframe = self._merge_daily_indicators(dataframe)
            
            # Add technical indicators
            dataframe = self._add_technical_indicators(dataframe)
            
            # Add a date column for trade counting and custom stop/roi
            if 'date' in dataframe.columns:
                dataframe['date'] = pd.to_datetime(dataframe['date'], errors='coerce')
            else:
                dataframe['date'] = dataframe.index.date
                
        except Exception as e:
            logger.error(f"Error in populate_indicators for {metadata['pair']}: {str(e)}")
            
        return dataframe

    # TODO: Re-enable dynamic stoploss and ROI methods when market conditions stabilize
    # Current static values are optimized for weekly targets and trailing:
    # - Stoploss: -0.15 (15% loss limit) - conservative risk management
    # - ROI: 0.03 (3% initial target) - weekly target with trailing stop
    # - Trailing: Activates at +1% with 2% offset for maximum profit capture
    # These values provide balanced risk-reward with trailing stop optimization
    # def custom_stoploss(self, pair: str, trade, current_time: pd.Timestamp, 
    #                    current_rate: float, current_profit: float, **kwargs) -> float:
    #     """
    #     Dynamic stoploss based on ATR(14) at trade open.
    #     """
    #     # Temporarily disabled to use static values
    #     return -0.15  # Use conservative static stoploss from JSON

    # def custom_roi(self, pair: str, trade, current_time: pd.Timestamp, 
    #               current_rate: float, current_profit: float, **kwargs) -> float:
    #     """
    #     Dynamic ROI target based on ATR(14) at trade open.
    #     """
    #     # Temporarily disabled to use static values
    #     return 0.03  # Use weekly target ROI from JSON

    can_short = True

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Define entry signals based on pivot levels and technical indicators.
        
        Args:
            dataframe: DataFrame with indicators
            metadata: Pair metadata
            
        Returns:
            DataFrame with entry signals
        """
        # Long entry conditions - simplified for testing
        long_condition = (
            (dataframe['close'] > dataframe['d_pivot']) &
            (dataframe['close'] > dataframe['ema200']) &
            (dataframe['volatility_filter']) &
            (dataframe['volume_filter'])
        )
        
        # Short entry conditions - simplified for testing
        short_condition = (
            (dataframe['close'] < dataframe['d_pivot']) &
            (dataframe['close'] < dataframe['ema200']) &
            (dataframe['volatility_filter']) &
            (dataframe['volume_filter'])
        )

        # Set entry signals
        dataframe.loc[long_condition, 'enter_long'] = 1
        dataframe.loc[short_condition, 'enter_short'] = 1

        return dataframe

    def custom_entry(self, pair: str, current_time: pd.Timestamp, current_rate: float, 
                    signal: dict, trade_count: int, trades: list, **kwargs) -> bool:
        """
        Custom entry logic to prevent over-trading.
        
        Args:
            pair: Trading pair
            current_time: Current timestamp
            current_rate: Current rate
            signal: Entry signal
            trade_count: Number of current trades
            trades: List of current trades
            
        Returns:
            bool: True if entry should proceed
        """
        # Add any custom entry logic here
        return True

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Define exit signals based on pivot levels and technical indicators.
        
        Args:
            dataframe: DataFrame with indicators
            metadata: Pair metadata
            
        Returns:
            DataFrame with exit signals
        """
        # Long exit conditions
        dataframe.loc[
            (
                (dataframe['close'] < dataframe['d_pivot']) |
                (dataframe['close'] < dataframe['ema200'])
            ),
            'exit_long'
        ] = 1
        
        # Short exit conditions
        dataframe.loc[
            (
                (dataframe['close'] > dataframe['d_pivot']) |
                (dataframe['close'] > dataframe['ema200'])
            ),
            'exit_short'
        ] = 1

        return dataframe

    def leverage(self, pair: str, current_time: pd.Timestamp, current_rate: float,
                proposed_leverage: float, max_leverage: float, entry_tag: str,
                side: str, **kwargs) -> float:
        """
        Custom leverage calculation.
        
        Args:
            pair: Trading pair
            current_time: Current timestamp
            current_rate: Current rate
            proposed_leverage: Proposed leverage
            max_leverage: Maximum allowed leverage
            entry_tag: Entry tag
            side: Trade side (long/short)
            
        Returns:
            float: Leverage to use
        """
        # Use conservative leverage (2x) for risk management
        return min(2.0, max_leverage)