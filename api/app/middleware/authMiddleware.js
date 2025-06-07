"use strict";

const OktaJwtVerifier = require("@okta/jwt-verifier");
const config = require("../../config");

// Check if Okta config is available
if (!config.okta || !config.okta.issuer || !config.okta.clientId) {
  console.error(
    "Okta configuration is missing or incomplete. Authentication will not work properly.",
  );
}

// Create a JWT verifier with Okta configuration
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: config.okta?.issuer || "https://missing-issuer-url",
  clientId: config.okta?.clientId || "missing-client-id",
});

// Public routes that don't need authentication
const publicRoutes = [
  { path: "/api/characters", method: "GET" },
  { path: "/api/episodes", method: "GET" },
  { path: "/api/stats/", method: "GET" }, // Will match all routes that start with /api/stats/
  { path: "/api/branches", method: "GET" },
];

// Check if a route is public
function isPublicRoute(path, method) {
  for (const route of publicRoutes) {
    if (
      method === route.method &&
      (path === route.path ||
        (route.path.endsWith("/") && path.startsWith(route.path)))
    ) {
      return true;
    }
  }
  return false;
}

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  // Skip authentication for public routes
  if (isPublicRoute(req.path, req.method)) {
    return next();
  }

  // Skip authentication if Okta is not configured
  if (!config.okta || !config.okta.issuer || !config.okta.clientId) {
    console.warn("Skipping authentication due to missing Okta configuration");
    return next();
  }

  try {
    // Get the access token from the Authorization header
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const accessToken = match[1];

    // Verify the token with Okta
    const jwt = await oktaJwtVerifier.verifyAccessToken(
      accessToken,
      config.okta.audience || "api://default",
    );

    // Add the JWT claims to the request object for later use
    req.jwt = jwt.claims;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
