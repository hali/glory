# Glory API

Node.js/Express JSON API backed by MySQL. Routes in `app/routes/appRoutes.js`
call controllers, which use SQL models through the `mysql2` pool in
`app/model/db.js`. All models share one pool per backend process; the HTTP
server does not open a separate database connection. Connections are opened
when queries need them and returned to the pool after each query.

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
It must export a `pool` object containing the Cloud SQL `socketPath`, user,
password, database, and pool limits. Leave `socketPath` configured permanently.
An old `connection` block and any `pool.host` value are unused.

Set `DB_HOST` to use TCP/IP instead of the socket. For local development, put
the database IP in `api/.env.local`:

```dotenv
DB_HOST=your-database-ip
```

The pool loads this file regardless of the working directory. An environment
variable already set in the process takes precedence. A non-empty `DB_HOST`
selects TCP and removes the socket option; an unset or blank `DB_HOST` selects
`pool.socketPath`. A missing socket in that case produces a configuration error.

`api/.env.local` is excluded from Git and App Engine uploads. Production uses
the configured socket by default, with no edits before deployment. Keep
`DB_HOST` unset in the deployed environment to use that default. Restart the API
after changing the local IP. Credentials and pool limits still come from
`config.pool`; `DB_USER` and other credential environment variables are not read.

mysql2 handles database authentication with its built-in plugins; no custom
password handler is needed. Pool connections are created lazily, so starting
the HTTP server alone does not verify database connectivity.

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
npm run test:db
```

Tests cover public-route exceptions, protected requests, and middleware ordering
without starting the application server or connecting to MySQL/Auth0. Database
tests cover the shared pool's callback interface and error propagation with a
mocked driver.

Reference: [Auth0 Express API quickstart](https://auth0.com/docs/quickstart/backend/nodejs).
