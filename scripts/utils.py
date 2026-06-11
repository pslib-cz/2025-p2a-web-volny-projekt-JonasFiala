from io import StringIO
import pandas as pd

def compute(equity_csv, spy_csv):
    equity = pd.read_csv(StringIO(equity_csv), parse_dates=["time"])
    spy_data = pd.read_csv(StringIO(spy_csv))

    if len(equity) == 0 or len(spy_data) == 0:
        raise ValueError("equity_csv and spy_csv must not be empty")
    if len(equity) != len(spy_data):
        raise ValueError(f"equity_csv len: {len(equity)} and spy_csv len: {len(spy_data)} must have the same length")
    tm_series = equity["time"]
    equity = equity["equity"] * (10000 / equity["equity"].iloc[0])
    spy_equity = spy_data["close"] * (10000 / spy_data["close"].iloc[0])
    drawdown = ((equity / equity.cummax()) - 1)*100
    spy_drawdown = ((spy_equity / spy_equity.cummax()) - 1)*100

    return tm_series.astype(str).tolist(), equity.astype(float).tolist(), drawdown.tolist(), spy_equity.tolist(), spy_drawdown.tolist()
