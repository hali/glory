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
            F.A.Q./Правила
          </router-link>
        </li>      
        <li class="nav-item">
          <router-link
            to="/newepisode"
            class="nav-link"
            @click="closeMenu"
          >
            Открыть эпизод
          </router-link>
        </li> 
        <li class="nav-item">
          <router-link
            to="/episodes"
            class="nav-link"
          >
            Эпизоды
          </router-link>
        </li>    
        <li class="nav-item">
          <router-link
            to="/characters"
            class="nav-link"
          >
            Персонажи
          </router-link>
        </li>         
        <li class="nav-item">
          <router-link
            to="/player"
            class="nav-link"
          >
            Игрок
          </router-link>
        </li>  
        <li class="nav-item">
          <router-link
            to="/myfeedback"
            class="nav-link"
          >
            Фидбек
          </router-link>
        </li>
        <li class="nav-item">
          <div
            class="nav-link"
            @click="logout"
          >
            Выйти
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
            F.A.Q./Правила
          </router-link>
        </li>       
        <li class="nav-item">
          <router-link
            to="/episodes"
            class="nav-link"
          >
            Эпизоды
          </router-link>
        </li> 
        <li class="nav-item">
          <router-link
            to="/characters"
            class="nav-link"
          >
            Персонажи
          </router-link>
        </li>
        <li class="nav-item">
          <div
            class="nav-link"
            @click="login"
          >
            <i class="fa fa-sign-in" />Войти
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
