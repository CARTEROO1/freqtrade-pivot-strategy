from freqtrade.strategy import IStrategy
from pandas import DataFrame
import talib.abstract as ta
import pandas as pd

class SimpleTestStrategy(IStrategy):
    """
    Simple test strategy to verify backtesting works.
    """
    INTERFACE_VERSION = 3
    timeframe = '30m'
    startup_candle_count = 60  # Increased from 30 to 60 to ensure SMA50 has enough data (50 candles + buffer)
    minimal_roi = {"0": 0.1}
    stoploss = -0.05

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Add simple indicators.
        """
        # Add SMA
        dataframe['sma20'] = ta.SMA(dataframe, timeperiod=20)
        dataframe['sma50'] = ta.SMA(dataframe, timeperiod=50)
        
        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Simple entry logic: Buy when price crosses above SMA20.
        """
        dataframe.loc[
            (
                (dataframe['close'] > dataframe['sma20']) &
                (dataframe['close'].shift(1) <= dataframe['sma20'].shift(1))
            ),
            'enter_long'
        ] = 1
        
        return dataframe

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Simple exit logic: Sell when price crosses below SMA20.
        """
        dataframe.loc[
            (
                (dataframe['close'] < dataframe['sma20']) &
                (dataframe['close'].shift(1) >= dataframe['sma20'].shift(1))
            ),
            'exit_long'
        ] = 1
        
        return dataframe 