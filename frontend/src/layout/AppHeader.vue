<template>
  <header class="header-global">
    <!-- Authentication Status Component (only visible in development) -->
    <base-nav
      v-if="isAuthenticated"
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
          <div class="nav-link" @click="logout()">
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
          <div class="nav-link" @click="loginWithRedirect()">
            <i class="fa fa-sign-in" />{{ $t("login") }}
          </div>
        </li>
      </ul>
    </base-nav>
  </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import { useAuth0 } from "@auth0/auth0-vue";

export default {
  name: "AppHeader",
  components: {
    BaseNav,
  },
  setup() {
    const { isAuthenticated } = useAuth0();

    // Expose to template and methods
    return {
      isAuthenticated,
    };
  },
  data() {
    return {
      isDevelopment: process.env.NODE_ENV === "development",
    };
  },
  methods: {
    closeMenu() {
      // No-op
    },
    loginWithRedirect() {
      // get the function inside method to have proper context
      const { loginWithRedirect } = useAuth0();
      loginWithRedirect();
    },
    logout() {
      const { logout } = useAuth0();
      logout({ logoutParams: { returnTo: window.location.origin } });
    },
  },
};
</script>
<style></style>
