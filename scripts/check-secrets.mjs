/* global console, process */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ignoredDirectories = new Set([
  '.git',
  '.next',
  'coverage',
  'node_modules',
  'playwright-report',
  'test-results',
]);

const ignoredFiles = new Set(['pnpm-lock.yaml']);
const textExtensions = new Set(['.css', '.json', '.md', '.mjs', '.ts', '.tsx', '.yaml', '.yml']);

const findings = [];
const patterns = [
  {
    name: 'private key',
    expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  { name: 'AWS access key', expression: /AKIA[0-9A-Z]{16}/ },
  {
    name: 'GitHub token',
    expression: /(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})/,
  },
  { name: 'Google API key', expression: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'OpenAI API key', expression: /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/ },
  { name: 'Slack token', expression: /xox[baprs]-[A-Za-z0-9-]{20,}/ },
  { name: 'Stripe secret', expression: /sk_(?:live|test)_[A-Za-z0-9]{16,}/ },
];

async function scanDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) {
          await scanDirectory(join(directory, entry.name));
        }
        return;
      }

      if (!entry.isFile() || ignoredFiles.has(entry.name)) {
        return;
      }

      const extension = entry.name.slice(entry.name.lastIndexOf('.'));
      if (!textExtensions.has(extension)) {
        return;
      }

      const path = join(directory, entry.name);
      const source = await readFile(path, 'utf8');

      for (const pattern of patterns) {
        if (pattern.expression.test(source)) {
          findings.push(`${relative(process.cwd(), path)}: possible ${pattern.name}`);
        }
      }
    }),
  );
}

await scanDirectory(process.cwd());

if (findings.length > 0) {
  console.error('Secret scan failed:\n' + findings.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Secret scan passed.');
}
