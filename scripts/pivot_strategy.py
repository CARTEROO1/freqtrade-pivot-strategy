#!/usr/bin/env python3
"""
Pivot Camarilla Strategy for Freqtrade
"""

import freqtrade.vendor.qtpylib.indicators as qtpylib
import numpy as np
import talib.abstract as ta
from freqtrade.strategy import IStrategy, merge_informative_pair
from pandas import DataFrame

class PivotCamarillaStrategy(IStrategy):
    """
    This is a strategy based on Camarilla Pivots.
    """

    # Strategy interface version - attribute needed by Freqtrade
    INTERFACE_VERSION = 2

    # Minimal ROI designed for the strategy.
    minimal_roi = {
        "0": 0.05,
        "30": 0.03,
        "60": 0.01
    }

    # Stoploss:
    use_custom_stoploss = True

    # Trailing stop:
    trailing_stop = True
    trailing_stop_positive = 0.01
    trailing_stop_positive_offset = 0.02
    trailing_only_offset_is_reached = True

    # Optimal timeframe for the strategy
    timeframe = '5m'

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Adds several different TA indicators to the given DataFrame
        """
        # Pivots
        dataframe['pivot'], dataframe['r1'], dataframe['s1'] = self.pivot_points(dataframe)
        dataframe['r2'], dataframe['s2'] = self.pivot_points_r2_s2(dataframe)
        dataframe['r3'], dataframe['s3'] = self.pivot_points_r3_s3(dataframe)

        # Camarilla Pivots
        dataframe['c_r1'], dataframe['c_s1'] = self.camarilla(dataframe, 1)
        dataframe['c_r2'], dataframe['c_s2'] = self.camarilla(dataframe, 2)
        dataframe['c_r3'], dataframe['c_s3'] = self.camarilla(dataframe, 3)

        # RSI
        dataframe['rsi'] = ta.RSI(dataframe, timeperiod=14)

        # EMA
        dataframe['ema50'] = ta.EMA(dataframe, timeperiod=50)

        # ATR
        dataframe['atr'] = ta.ATR(dataframe, timeperiod=14)

        return dataframe

    def populate_buy_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Based on TA indicators, populates the buy signal for the given dataframe
        """
        dataframe.loc[
            (
                (dataframe['close'] > dataframe['c_r1']) &
                (dataframe['rsi'] > 50) &
                (dataframe['close'] > dataframe['ema50']) &
                (dataframe['volume'] > 0)
            ),
            'buy'] = 1

        return dataframe

    def populate_sell_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Based on TA indicators, populates the sell signal for the given dataframe
        """
        dataframe.loc[
            (
                (dataframe['close'] < dataframe['c_s1']) &
                (dataframe['rsi'] < 50) &
                (dataframe['close'] < dataframe['ema50']) &
                (dataframe['volume'] > 0)
            ),
            'sell'] = 1
        return dataframe

    def custom_stoploss(self, pair: str, trade: 'Trade', current_time: datetime,
                        current_rate: float, current_profit: float, **kwargs) -> float:
        """
        Custom stoploss logic, returning the new distance relative to current_rate.
        """
        dataframe, _ = self.dp.get_analyzed_dataframe(pair, self.timeframe)
        last_candle = dataframe.iloc[-1].squeeze()
        atr_multiplier = 2.0
        stoploss_price = last_candle['open'] - (last_candle['atr'] * atr_multiplier)

        # Convert stoploss price to a relative value
        if (current_rate > stoploss_price):
            return (current_rate - stoploss_price) / current_rate

        return 1 # return a value > 1 to disable stoploss

    def pivot_points(self, dataframe: DataFrame):
        """
        Calculates pivot points
        """
        high = dataframe['high']
        low = dataframe['low']
        close = dataframe['close']
        pivot = (high + low + close) / 3
        r1 = 2 * pivot - low
        s1 = 2 * pivot - high
        return pivot, r1, s1

    def pivot_points_r2_s2(self, dataframe: DataFrame):
        """
        Calculates R2 and S2 pivot points
        """
        high = dataframe['high']
        low = dataframe['low']
        pivot, r1, s1 = self.pivot_points(dataframe)
        r2 = pivot + (high - low)
        s2 = pivot - (high - low)
        return r2, s2

    def pivot_points_r3_s3(self, dataframe: DataFrame):
        """
        Calculates R3 and S3 pivot points
        """
        high = dataframe['high']
        low = dataframe['low']
        pivot, r1, s1 = self.pivot_points(dataframe)
        r2, s2 = self.pivot_points_r2_s2(dataframe)
        r3 = high + 2 * (pivot - low)
        s3 = low - 2 * (high - pivot)
        return r3, s3

    def camarilla(self, dataframe: DataFrame, level: int):
        """
        Calculates Camarilla pivot points
        """
        high = dataframe['high']
        low = dataframe['low']
        close = dataframe['close']
        pivot, r1, s1 = self.pivot_points(dataframe)
        range_ = high - low
        if level == 1:
            r = close + (range_ * 1.1 / 12)
            s = close - (range_ * 1.1 / 12)
        elif level == 2:
            r = close + (range_ * 1.1 / 6)
            s = close - (range_ * 1.1 / 6)
        elif level == 3:
            r = close + (range_ * 1.1 / 4)
            s = close - (range_ * 1.1 / 4)
        else:
            r = np.nan
            s = np.nan
        return r, s
