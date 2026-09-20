import {
  CHANNEL_DEVELOPMENT,
  CHANNEL_STABLE,
  SEMVER_PATTERN,
} from './constants.mjs';

/**
 * Parse a SemVer string into core / prerelease / build parts.
 * @param {string} value
 * @returns {{ core: string[], prerelease: string[] | null, build: string[] | null }}
 */
export function parseSemver(value) {
  if (typeof value !== 'string' || value.length > 128) {
    throw new Error(`invalid SemVer: ${JSON.stringify(value)}`);
  }
  const match = SEMVER_PATTERN.exec(value);
  if (!match) throw new Error(`invalid SemVer: ${JSON.stringify(value)}`);
  const prerelease = match[4]?.split('.') ?? null;
  if (prerelease?.some((identifier) => /^\d+$/.test(identifier)
    && identifier.length > 1 && identifier.startsWith('0'))) {
    throw new Error(`invalid SemVer: ${JSON.stringify(value)}`);
  }
  return {
    core: match.slice(1, 4),
    prerelease,
    build: match[5]?.split('.') ?? null,
  };
}

/**
 * Map version prerelease presence to release channel.
 * @param {string} version
 * @returns {'stable' | 'development'}
 */
export function releaseChannelForVersion(version) {
  return parseSemver(version).prerelease ? CHANNEL_DEVELOPMENT : CHANNEL_STABLE;
}
