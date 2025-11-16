const { auth } = require("express-oauth2-jwt-bearer");

const jwtCheck = auth({
  audience: "urn:glory:api",
  issuerBaseURL: "https://dev-ivs748afc2zkvi1p.eu.auth0.com/",
});

module.exports = jwtCheck;
