# Glory Frontend

This is the frontend application for the Glory project, built with Vue.js and the Okta authentication system.

## Authentication

The application uses Okta for authentication and secures API requests automatically. The authentication flow works as follows:

1. Users log in through Okta using the standard Okta login flow
2. API calls automatically include the Okta access token in the Authorization header
3. The backend API validates the token for protected routes
4. Public routes (GET /api/characters, GET /api/episodes, GET /api/stats/*) remain accessible without authentication

### Debugging Authentication

When in development mode, an `AuthStatus` component is available that shows:
- Current authentication status
- User information
- Token expiration time
- Option to view the raw token

## API Service Usage

All API calls should use the ApiService utilities for consistent authentication handling:

```js
// Import the appropriate methods from ApiService
import { get, post, put, del } from './services/ApiService';

// GET request with authentication
const data = await get('/api/protected-endpoint');

// GET request without authentication (for public endpoints)
const publicData = await get('/api/public-endpoint', false);

// POST request with authentication
const result = await post('/api/resource', payload);
```

### Error Handling

The ApiService includes built-in error handling for authentication issues:

- Automatically refreshes tokens when they're about to expire
- Redirects to login page if authentication fails
- Retries requests with refreshed tokens when appropriate
- Properly handles different API response types

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your Okta configuration:
   ```
   VUE_APP_OKTA_CLIENT_ID=your_client_id
   VUE_APP_OKTA_ISSUER=https://your-okta-domain.okta.com/oauth2/default
   VUE_APP_OKTA_REDIRECT_URI=http://localhost:8080/login/callback
   ```

3. Start the development server:
   ```bash
   npm run serve
   ```

## Authentication Configuration

The Okta configuration is stored in `src/config.js`. The default settings are:

```js
export default {
  oidc: {
    clientId: '0oa8dzbw44Xx2rqaK5d7',
    issuer: 'https://dev-99882869.okta.com/oauth2/default',
    redirectUri: window.location.origin + '/login/callback',
    scopes: ['openid', 'profile', 'email']
  }
}
```

The application uses a centralized Okta authentication management approach:

- `oktaHelper.js` provides a singleton Okta instance across the application
- Automatically manages token refresh and authentication state
- Exposes helper methods for authentication-related operations

## Protected Routes

Routes that require authentication are marked with `meta: { requiresAuth: true }` in the router configuration.

## Handling Authentication Errors

The system automatically handles most authentication errors, including:

1. Detecting when a user is not logged in and redirecting to login
2. Refreshing expired tokens automatically
3. Retrying failed requests with refreshed tokens
4. Showing appropriate error messages

### Manual Authentication Helpers

For custom authentication handling, you can use the helper methods from `oktaHelper.js`:

```js
import { isAuthenticated, login, logout, getUserInfo } from './services/oktaHelper';

// Check if user is authenticated
if (!isAuthenticated()) {
  // Handle unauthenticated state
}

// Get user information
const userInfo = getUserInfo();
if (userInfo) {
  console.log(`Logged in as: ${userInfo.name}`);
}

// Manual login/logout
login('/redirect-after-login');
logout();
```

## Building for Production

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.