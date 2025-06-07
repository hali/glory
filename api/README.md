# Glory API

This is the backend API for the Glory application. It provides endpoints for managing characters, episodes, posts, players, and more.

## Authentication

The API now uses Okta authentication to protect routes. Only authenticated users can access most endpoints, with the following exceptions:

- `GET /api/characters` - Public access
- `GET /api/episodes` - Public access
- `GET /api/stats/*` - Public access for all stats endpoints

### How to Authenticate Requests

To access protected endpoints, you need to include an Okta access token in your requests:

```js
// Example with fetch
fetch('/api/episodes/123', {
  headers: {
    'Authorization': 'Bearer ' + accessToken
  }
})
```

### Getting the Access Token

In your frontend Vue application, you can get the current access token using the Okta Vue SDK:

```js
// Using the Composition API
import { useOktaAuth } from '@okta/okta-vue';

export default {
  setup() {
    const { oktaAuth } = useOktaAuth();
    
    async function makeAuthenticatedRequest() {
      const accessToken = oktaAuth.getAccessToken();
      // Make your API request with the token
    }
    
    return { makeAuthenticatedRequest };
  }
}

// Using the Options API
export default {
  async created() {
    const accessToken = this.$auth.getAccessToken();
    // Make your API request with the token
  }
}
```

## Running the API Locally

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. The API will be available at http://localhost:3000

## Deployment

The API is configured to run on Google Cloud Platform using Node.js 22.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Okta Configuration
OKTA_ISSUER=https://your-okta-domain.okta.com/oauth2/default
OKTA_CLIENT_ID=your_client_id
```
