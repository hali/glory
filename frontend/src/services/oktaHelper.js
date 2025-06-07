import { OktaAuth } from "@okta/okta-auth-js";
import config from "../config";

// Create the Okta Auth instance
export const oktaAuth = new OktaAuth({
  issuer: config.oidc.issuer,
  clientId: config.oidc.clientId,
  redirectUri: config.oidc.redirectUri,
  scopes: config.oidc.scopes || ["openid", "profile", "email"],
  pkce: true,
  tokenManager: {
    autoRenew: true,
    secure: true,
    storage: "localStorage",
  },
});

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export function isAuthenticated() {
  const authState = oktaAuth.authStateManager.getAuthState();
  return authState && authState.isAuthenticated;
}

/**
 * Get user information from the ID token
 * @returns {object|null} User info if authenticated, null otherwise
 */
export function getUserInfo() {
  const authState = oktaAuth.authStateManager.getAuthState();
  if (!authState || !authState.isAuthenticated) {
    return null;
  }

  return authState.idToken?.claims;
}

/**
 * Login with redirect
 * @param {string} originalUri - URI to redirect back to after login
 * @returns {Promise} Promise that resolves after redirect is triggered
 */
export async function login(originalUri = window.location.pathname) {
  try {
    await oktaAuth.signInWithRedirect({ originalUri });
    return true;
  } catch (error) {
    console.error("Login redirect failed:", error);
    throw error;
  }
}

/**
 * Logout and clear all tokens
 * @returns {Promise} Promise that resolves after logout is complete
 */
export async function logout() {
  try {
    await oktaAuth.signOut();
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

/**
 * Check if a route is public (doesn't require authentication)
 * @param {string} url - URL to check
 * @param {string} method - HTTP method
 * @returns {boolean} True if route is public
 */
export function isPublicRoute(url, method = "GET") {
  // Public routes that don't require authentication
  const publicRoutes = [
    // Only the main episodes listing is public
    { path: "/api/episodes", exact: true, methods: ["GET"] },
    // Only the main characters listing is public
    { path: "/api/characters", exact: true, methods: ["GET"] },
    // Stats endpoint is public
    { path: "/api/stats/episodes", methods: ["GET"] },
    { path: "/api/stats/posts", methods: ["GET"] },
    { path: "/api/stats/characters", methods: ["GET"] },
  ];

  // Check if URL matches any public route
  return publicRoutes.some((route) => {
    // For exact match routes, we need to check if the path matches exactly or has query parameters
    if (route.exact) {
      // Check if it's an exact match or has query parameters
      const isExactMatch = url === route.path;
      const hasQueryParams = url.startsWith(route.path + "?");
      const pathMatches = isExactMatch || hasQueryParams;
      const methodMatches = route.methods.includes(method);
      return pathMatches && methodMatches;
    } else {
      // For non-exact routes, we can use the includes method
      const pathMatches = url.includes(route.path);
      const methodMatches = route.methods.includes(method);
      return pathMatches && methodMatches;
    }
  });
}

/**
 * Add authentication header to fetch options
 * @param {object} options - Fetch options
 * @param {boolean} forceRefresh - Whether to force token refresh
 * @param {string} url - URL for logging purposes
 * @returns {object} Updated fetch options with auth header
 */
export function addAuthHeader(options = {}, forceRefresh = false, url = "") {
  let accessToken = oktaAuth.getAccessToken();

  // If token refresh is forced and we're about to expire, try to refresh
  if (forceRefresh && isTokenExpiringSoon()) {
    try {
      // Try to get a fresh token synchronously first
      oktaAuth.tokenManager.renew("accessToken");
      accessToken = oktaAuth.getAccessToken();
    } catch (error) {
      console.warn("Failed to refresh token synchronously:", error);
      // Continue with current token
    }
  }

  if (!accessToken) {
    console.warn(`No access token available for ${url}`);
    return options;
  }

  // Initialize headers if not present
  if (!options.headers) {
    options.headers = {};
  }

  // Add Authorization header with Bearer token
  options.headers["Authorization"] = `Bearer ${accessToken}`;
  return options;
}

/**
 * Check if token is about to expire
 * @param {number} expiryThreshold - Threshold in seconds
 * @returns {boolean} True if token will expire soon
 */
export function isTokenExpiringSoon(expiryThreshold = 300) {
  const tokenExpiration =
    oktaAuth.tokenManager.getTokensSync()?.accessToken?.expiresAt;

  if (!tokenExpiration) {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = tokenExpiration - nowInSeconds;

  return timeUntilExpiry < expiryThreshold;
}

/**
 * Refresh the current token
 * @returns {Promise<string|null>} New access token or null
 */
export async function refreshToken() {
  try {
    await oktaAuth.tokenManager.renew("accessToken");
    return oktaAuth.getAccessToken();
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}

// Export everything
export default {
  oktaAuth,
  isAuthenticated,
  login,
  logout,
  getUserInfo,
  isPublicRoute,
  addAuthHeader,
  isTokenExpiringSoon,
  refreshToken,
};
