import {
  CHANNEL_DEVELOPMENT,
  CHANNEL_STABLE,
  HTTPS_URL_PATTERN,
  SKILL_RELEASE_KEYS,
  SKILL_RELEASE_SCHEMA_VERSION,
} from './constants.mjs';
import { parseSemver, releaseChannelForVersion } from './semver.mjs';

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * @param {Record<string, unknown>} value
 * @param {readonly string[]} expected
 */
function hasExactKeys(value, expected) {
  return Object.keys(value).sort().join('\0') === [...expected].sort().join('\0');
}

/**
 * Validate skill-release.json object shape and identity rules.
 * @param {unknown} value
 * @param {{ skillId?: string, packageVersion?: string | null }} [options]
 * @returns {string[]} error messages (empty when valid)
 */
export function validateSkillReleaseValue(value, options = {}) {
  const errors = [];
  if (!isPlainObject(value)) {
    return ['skill-release.json must be a JSON object'];
  }
  if (!hasExactKeys(value, SKILL_RELEASE_KEYS)) {
    errors.push(
      `skill-release.json keys must be exactly: ${SKILL_RELEASE_KEYS.join(', ')}`,
    );
  }
  if (value.schemaVersion !== SKILL_RELEASE_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${SKILL_RELEASE_SCHEMA_VERSION}`);
  }
  if (typeof value.skillId !== 'string' || value.skillId.length < 1) {
    errors.push('skillId must be a non-empty string');
  } else if (options.skillId && value.skillId !== options.skillId) {
    errors.push(`skillId must equal skill name "${options.skillId}"`);
  }
  if (value.channel !== CHANNEL_STABLE && value.channel !== CHANNEL_DEVELOPMENT) {
    errors.push(`channel must be "${CHANNEL_STABLE}" or "${CHANNEL_DEVELOPMENT}"`);
  }
  try {
    parseSemver(/** @type {string} */ (value.version));
    const expectedChannel = releaseChannelForVersion(/** @type {string} */ (value.version));
    if (value.channel === CHANNEL_STABLE || value.channel === CHANNEL_DEVELOPMENT) {
      if (value.channel !== expectedChannel) {
        errors.push(
          `channel "${value.channel}" does not match version "${value.version}" (expected ${expectedChannel})`,
        );
      }
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'invalid version');
  }
  if (!isPlainObject(value.source) || !hasExactKeys(value.source, ['repository'])) {
    errors.push('source must be exactly { "repository": "<url>" }');
  } else if (
    typeof value.source.repository !== 'string'
    || !HTTPS_URL_PATTERN.test(value.source.repository)
  ) {
    errors.push('source.repository must be an https URL');
  }
  if (
    typeof value.updateManifestUrl !== 'string'
    || !HTTPS_URL_PATTERN.test(value.updateManifestUrl)
  ) {
    errors.push('updateManifestUrl must be an https URL');
  }
  if (
    typeof options.packageVersion === 'string'
    && options.packageVersion.length > 0
    && value.version !== options.packageVersion
  ) {
    errors.push(
      `skill-release.json version "${value.version}" must match package.json version "${options.packageVersion}"`,
    );
  }
  return errors;
}
