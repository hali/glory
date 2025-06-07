<template>
  <header class="header-global">
    <!-- Authentication Status Component (only visible in development) -->
    <AuthStatus v-if="false" />
    <base-nav
      v-if="authState && authState.isAuthenticated"
      class="navbar-main"
      type="default"
      effect="dark"
      expand
    >
      <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
        <i class="ni ni-trophy" /> Glory
      </router-link>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-left">
        <li class="nav-item">
          <router-link to="/faq" class="nav-link" @click="closeMenu">
            {{ $t("faq") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/newepisode" class="nav-link" @click="closeMenu">
            {{ $t("createStoryMenu") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/episodes" class="nav-link">
            {{ $t("stories") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/characters" class="nav-link">
            {{ $t("characters") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/player" class="nav-link">
            {{ $t("playerHub") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/looking" class="nav-link">
            {{ $t("looking") }}
          </router-link>
        </li>
        <li class="nav-item">
          <div class="nav-link" @click="logout">
            {{ $t("logout") }}
          </div>
        </li>
      </ul>
    </base-nav>
    <base-nav v-else class="navbar-main" type="default" effect="dark" expand>
      <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
        <i class="ni ni-trophy" /> Glory
      </router-link>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-left">
        <li class="nav-item">
          <router-link to="/faq" class="nav-link" @click="closeMenu">
            {{ $t("faq") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/episodes" class="nav-link">
            {{ $t("stories") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/characters" class="nav-link">
            {{ $t("characters") }}
          </router-link>
        </li>
        <li class="nav-item">
          <div class="nav-link" @click="login">
            <i class="fa fa-sign-in" />{{ $t("login") }}
          </div>
        </li>
      </ul>
    </base-nav>
  </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import AuthStatus from "@/components/AuthStatus";
import { oktaAuth, login, logout } from "../services/oktaHelper";

export default {
  name: "AppHeader",
  components: {
    BaseNav,
    AuthStatus,
  },
  data() {
    return {
      authState: null,
      isDevelopment: process.env.NODE_ENV === "development",
      authStateHandler: null,
    };
  },
  methods: {
    updateAuthState() {
      try {
        this.authState = oktaAuth.authStateManager.getAuthState();
      } catch (error) {
        console.error("Error getting auth state:", error);
        this.authState = null;
      }
    },
    async logout() {
      try {
        await logout();
      } catch (error) {
        console.error("Error during logout:", error);
        // Force page reload to clear state
        window.location.href = "/";
      }
    },
    async login() {
      try {
        await login("/");
      } catch (error) {
        console.error("Error during login:", error);
        // Try alternative method
        window.location.href = "/";
      }
    },
    closeMenu() {
      // No-op
    },
  },
  mounted() {
    try {
      this.updateAuthState();
      this.authStateHandler = oktaAuth.authStateManager.subscribe(() =>
        this.updateAuthState()
      );
    } catch (error) {
      console.error("Error setting up auth in AppHeader:", error);
      // Set null auth state to ensure login button is shown
      this.authState = null;
    }
  },
  beforeUnmount() {
    if (this.authStateHandler) {
      this.authStateHandler.unsubscribe();
    }
  },
};
</script>
<style></style>
