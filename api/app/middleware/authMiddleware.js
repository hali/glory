require("dotenv").config();
const { auth } = require("express-oauth2-jwt-bearer");

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE || "urn:glory:api",
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || "https://dev-ivs748afc2zkvi1p.eu.auth0.com/",
});

// Paths are relative to the /api mount. Only these read-only endpoints are public.
const publicPaths = new Set([
  "/characters",
  "/episodes",
  "/branches",
  "/stats/episodes",
  "/stats/characters",
  "/stats/posts",
]);

module.exports = function requireApiAuth(req, res, next) {
  const path = req.path.replace(/\/$/, "");
  if ((req.method === "GET" || req.method === "HEAD") && publicPaths.has(path)) {
    return next();
  }
  return jwtCheck(req, res, next);
};
