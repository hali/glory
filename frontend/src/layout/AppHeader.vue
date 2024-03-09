<template>
  <header class="header-global">
    <base-nav
      v-if="authState && authState.isAuthenticated"
      class="navbar-main"
      type="default"
      effect="dark"
      expand
    >
      <router-link
        slot="brand"
        class="navbar-brand mr-lg-5"
        to="/"
      >
        <i class="ni ni-trophy" /> Glory
      </router-link>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-left">   
        <li class="nav-item">
          <router-link
            to="/faq"
            class="nav-link"
            @click="closeMenu"
          >
            {{ $t('faq') }}
          </router-link>
        </li>      
        <li class="nav-item">
          <router-link
            to="/newepisode"
            class="nav-link"
            @click="closeMenu"
          >
            {{ $t('createStoryMenu') }}
          </router-link>
        </li> 
        <li class="nav-item">
          <router-link
            to="/episodes"
            class="nav-link"
          >
            {{ $t('stories') }}
          </router-link>
        </li>    
        <li class="nav-item">
          <router-link
            to="/characters"
            class="nav-link"
          >
            {{ $t('characters') }}
          </router-link>
        </li>         
        <li class="nav-item">
          <router-link
            to="/player"
            class="nav-link"
          >
            {{ $t('playerHub') }}
          </router-link>
        </li>  
        <li class="nav-item">
          <div
            class="nav-link"
            @click="logout"
          >
            {{ $t('logout') }}
          </div>
        </li> 
      </ul>
    </base-nav>
    <base-nav
      v-else
      class="navbar-main"
      type="default"
      effect="dark"
      expand
    >
      <router-link
        slot="brand"
        class="navbar-brand mr-lg-5"
        to="/"
      >
        <i class="ni ni-trophy" /> Glory
      </router-link>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-left">
        <li class="nav-item">
          <router-link
            to="/faq"
            class="nav-link"
            @click="closeMenu"
          >
            {{ $t('faq') }}
          </router-link>
        </li>       
        <li class="nav-item">
          <router-link
            to="/episodes"
            class="nav-link"
          >
            {{ $t('stories') }}
          </router-link>
        </li> 
        <li class="nav-item">
          <router-link
            to="/characters"
            class="nav-link"
          >
            {{ $t('characters') }}
          </router-link>
        </li>
        <li class="nav-item">
          <div
            class="nav-link"
            @click="login"
          >
            <i class="fa fa-sign-in" />{{ $t('login') }}
          </div>
        </li>
      </ul>
    </base-nav>
  </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";

export default {
  name: "AppHeader",
  components: {
    BaseNav
  },
  methods: {
    async logout () {
      await this.$auth.signOut()
    },
    async login () {
      await this.$auth.signInWithRedirect({ originalUri: '/' })
    },
    closeMenu() {
    }
  }
};
</script>
<style>
</style>
