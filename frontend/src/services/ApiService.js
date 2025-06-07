// Import helpers from oktaHelper.js
import { oktaAuth, isPublicRoute, addAuthHeader } from "./oktaHelper";
import router from "../router";

/**
 * Fetch API with authentication
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @param {boolean} requiresAuth - Whether authentication is required (default: true)
 * @returns {Promise} Fetch promise
 */
export async function apiFetch(url, options = {}, requiresAuth = true) {
  // Initialize headers if not present
  if (!options.headers) {
    options.headers = {};
  }

  // Set content type if not present and method is POST/PUT
  if (
    (options.method === "POST" || options.method === "PUT") &&
    !options.headers["Content-Type"]
  ) {
    options.headers["Content-Type"] = "application/json";
  }

  try {
    // Skip authentication for public routes
    const isPublic = isPublicRoute(url, options.method || "GET");

    // If this is a public route or the homepage, don't require auth
    if (requiresAuth && !isPublic) {
      const authState = oktaAuth.authStateManager.getAuthState();
      if (!authState?.isAuthenticated) {
        console.warn("User not authenticated for API call:", url);

        // Don't throw an error for API calls on the homepage or login routes
        if (
          window.location.pathname === "/" ||
          window.location.pathname.includes("/login")
        ) {
          return { error: "Not authenticated", status: "UNAUTHENTICATED" };
        }

        // For other routes, redirect to homepage silently
        router.push("/");
        throw new Error("Authentication required. Please log in.");
      }

      // Add authentication token to headers
      options = addAuthHeader(options, true, url);
    }

    console.log(`API ${options.method || "GET"} request to: ${url}`);
    const response = await fetch(url, options);

    // Check if response is ok (status in the range 200-299)
    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        console.warn("Authentication failed for API call:", url);

        // Try with a fresh token once
        if (requiresAuth && !isPublic) {
          try {
            // Get a fresh token directly
            const token = oktaAuth.getAccessToken();
            if (token) {
              // Manually add the token to headers
              options.headers = options.headers || {};
              options.headers["Authorization"] = `Bearer ${token}`;

              // Retry the request
              const retryResponse = await fetch(url, options);
              if (retryResponse.ok) {
                return await retryResponse.json();
              }
            }
          } catch (tokenError) {
            console.error("Failed to get fresh token:", tokenError);
          }
        }

        // Don't redirect to login if we're already on the home/login page
        if (
          window.location.pathname === "/" ||
          window.location.pathname.includes("/login")
        ) {
          return { error: "Authentication failed", status: "AUTH_ERROR" };
        }

        // For other routes, redirect to homepage silently without throwing errors
        router.push("/");
        return { error: "Authentication failed", status: "AUTH_ERROR" };
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    // Return empty object for 204 No Content responses
    if (response.status === 204) {
      return {};
    }

    // Parse JSON response
    try {
      return await response.json();
    } catch (parseError) {
      console.warn("Failed to parse JSON response:", parseError);
      return {};
    }
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);

    // Return a structured error instead of throwing for better handling
    if (
      window.location.pathname === "/" ||
      window.location.pathname.includes("/login")
    ) {
      return { error: error.message, status: "ERROR" };
    }
    throw error;
  }
}

/**
 * Helper for GET requests
 * @param {string} url - API endpoint
 * @param {boolean} requiresAuth - Whether authentication is required
 * @returns {Promise} Fetch promise
 */
export function get(url, requiresAuth = true) {
  return apiFetch(url, { method: "GET" }, requiresAuth);
}

/**
 * Helper for POST requests
 * @param {string} url - API endpoint
 * @param {object} data - POST data
 * @param {boolean} requiresAuth - Whether authentication is required
 * @returns {Promise} Fetch promise
 */
export function post(url, data, requiresAuth = true) {
  return apiFetch(
    url,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    requiresAuth
  );
}

/**
 * Helper for PUT requests
 * @param {string} url - API endpoint
 * @param {object} data - PUT data
 * @param {boolean} requiresAuth - Whether authentication is required
 * @returns {Promise} Fetch promise
 */
export function put(url, data, requiresAuth = true) {
  return apiFetch(
    url,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    requiresAuth
  );
}

/**
 * Helper for DELETE requests
 * @param {string} url - API endpoint
 * @param {boolean} requiresAuth - Whether authentication is required
 * @returns {Promise} Fetch promise
 */
export function del(url, requiresAuth = true) {
  return apiFetch(url, { method: "DELETE" }, requiresAuth);
}
