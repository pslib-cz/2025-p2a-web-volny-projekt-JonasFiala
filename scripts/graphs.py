from io import StringIO
import pandas as pd

def compute(equity_csv, spy_csv):
    df = pd.read_csv(StringIO(equity_csv), parse_dates=["time"])
    spy_data = pd.read_csv(StringIO(spy_csv))
    equity = df["equity"] * (10000 / df["equity"].iloc[0])
    running_max = equity.cummax()
    drawdown = (equity / running_max) - 1
    spy_equity = spy_data["Close"] * (10000 / spy_data["Close"].iloc[0])
    spy_drawdown = (spy_equity / spy_equity.cummax()) - 1

    return df["time"].astype(str).tolist(), equity.astype(float).tolist(), drawdown.tolist(), spy_equity.tolist(), spy_drawdown.tolist()
