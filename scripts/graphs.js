import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.mjs";

const pyodide = await loadPyodide();
await pyodide.loadPackage(["pandas", "yfinance"]);

const equity_csv = await fetch("/reduced_equity.csv").then(r => r.text());
const spy_csv = await fetch("/spy.csv").then(r => r.text());
const pyCode = await fetch("/scripts/graphs.py").then(r => r.text());

await pyodide.runPythonAsync(pyCode)
const compute = pyodide.globals.get("compute");
const resultProxy = compute(equity_csv);
const result = resultProxy.toJs();
const time_arr = result[0];
const equity_arr = result[1];
const drawdown_arr = result[2];
const spy_arr = result[3];
const spy_drawdown_arr = result[4];

console.log(result, time_arr, equity_arr, drawdown_arr, spy_arr);

function get_month_labels(time_arr) {
  return time_arr.map(t =>
    new Date(t).toLocaleString('default', {
      month: 'short',
      year: 'numeric'
    })
  );
}
const monthLabels = get_month_labels(time_arr);


Chart.defaults.color = '#6a6558';
Chart.defaults.font.family = "'Space Mono', monospace";
Chart.defaults.font.size = 12;

const gridColor = 'rgba(201,168,76,0.07)';
const tickColor = '#5a5448';

new Chart(document.getElementById('equity_canvas'), {
  type: 'line',
  data: {
    labels: monthLabels,
    datasets: [
      {
        label: 'Strategy',
        data: equity_arr,
        borderColor: '#c9a84c',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: {
          target: 'origin',
          above: 'rgba(201,168,76,0.04)'
        }
      },
      {
        label: 'SPY Buy & Hold',
        data: spy_arr,
        borderColor: '#2d4060',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.3,
        borderDash: [4,3]
      }
    ]
  },
  options: {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip:
      {
        backgroundColor: 'rgba(8,11,16,0.95)',
        borderColor: 'rgba(201,168,76,0.2)',
        borderWidth: 1,
        titleFont: { size: 10 },
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: tickColor, maxTicksLimit: 12 } },
      y: {
        grid: { color: gridColor }, ticks: { color: tickColor,
          callback: v => '$' + (v/1000).toFixed(0) + 'k'
        }
      }
    }
  }
});

new Chart(document.getElementById('drawdown_canvas'), {
type: 'line',
data: {
    labels: monthLabels,
    datasets: [
    {
        label: 'Strategy DD',
        data: drawdown_arr,
        borderColor: '#e25c5c',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.2,
        fill: { target: 'origin', below: 'rgba(226,92,92,0.12)' }
    },
    {
        label: 'SPY DD',
        data: spy_drawdown_arr,
        borderColor: '#2d4060',
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.2,
        borderDash: [3,3]
    }
    ]
},
options: {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
    legend: { display: false },
    tooltip: {
        backgroundColor: 'rgba(8,11,16,0.95)',
        borderColor: 'rgba(226,92,92,0.2)',
        borderWidth: 1,
        callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(2)}%` }
    }
    },
    scales: {
    x: { grid: { color: gridColor }, ticks: { color: tickColor, maxTicksLimit: 8 } },
    y: {
        grid: { color: gridColor },
        ticks: { color: tickColor, callback: v => v.toFixed(0) + '%' },
        max: 2
    }
    }
}
});
