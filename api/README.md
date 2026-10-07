# Glory API

Node.js/Express JSON API backed by MySQL. Routes in `app/routes/appRoutes.js`
call controllers, which use SQL models through the `mysql2` pool in
`app/model/db.js`. Startup also uses the existing `mysql` connection.

## Local development

Run commands from `api/`:

```sh
npm ci
npm start
```

The API listens on `PORT`, defaulting to `3000`. The frontend development server
proxies `/api` requests to it. App Engine deploys the API as the `api` service
using the runtime in `api.yaml` / `app.yaml`.

Database connection details come from the local, git-ignored `api/config.js`.
It must export `connection` and `pool` objects containing the appropriate MySQL
host or socket path, user, password, and database. The application does not
currently read `DB_HOST`, `DB_USER`, or similar database environment variables.

## Auth0 configuration

The backend validates SPA access tokens with `express-oauth2-jwt-bearer`.
It does not run a separate browser login or require an Auth0 client secret.

Optional overrides in `api/.env` (or the deployment environment):

```dotenv
AUTH0_ISSUER_BASE_URL=https://your-tenant.eu.auth0.com/
AUTH0_AUDIENCE=urn:glory:api
```

When omitted, the current defaults are
`https://dev-ivs748afc2zkvi1p.eu.auth0.com/` and `urn:glory:api`.
The frontend's Auth0 domain and audience must match. Restart the API after
changing configuration. Legacy identity-provider settings in a local
`config.js` are unused.

## Access rules

`server.js` mounts `app/middleware/authMiddleware.js` at `/api` **before** the
route handlers. Only GET and HEAD requests to these paths are public:

- `/api/characters`
- `/api/episodes`
- `/api/branches`
- `/api/stats/episodes`
- `/api/stats/characters`
- `/api/stats/posts`

Query parameters and a trailing slash are supported. A detail route such as
`/api/episodes/123`, `/api/latest`, player data, and all writes require a valid
access token:

```http
Authorization: Bearer <Auth0 access token>
```

The JWT middleware checks signature, issuer, audience, and token validity.
Missing or invalid tokens are rejected before controllers access the database.
Client-side route guards are only navigation controls; API authentication is
independent of them.

Authentication does not yet provide complete ownership authorisation. Several
controllers accept player/author IDs from the request rather than deriving them
from the verified identity. Per-record ownership checks and the email-based
Auth0-to-player mapping need a separate review.

## Email notifications

Email notifications and episode subscription endpoints have been removed.
Publishing posts does not call an email provider, and no email-provider
credentials are required. The legacy `subscriptions` table is retained for
historical data; the application no longer reads or writes it.

## Tests

```sh
npm run test:auth
```

Tests cover public-route exceptions, protected requests, and middleware ordering
without starting the application server or connecting to MySQL/Auth0.

Reference: [Auth0 Express API quickstart](https://auth0.com/docs/quickstart/backend/nodejs).
