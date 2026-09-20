import fs from 'node:fs';
import path from 'node:path';

import {
  ABSOLUTE_PATH_LEAK_PATTERN,
  FORBIDDEN_PACKAGE_NAMES,
} from './constants.mjs';

/**
 * Walk skill tree for forbidden package names.
 * @param {string} skillRoot
 * @returns {string[]}
 */
export function validateReleaseBoundary(skillRoot) {
  const errors = [];
  /** @type {string[]} */
  const stack = [skillRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      errors.push(`unable to read directory ${path.relative(skillRoot, current) || '.'}`);
      continue;
    }
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      const relative = path.relative(skillRoot, absolute);
      if (FORBIDDEN_PACKAGE_NAMES.includes(entry.name)) {
        errors.push(`release boundary violated: packaged path "${relative}"`);
        continue;
      }
      if (entry.isDirectory()) {
        stack.push(absolute);
        continue;
      }
      if (!entry.isFile()) continue;
      if (!/\.(md|json|mjs|js|ts|txt|html|css)$/i.test(entry.name)) continue;
      let text;
      try {
        text = fs.readFileSync(absolute, 'utf8');
      } catch {
        errors.push(`unable to read ${relative}`);
        continue;
      }
      const leak = ABSOLUTE_PATH_LEAK_PATTERN.exec(text);
      if (leak) {
        errors.push(`${relative} contains absolute local path ${leak[1]}`);
      }
    }
  }
  return errors;
}
