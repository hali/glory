import { createAuth0 } from "@auth0/auth0-vue";

export const auth0 = createAuth0({
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientId: process.env.VUE_APP_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: process.env.VUE_APP_AUTH0_AUDIENCE,
  },
});

export default auth0;
