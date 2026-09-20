/** Shared skill-release and naming constants. */

export const SKILL_RELEASE_KEYS = Object.freeze([
  'schemaVersion',
  'skillId',
  'channel',
  'version',
  'source',
  'updateManifestUrl',
]);

export const SKILL_RELEASE_SCHEMA_VERSION = 1;

export const CHANNEL_STABLE = 'stable';
export const CHANNEL_DEVELOPMENT = 'development';

export const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SKILL_NAME_MAX_LENGTH = 64;
export const SKILL_DESCRIPTION_MAX_LENGTH = 1024;

export const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export const HTTPS_URL_PATTERN = /^https:\/\/[^\s]+$/i;

/** Directory/file names that must not ship inside a skill package. */
export const FORBIDDEN_PACKAGE_NAMES = Object.freeze([
  'node_modules',
  'test',
  'tests',
  'fixtures',
  '.env',
  'package-lock.json',
]);

/** Absolute path prefixes that must not appear in packaged text files. */
export const ABSOLUTE_PATH_LEAK_PATTERN = /(?:^|[\s"'`(])(\/(?:Users|home|Volumes|tmp)\/[^\s"'`)]+)/;
