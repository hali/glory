<template>
  <div class="auth-status">
    <div v-if="authState?.isAuthenticated" class="authenticated">
      <div class="status-badge authenticated">Authenticated</div>
      <div class="user-info">
        <div><strong>User:</strong> {{ authState.idToken?.claims?.name || authState.idToken?.claims?.email }}</div>
        <div><strong>Token expires:</strong> {{ formatTime(authState.accessToken?.expiresAt) }}</div>
      </div>
      <div class="token-info">
        <button @click="toggleToken" class="btn btn-sm btn-primary">
          {{ showToken ? 'Hide Token' : 'Show Token' }}
        </button>
        <div v-if="showToken" class="token-display">
          <div class="token-header">Access Token:</div>
          <div class="token-value">{{ accessToken }}</div>
        </div>
      </div>
    </div>
    <div v-else class="unauthenticated">
      <div class="status-badge unauthenticated">Not Authenticated</div>
      <button @click="login" class="btn btn-sm btn-primary">Login</button>
    </div>
  </div>
</template>

<script>
import { oktaAuth } from "../services/oktaHelper";

export default {
  name: 'AuthStatus',
  data() {
    return {
      authState: null,
      showToken: false,
      authStateHandler: null
    };
  },
  computed: {
    accessToken() {
      return this.authState?.isAuthenticated 
        ? oktaAuth.getAccessToken() 
        : 'No access token available';
    }
  },
  methods: {
    updateAuthState() {
      this.authState = oktaAuth.authStateManager.getAuthState();
    },
    toggleToken() {
      this.showToken = !this.showToken;
    },
    login() {
      oktaAuth.signInWithRedirect();
    },
    formatTime(timestamp) {
      if (!timestamp) return 'N/A';
      
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString();
    }
  },
  mounted() {
    this.updateAuthState();
    
    // Subscribe to auth state changes
    this.authStateHandler = oktaAuth.authStateManager.subscribe(() => this.updateAuthState());
  },
  beforeUnmount() {
    // Unsubscribe to prevent memory leaks
    if (this.authStateHandler) {
      this.authStateHandler.unsubscribe();
    }
  }
};
</script>

<style scoped>
.auth-status {
  margin: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f5f5f5;
  font-family: sans-serif;
}

.status-badge {
  display: inline-block;
  padding: 0.25em 0.6em;
  border-radius: 10rem;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.status-badge.authenticated {
  background-color: #28a745;
  color: white;
}

.status-badge.unauthenticated {
  background-color: #dc3545;
  color: white;
}

.user-info, .token-info {
  margin-top: 0.5rem;
}

.token-display {
  margin-top: 0.5rem;
  background-color: #343a40;
  color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 0.25rem;
  overflow-x: auto;
}

.token-header {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.token-value {
  font-family: monospace;
  word-break: break-all;
  font-size: 0.8rem;
}
</style>