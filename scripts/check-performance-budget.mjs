/* global URL, console */

import { readFile } from 'node:fs/promises';

const budget = JSON.parse(
  await readFile(new URL('../performance-budget.json', import.meta.url), 'utf8'),
);
const metricEntries = Object.entries(budget.metrics ?? {});
const invalidMetric = metricEntries.find(([, value]) => typeof value !== 'number' || value < 0);
if (invalidMetric !== undefined) {
  throw new Error(`Invalid performance budget: ${invalidMetric[0]}`);
}
if (budget.metrics.cls > 0.1) {
  throw new Error('CLS budget must not exceed 0.1.');
}
if (budget.motion?.heroRevealMaxMs > 1800 || budget.motion?.sectionRevealDistancePx > 24) {
  throw new Error('Motion budget exceeds the documented launch gate.');
}
if (!Array.isArray(budget.routes) || budget.routes.length === 0) {
  throw new Error('Performance budget must name at least one synthetic route.');
}
console.log(`Performance budget valid for ${budget.routes.length} routes.`);
