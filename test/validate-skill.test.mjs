import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { validateSkillDirectory } from '../skillify/scripts/lib/validate-skill.mjs';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(testDir, 'fixtures');
const skillifyRoot = path.resolve(testDir, '../skillify');

describe('validateSkillDirectory', () => {
  it('accepts the skillify package itself', () => {
    const result = validateSkillDirectory(skillifyRoot);
    assert.equal(result.ok, true, result.errors.join('\n'));
    assert.equal(result.skillName, 'skillify');
  });

  it('accepts a minimal valid fixture', () => {
    const result = validateSkillDirectory(path.join(fixtures, 'valid-skill'));
    assert.equal(result.ok, true, result.errors.join('\n'));
  });

  it('rejects a skill without skill-release.json', () => {
    const result = validateSkillDirectory(path.join(fixtures, 'missing-release'));
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((error) => error.includes('skill-release.json is required')));
  });

  it('rejects channel and version mismatches', () => {
    const result = validateSkillDirectory(path.join(fixtures, 'bad-channel'));
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((error) => error.includes('does not match version')));
  });

  it('rejects SKILL.md name that does not match the directory', () => {
    const result = validateSkillDirectory(path.join(fixtures, 'name-mismatch', 'wrong-name'));
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((error) => error.includes('must match directory name')));
  });
});
