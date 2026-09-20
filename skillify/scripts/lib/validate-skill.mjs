import fs from 'node:fs';
import path from 'node:path';

import { validateReleaseBoundary } from './boundary.mjs';
import { validateRelativeLinks } from './links.mjs';
import { validateSkillMdText } from './skill-md.mjs';
import { validateSkillReleaseValue } from './skill-release.mjs';

/**
 * Collect markdown files under a skill directory for link checking.
 * @param {string} skillRoot
 * @returns {string[]}
 */
function listMarkdownFiles(skillRoot) {
  /** @type {string[]} */
  const files = [];
  /** @type {string[]} */
  const stack = [skillRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(path.relative(skillRoot, absolute));
      }
    }
  }
  return files;
}

/**
 * Validate a skill directory for npx skills packaging readiness.
 * @param {string} skillRoot
 * @returns {{ ok: boolean, errors: string[], skillName: string }}
 */
export function validateSkillDirectory(skillRoot) {
  const resolvedRoot = path.resolve(skillRoot);
  const skillName = path.basename(resolvedRoot);
  /** @type {string[]} */
  const errors = [];

  if (!fs.existsSync(resolvedRoot) || !fs.statSync(resolvedRoot).isDirectory()) {
    return {
      ok: false,
      errors: [`skill directory does not exist: ${resolvedRoot}`],
      skillName,
    };
  }

  const skillMdPath = path.join(resolvedRoot, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    errors.push('SKILL.md is required');
  } else {
    const skillMd = fs.readFileSync(skillMdPath, 'utf8');
    errors.push(...validateSkillMdText(skillMd, skillName));
  }

  const releasePath = path.join(resolvedRoot, 'skill-release.json');
  if (!fs.existsSync(releasePath)) {
    errors.push('skill-release.json is required');
  } else {
    let releaseValue;
    try {
      releaseValue = JSON.parse(fs.readFileSync(releasePath, 'utf8'));
    } catch {
      errors.push('skill-release.json is not valid JSON');
      releaseValue = null;
    }
    let packageVersion = null;
    const packagePath = path.join(resolvedRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        if (typeof packageJson.version === 'string') {
          packageVersion = packageJson.version;
        }
      } catch {
        errors.push('package.json is not valid JSON');
      }
    }
    if (releaseValue !== null) {
      errors.push(...validateSkillReleaseValue(releaseValue, {
        skillId: skillName,
        packageVersion,
      }));
    }
  }

  errors.push(...validateRelativeLinks(resolvedRoot, listMarkdownFiles(resolvedRoot)));
  errors.push(...validateReleaseBoundary(resolvedRoot));

  return {
    ok: errors.length === 0,
    errors,
    skillName,
  };
}
