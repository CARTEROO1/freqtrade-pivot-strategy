# --- Do not remove these libs ---
from freqtrade.strategy import IStrategy
from pandas import DataFrame
import talib.abstract as ta
import freqtrade.vendor.qtpylib.indicators as qtpylib
import numpy as np
from freqtrade.persistence import Trade
from datetime import datetime, timedelta

# --- Custom Indicator Helper Functions ---

def resample_to_weekly(dataframe: DataFrame) -> DataFrame:
    """
    Resamples the input DataFrame to a weekly timeframe. This is essential for calculating
    weekly indicators like CPR and Camarilla pivots.

    Args:
        dataframe (DataFrame): The input DataFrame with OHLCV data.

    Returns:
        DataFrame: A new DataFrame resampled to a weekly frequency.
    """
    weekly_df = dataframe.resample('W-MON', on='date', label='left', closed='left').agg({
        'open': 'first',
        'high': 'max',
        'low': 'min',
        'close': 'last'
    }).dropna()
    return weekly_df

def cpr(high, low, close):
    """
    Calculates the Central Pivot Range (CPR) levels.
    CPR is a key indicator for identifying potential support and resistance levels.

    Args:
        high (Series): A pandas Series of high prices.
        low (Series): A pandas Series of low prices.
        close (Series): A pandas Series of close prices.

    Returns:
        tuple: A tuple containing the pivot, top central (tc), and bottom central (bc) levels.
    """
    pivot = (high + low + close) / 3
    bc = (high + low) / 2
    tc = (pivot - bc) + pivot
    return pivot, tc, bc

def camarilla(high, low, close):
    """
    Calculates the Camarilla R3 and S3 pivot levels.
    These levels are used to identify potential breakout or breakdown points.

    Args:
        high (Series): A pandas Series of high prices.
        low (Series): A pandas Series of low prices.
        close (Series): A pandas Series of close prices.

    Returns:
        tuple: A tuple containing the R3 and S3 levels.
    """
    r3 = close + ((high - low) * 1.1 / 4)
    s3 = close - ((high - low) * 1.1 / 4)
    return r3, s3

class CprCamarillaSmaStrategy(IStrategy):
    """
    This is a comprehensive Freqtrade strategy based on the following components:
    - Primary Indicator: Weekly CPR (Central Pivot Range) applied to a 1-hour timeframe.
    - Supporting Indicators: Weekly Camarilla Pivots, SMA 200, and SMA 21.
    - Risk Management: 2.5% stop loss, trailing stop, max 2 concurrent trades, and a 12-hour cooldown.

    Author: Jules
    Version: 1.1 (Final)
    """

    # --- Strategy Configuration ---
    timeframe = '1h'
    startup_candle_count: int = 200  # Required for the SMA 200

    # --- Risk Management Settings ---
    stoploss = -0.025  # Fixed 2.5% stop loss

    # Trailing stop loss configuration
    trailing_stop = True
    trailing_stop_positive = 0.005  # Trail by 0.5%
    trailing_stop_positive_offset = 0.03  # Activate at 3% profit
    trailing_only_offset_is_reached = True

    # --- Concurrency and Cooldown ---
    max_open_trades = 2  # Limits concurrent trades to 2

    # These values can be overridden in the config.json file
    use_exit_signal = True
    exit_profit_only = False
    ignore_roi_if_entry_signal = False

    def populate_indicators(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Populates the DataFrame with all necessary indicators.
        """
        # --- Step 1: Calculate Weekly Indicators ---
        # Resample the 1-hour data to weekly to get weekly OHLC
        weekly_df = resample_to_weekly(dataframe)

        # Shift the weekly data to get the *previous* week's values for pivot calculation
        weekly_df['prev_high'] = weekly_df['high'].shift(1)
        weekly_df['prev_low'] = weekly_df['low'].shift(1)
        weekly_df['prev_close'] = weekly_df['close'].shift(1)

        # Calculate Weekly CPR and Camarilla levels using the previous week's data
        weekly_df['pivot'], weekly_df['tc'], weekly_df['bc'] = cpr(
            weekly_df['prev_high'], weekly_df['prev_low'], weekly_df['prev_close']
        )
        weekly_df['r3'], weekly_df['s3'] = camarilla(
            weekly_df['prev_high'], weekly_df['prev_low'], weekly_df['prev_close']
        )

        # --- Step 2: Merge Weekly Indicators into the Hourly DataFrame ---
        # Create a weekly date index on both dataframes to facilitate the merge
        dataframe['weekly_date'] = dataframe['date'].dt.to_period('W-MON').apply(lambda p: p.start_time).dt.date
        weekly_df['weekly_date'] = weekly_df.index.date

        # Select only the required weekly indicator columns to merge
        weekly_indicators = weekly_df[['weekly_date', 'pivot', 'tc', 'bc', 'r3', 's3']]

        # Merge the weekly indicators into the main hourly dataframe
        dataframe = dataframe.merge(weekly_indicators, on='weekly_date', how='left')

        # Forward-fill the weekly values to apply them to all hours of the current week
        dataframe.fillna(method='ffill', inplace=True)

        # --- Step 3: Calculate Standard Indicators on the 1-hour timeframe ---
        dataframe['sma_200'] = ta.SMA(dataframe, timeperiod=200)
        dataframe['sma_21'] = ta.SMA(dataframe, timeperiod=21)

        return dataframe

    def populate_entry_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        Defines the entry conditions for long and short trades.
        """
        # --- Long Entry Conditions ---
        # 1. Price crosses above the Top Central Pivot (TC)
        # 2. Price is above the 200-period SMA (long-term trend)
        # 3. Price is above the 21-period SMA (short-term trend)
        # 4. Price is above the R3 Camarilla level (breakout confirmation)
        long_conditions = [
            qtpylib.crossed_above(dataframe['close'], dataframe['tc']),
            dataframe['close'] > dataframe['sma_200'],
            dataframe['close'] > dataframe['sma_21'],
            dataframe['close'] > dataframe['r3']
        ]

        # --- Short Entry Conditions ---
        # 1. Price crosses below the Bottom Central Pivot (BC)
        # 2. Price is below the 200-period SMA (long-term trend)
        # 3. Price is below the 21-period SMA (short-term trend)
        # 4. Price is below the S3 Camarilla level (breakdown confirmation)
        short_conditions = [
            qtpylib.crossed_below(dataframe['close'], dataframe['bc']),
            dataframe['close'] < dataframe['sma_200'],
            dataframe['close'] < dataframe['sma_21'],
            dataframe['close'] < dataframe['s3']
        ]

        # Apply conditions to the dataframe, setting entry signals and tags
        dataframe.loc[np.all(long_conditions, axis=0), ['enter_long', 'enter_tag']] = (1, 'long_entry_signal')
        dataframe.loc[np.all(short_conditions, axis=0), ['enter_short', 'enter_tag']] = (1, 'short_entry_signal')

        return dataframe

    def populate_exit_trend(self, dataframe: DataFrame, metadata: dict) -> DataFrame:
        """
        This strategy uses stop-loss and trailing stop-loss for exits.
        This method is required by Freqtrade but is not used for custom exit signals.
        """
        dataframe.loc[:, ['exit_long', 'exit_short']] = (0, 0)
        return dataframe

    def custom_leverage(self, pair: str, current_time: 'datetime', current_rate: float,
                        proposed_leverage: float, max_leverage: float, side: str,
                        **kwargs) -> float:
        """
        Sets a custom leverage for each trade.
        """
        return 3.0

    def confirm_trade_entry(self, pair: str, order_type: str, amount: float, rate: float,
                            time_in_force: str, current_time: datetime, **kwargs) -> bool:
        """
        Confirms a trade entry by checking for a cooldown period. This prevents over-trading
        by ensuring that no new trade is opened for a pair within 12 hours of the last one closing.
        """
        trade = Trade.get_trades(pair=pair, is_open=False).order_by(Trade.close_date.desc()).first()
        if trade:
            cooldown_period = timedelta(hours=12)
            # Check if the time since the last trade closed is less than the cooldown period
            if current_time - trade.close_date < cooldown_period:
                # If within cooldown, block the trade and log a message
                self.dp.send_msg(f"Cooldown active for {pair}. Last trade closed at {trade.close_date}. Trade blocked.")
                return False

        # If not in cooldown, allow the trade
        return True