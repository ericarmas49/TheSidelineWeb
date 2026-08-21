/**
 * Resolve X API bearer token from environment.
 */
export function getXBearerToken() {
  const raw = process.env.EXPO_PUBLIC_X_BEARER_TOKEN || process.env.X_BEARER_TOKEN || "";
  if (!raw) return "";

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
