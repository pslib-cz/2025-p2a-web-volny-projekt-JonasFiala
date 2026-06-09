import pandas as pd

eq = pd.read_csv("default_equity.csv")
eq = eq[eq["time"].str.endswith("16:00:00")]
eq.to_csv("reduced_equity.csv", index=False)

spy = pd.read_csv("spy.csv")
i = 0
while True:
    if i < len(eq) or eq.iloc[i]["time"] == spy.iloc[i]["time"]:
        break
    i += 1

spy = spy.iloc[i::288]
spy.to_csv("reduced_spy.csv", index=False)
