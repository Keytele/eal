/* global console, process */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const packagePaths = [
  'apps/web/package.json',
  'packages/analytics/package.json',
  'packages/design-tokens/package.json',
  'packages/domain/package.json',
  'packages/i18n/package.json',
  'packages/testing/package.json',
  'packages/ui/package.json',
  'packages/vehicle-data/package.json',
];

const permittedWorkspaceDependencies = new Map([
  ['@eal/analytics', new Set(['@eal/domain'])],
  ['@eal/design-tokens', new Set()],
  ['@eal/domain', new Set()],
  ['@eal/i18n', new Set(['@eal/domain'])],
  ['@eal/testing', new Set(['@eal/analytics', '@eal/domain', '@eal/i18n', '@eal/ui'])],
  ['@eal/ui', new Set(['@eal/design-tokens'])],
  ['@eal/vehicle-data', new Set(['@eal/domain'])],
]);

const prohibitedServerDependencies = new Set(['next', 'server-only']);
const failures = [];

for (const packagePath of packagePaths) {
  const manifest = JSON.parse(await readFile(join(process.cwd(), packagePath), 'utf8'));
  const dependencies = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
    ...manifest.peerDependencies,
  };

  if (manifest.name === '@eal/web') {
    continue;
  }

  const allowedDependencies = permittedWorkspaceDependencies.get(manifest.name);
  if (!allowedDependencies) {
    failures.push(`${packagePath}: missing dependency-direction policy.`);
    continue;
  }

  for (const dependencyName of Object.keys(dependencies)) {
    if (dependencyName.startsWith('@eal/') && !allowedDependencies.has(dependencyName)) {
      failures.push(
        `${packagePath}: ${manifest.name} cannot depend on ${dependencyName}; it violates the workspace direction.`,
      );
    }

    if (prohibitedServerDependencies.has(dependencyName)) {
      failures.push(
        `${packagePath}: ${manifest.name} is a shared package and cannot depend on ${dependencyName}.`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(`Workspace dependency check failed:\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('Workspace dependency direction check passed.');
}
