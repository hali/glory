# Glory frontend

Vue 3 single-page application using the Vue 2 compatibility build, Vue Router,
Vue CLI, and Auth0. Google App Engine serves the production build and routes
`/api/*` to the backend service.

## Local development

Run commands from `frontend/`:

```sh
npm ci
npm run serve
```

Create `frontend/.env` with the Auth0 Single Page Application settings:

```dotenv
VUE_APP_AUTH0_DOMAIN=your-tenant.eu.auth0.com
VUE_APP_AUTH0_CLIENT_ID=your-spa-client-id
VUE_APP_AUTH0_AUDIENCE=urn:glory:api
```

These settings are embedded at build time. Restart the development server after
changing them; rebuild before deploying configuration changes. No client secret
belongs in the frontend.

The development server proxies `/api` to `http://localhost:3000` through
`vue.config.js`. Start the API separately in `api/`.

## Auth0 dashboard configuration

Use the **Single Page Application** whose client ID matches
`VUE_APP_AUTH0_CLIENT_ID`. In its settings, register each origin you actually use
in **Allowed Callback URLs**, **Allowed Logout URLs**, and **Allowed Web Origins**.
For example, local development typically uses `http://localhost:8080`; production
uses `https://ageofglory.org` and `https://www.ageofglory.org` if both are served.
The callback and logout destination are the current `window.location.origin`.
There is no separate `/login/callback` route.

The audience is the Auth0 API identifier, not the SPA client ID. It must match
the backend's configured audience and tenant.

## Authentication flow

- `src/plugins/auth0.js` creates the shared Auth0 Vue SDK instance.
- `src/main.js` installs the router before Auth0 so login callbacks can restore
  the requested route, including its query and hash.
- Components use `useAuth0()` for reactive `isLoading`, `isAuthenticated`, and
  `user` values, plus `loginWithRedirect()` and `logout()`.
- Private routes use the SDK's `authGuard` as `beforeEnter`. It waits for session
  initialisation before allowing the page to mount or redirecting to login.
- The home page and navigation wait for initialisation before displaying a
  signed-in or signed-out state. Home loads updates when authentication is ready.
- `/profile` displays Auth0 user claims. Application player records remain in
  MySQL and are looked up by email; they are separate from Auth0 identities.

## API requests

Domain services call the helpers in `src/services/ApiService.js`:

```js
import { get, post } from './services/ApiService';

const episode = await get('/api/episodes/123');
const publicEpisodes = await get('/api/episodes?status=0&branch=0', false);
await post('/api/episodes/123/close', {});
```

Authenticated requests obtain an access token with `getAccessTokenSilently()`
and send `Authorization: Bearer <token>`. Public requests explicitly pass `false`.
The SDK manages token acquisition; the application does not implement its own
refresh/retry loop.

Token acquisition failures and HTTP 401 responses navigate to `/`. Some failures
are returned as error objects, especially on the homepage; callers must not treat
these as successful data. Home displays an error with a retry button.

Public API reads are characters, episodes, branches, and the three statistics
endpoints. Detailed records and writes require authentication on the backend.

## Validation and production build

```sh
npm run test:auth
npm run build
```

Authentication tests use Node's test runner (Node 22), the installed Vue runtime,
and mocked services; they do not contact Auth0 or the database. The build is
written to `dist/`. Production registers a service worker, so verify that the
browser has received the current build when testing a deployment.

`npm run lint` applies fixes; use the ESLint CLI without `--fix` for a read-only check.

Reference: [Auth0 Vue quickstart](https://auth0.com/docs/quickstart/spa/vuejs).
