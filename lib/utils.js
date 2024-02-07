// Reuse the same regex across all calls
const hasTrailingSlash = /\/$/;

export function addTrailingSlash(str) {
  return hasTrailingSlash.test(str) ? str : `${str}/`;
}
