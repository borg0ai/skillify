import fs from 'node:fs';
import path from 'node:path';

const MARKDOWN_LINK_PATTERN = /\[[^\]]*]\(([^)]+)\)/g;

/**
 * Collect relative markdown link targets from a file's text.
 * Skips http(s), mailto, and pure fragment links.
 * @param {string} text
 * @returns {string[]}
 */
export function extractRelativeMarkdownLinks(text) {
  const links = [];
  for (const match of text.matchAll(MARKDOWN_LINK_PATTERN)) {
    const target = match[1].trim().replace(/^<|>$/g, '');
    if (!target || target.startsWith('#')) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    const withoutFragment = target.split('#')[0];
    if (!withoutFragment) continue;
    links.push(withoutFragment);
  }
  return links;
}

/**
 * Ensure every relative markdown link from skill text files resolves inside the skill.
 * @param {string} skillRoot
 * @param {string[]} relativeFiles
 * @returns {string[]}
 */
export function validateRelativeLinks(skillRoot, relativeFiles) {
  const errors = [];
  for (const relativeFile of relativeFiles) {
    const absoluteFile = path.join(skillRoot, relativeFile);
    let text;
    try {
      text = fs.readFileSync(absoluteFile, 'utf8');
    } catch {
      errors.push(`unable to read ${relativeFile}`);
      continue;
    }
    const baseDir = path.dirname(absoluteFile);
    for (const link of extractRelativeMarkdownLinks(text)) {
      const resolved = path.resolve(baseDir, link);
      const relativeToSkill = path.relative(skillRoot, resolved);
      if (relativeToSkill.startsWith('..') || path.isAbsolute(relativeToSkill)) {
        errors.push(`${relativeFile} links outside the skill directory: ${link}`);
        continue;
      }
      if (!fs.existsSync(resolved)) {
        errors.push(`${relativeFile} links to missing path: ${link}`);
      }
    }
  }
  return errors;
}
