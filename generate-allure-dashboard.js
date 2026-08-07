import fs from 'fs/promises';
import path from 'path';

const HISTORY_PATH = path.resolve('allure-report/history/history.json');
const OUT_PATH = path.resolve('allure-report/dashboard.html');
const RUN_GAP_MS = 5 * 60 * 1000; // 5 minutes gap between runs

function formatDateTime(value) {
  const date = new Date(value);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function groupRuns(allItems) {
  const sorted = [...allItems].sort((a, b) => a.time.start - b.time.start);
  if (!sorted.length) return [];

  const runs = [];
  let current = {
    start: sorted[0].time.start,
    end: sorted[0].time.start,
    items: [sorted[0]]
  };

  for (const item of sorted.slice(1)) {
    if (item.time.start - current.end <= RUN_GAP_MS) {
      current.end = Math.max(current.end, item.time.start);
      current.items.push(item);
    } else {
      runs.push(current);
      current = {
        start: item.time.start,
        end: item.time.start,
        items: [item]
      };
    }
  }
  runs.push(current);

  return runs.map((run, index) => ({
    id: index + 1,
    start: run.start,
    end: run.end,
    items: run.items
  }));
}

function buildDashboard(runs, flakyKeys) {
  const dateGroups = new Map();

  const rows = runs.map((run) => {
    const counts = { passed: 0, failed: 0, broken: 0, skipped: 0, unknown: 0 };
    const flakySet = new Set();
    const seenKeys = new Set();

    for (const item of run.items) {
      counts[item.status] = (counts[item.status] || 0) + 1;
      if (flakyKeys.has(item.key)) {
        flakySet.add(item.key);
      }
      seenKeys.add(item.key);
    }

    const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
    const row = {
      id: run.id,
      start: run.start,
      end: run.end,
      date: formatDate(run.start),
      time: formatDateTime(run.start),
      durationMs: run.end - run.start,
      totalTests: total,
      flakyTests: flakySet.size,
      ...counts
    };

    const group = row.date;
    if (!dateGroups.has(group)) {
      dateGroups.set(group, []);
    }
    dateGroups.get(group).push(row);
    return row;
  });

  return { rows, dateGroups };
}

function renderHtml({ rows, dateGroups }, year, month) {
  const totalRuns = rows.length;
  const summary = `Total runs: ${totalRuns}`;
  const monthLabel = `${year}-${String(month).padStart(2, '0')}`;

  const rowsHtml = rows
    .map((row) => `
      <tr>
        <td>${row.id}</td>
        <td>${escapeHtml(row.date)}</td>
        <td>${escapeHtml(row.time)}</td>
        <td>${row.passed}</td>
        <td>${row.failed}</td>
        <td>${row.broken}</td>
        <td>${row.skipped}</td>
        <td>${row.unknown}</td>
        <td>${row.flakyTests}</td>
        <td>${row.totalTests}</td>
      </tr>
    `)
    .join('');

  const groupedHtml = [...dateGroups.entries()]
    .map(([date, groupRows]) => `
      <section class="group">
        <h2>${escapeHtml(date)} <span>${groupRows.length} run(s)</span></h2>
        <table>
          <thead>
            <tr>
              <th>Run</th>
              <th>Start Time</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Broken</th>
              <th>Skipped</th>
              <th>Unknown</th>
              <th>Flaky tests</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${groupRows
              .map(
                (row) => `
                <tr>
                  <td>${row.id}</td>
                  <td>${escapeHtml(row.time)}</td>
                  <td>${row.passed}</td>
                  <td>${row.failed}</td>
                  <td>${row.broken}</td>
                  <td>${row.skipped}</td>
                  <td>${row.unknown}</td>
                  <td>${row.flakyTests}</td>
                  <td>${row.totalTests}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
      </section>
    `)
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Allure Monthly Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #222; background: #f5f7fb; }
    header { background: #283e59; color: white; padding: 24px; }
    header h1 { margin: 0 0 8px 0; font-size: 28px; }
    header p { margin: 0; color: #d0d9e6; }
    main { padding: 24px; }
    .summary { margin-bottom: 24px; }
    .summary span { display: inline-block; margin-right: 24px; font-weight: 600; }
    section.group { margin-bottom: 32px; background: white; border-radius: 12px; box-shadow: 0 0 20px rgba(0,0,0,0.05); padding: 18px; }
    section.group h2 { margin: 0 0 16px 0; font-size: 20px; }
    section.group h2 span { color: #6b778c; font-size: 14px; margin-left: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { text-align: left; padding: 12px 10px; border-bottom: 1px solid #e1e8ef; }
    th { background: #f4f7fb; font-weight: 700; }
    tr:hover { background: #f8fbff; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; color: white; }
    .passed { background: #18a66f; }
    .failed { background: #d2465b; }
    .broken { background: #f2a33c; }
    .flaky { background: #6f66f5; }
    .empty { color: #777; }
  </style>
</head>
<body>
  <header>
    <h1>Allure Monthly Dashboard</h1>
    <p>Runs for ${escapeHtml(monthLabel)} from Allure history grouped by date, with passed/failed/broken/flaky status counts.</p>
  </header>
  <main>
    <div class="summary">
      <span>${summary}</span>
      <span>Dates shown: ${dateGroups.size}</span>
    </div>
    ${groupedHtml}
  </main>
</body>
</html>`;
}

function parseMonthArg(arg) {
  if (!arg) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }
  const match = arg.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    throw new Error('Month argument must be YYYY-MM');
  }
  return { year: Number(match[1]), month: Number(match[2]) };
}

function filterItemsByMonth(items, year, month) {
  return items.filter((item) => {
    const date = new Date(item.time.start);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });
}

async function main() {
  try {
    const raw = await fs.readFile(HISTORY_PATH, 'utf8');
    const history = JSON.parse(raw);
    const keys = Object.keys(history);
    const monthArg = process.argv[2];
    const { year, month } = parseMonthArg(monthArg);

    const allItems = [];
    const flakyKeys = new Set();

    for (const key of keys) {
      const entry = history[key];
      const statuses = new Set(entry.items.map((item) => item.status));
      if (statuses.size > 1) {
        flakyKeys.add(key);
      }
      for (const item of entry.items) {
        allItems.push({ ...item, key });
      }
    }

    const filteredItems = filterItemsByMonth(allItems, year, month);
    if (!filteredItems.length) {
      throw new Error(`No history items found for ${year}-${String(month).padStart(2, '0')}.`);
    }

    const runs = groupRuns(filteredItems);
    const data = buildDashboard(runs, flakyKeys);
    const html = renderHtml(data, year, month);
    await fs.writeFile(OUT_PATH, html, 'utf8');
    console.log(`Dashboard generated: ${OUT_PATH}`);
  } catch (error) {
    console.error('Failed to generate dashboard:', error.message);
    process.exit(1);
  }
}

main();
