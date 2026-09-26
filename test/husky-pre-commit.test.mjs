import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const preCommitPath = path.join(repoRoot, '.husky', 'pre-commit');
const packageJsonPath = path.join(repoRoot, 'package.json');
const testCommand = 'pnpm test';
const prepareCommand = 'husky';

describe('husky pre-commit', () => {
  it('runs the test script before a commit', () => {
    const hook = readFileSync(preCommitPath, 'utf8');
    const commands = hook
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#'));

    assert.deepEqual(commands, [testCommand]);
  });

  it('installs hooks through the prepare script', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    assert.equal(packageJson.scripts.prepare, prepareCommand);
  });
});
