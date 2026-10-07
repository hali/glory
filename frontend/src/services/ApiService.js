// src/services/ApiService.js
import router from "../router";
import { auth0 } from "../plugins/auth0";

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
    // If authentication is required, get access token from Auth0
    if (requiresAuth) {
      let token;
      try {
        token = await auth0.getAccessTokenSilently();
      } catch (e) {
        // Not logged in
        router.push("/");
        throw new Error("Authentication required. Please log in.");
      }

      if (!token) {
        router.push("/");
        throw new Error("Authentication required. Please log in.");
      }

      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - maybe token expired
        router.push("/");
        return { error: "Authentication failed", status: "AUTH_ERROR" };
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    if (response.status === 204) {
      return {};
    }

    try {
      return await response.json();
    } catch (parseError) {
      return {};
    }
  } catch (error) {
    if (
      window.location.pathname === "/" ||
      window.location.pathname.includes("/login")
    ) {
      return { error: error.message, status: "ERROR" };
    }
    throw error;
  }
}

// HTTP helpers use authenticated requests unless explicitly marked public.
export function get(url, requiresAuth = true) {
  return apiFetch(url, { method: "GET" }, requiresAuth);
}
export function post(url, data, requiresAuth = true) {
  return apiFetch(
    url,
    { method: "POST", body: JSON.stringify(data) },
    requiresAuth
  );
}
export function put(url, data, requiresAuth = true) {
  return apiFetch(
    url,
    { method: "PUT", body: JSON.stringify(data) },
    requiresAuth
  );
}
export function del(url, requiresAuth = true) {
  return apiFetch(url, { method: "DELETE" }, requiresAuth);
}
