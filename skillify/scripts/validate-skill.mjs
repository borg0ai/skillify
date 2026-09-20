#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateSkillDirectory } from './lib/validate-skill.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSkillRoot = path.resolve(scriptDir, '..');
const skillRoot = path.resolve(process.argv[2] || defaultSkillRoot);

const result = validateSkillDirectory(skillRoot);
if (result.ok) {
  process.stdout.write(`ok: skill "${result.skillName}" at ${skillRoot}\n`);
  process.exit(0);
}

process.stderr.write(`fail: skill "${result.skillName}" at ${skillRoot}\n`);
for (const error of result.errors) {
  process.stderr.write(`- ${error}\n`);
}
process.exit(1);
