import {
  SKILL_DESCRIPTION_MAX_LENGTH,
  SKILL_NAME_MAX_LENGTH,
  SKILL_NAME_PATTERN,
} from './constants.mjs';

/**
 * Parse YAML-like frontmatter from SKILL.md (name/description strings only).
 * @param {string} text
 * @returns {{ name: string | null, description: string | null, raw: string } | null}
 */
export function parseSkillFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---\n') && !normalized.startsWith('---\r\n')) {
    return null;
  }
  const endMatch = /\n---\r?\n/.exec(normalized.slice(3));
  if (!endMatch || endMatch.index === undefined) return null;
  const raw = normalized.slice(3, 3 + endMatch.index);
  const nameMatch = /^name:\s*(.+)\s*$/m.exec(raw);
  const descriptionMatch = /^description:\s*(.+)\s*$/m.exec(raw);
  const unwrap = (value) => {
    if (value === undefined) return null;
    const trimmed = value.trim();
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"'))
      || (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed.slice(1, -1);
    }
    return trimmed;
  };
  return {
    name: unwrap(nameMatch?.[1] ?? undefined),
    description: unwrap(descriptionMatch?.[1] ?? undefined),
    raw,
  };
}

/**
 * Validate SKILL.md frontmatter against directory name.
 * @param {string} text
 * @param {string} directoryName
 * @returns {string[]}
 */
export function validateSkillMdText(text, directoryName) {
  const errors = [];
  const frontmatter = parseSkillFrontmatter(text);
  if (!frontmatter) {
    return ['SKILL.md must start with YAML frontmatter delimited by ---'];
  }
  if (typeof frontmatter.name !== 'string' || frontmatter.name.length < 1) {
    errors.push('SKILL.md frontmatter name is required');
  } else {
    if (frontmatter.name.length > SKILL_NAME_MAX_LENGTH) {
      errors.push(`SKILL.md name exceeds ${SKILL_NAME_MAX_LENGTH} characters`);
    }
    if (!SKILL_NAME_PATTERN.test(frontmatter.name)) {
      errors.push('SKILL.md name must be lowercase letters, numbers, and single hyphens');
    }
    if (frontmatter.name !== directoryName) {
      errors.push(
        `SKILL.md name "${frontmatter.name}" must match directory name "${directoryName}"`,
      );
    }
  }
  if (typeof frontmatter.description !== 'string' || frontmatter.description.length < 1) {
    errors.push('SKILL.md frontmatter description is required');
  } else if (frontmatter.description.length > SKILL_DESCRIPTION_MAX_LENGTH) {
    errors.push(`SKILL.md description exceeds ${SKILL_DESCRIPTION_MAX_LENGTH} characters`);
  }
  return errors;
}
