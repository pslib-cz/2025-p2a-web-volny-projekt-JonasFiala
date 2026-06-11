import pandas as pd

eq = pd.read_csv("default_equity.csv")
eq = eq[["time", "equity"]]
eq["time"] = pd.to_datetime(eq["time"])
eq = eq[eq["time"].dt.strftime("%H:%M:%S") == "09:30:00"]

spy = pd.read_csv("spy.csv")
spy["time"] = pd.to_datetime(spy["time"])
spy = spy[spy["time"].dt.strftime("%H:%M:%S") == "09:30:00"]

start_time = eq.iloc[0]["time"]
spy = spy[spy["time"] >= start_time]

missing = eq.loc[~eq["time"].isin(spy["time"]), "time"]

for t in missing:
    print(t.strftime("%Y-%m-%d %H:%M:%S"))

spy.to_csv("reduced_spy.csv", index=False)
eq.to_csv("reduced_equity.csv", index=False)
