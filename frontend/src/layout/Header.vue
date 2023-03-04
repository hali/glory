<template>
    <header class="header-global">
        <base-nav v-if='!(authState && authState.isAuthenticated)'  class="navbar-main" type="default" effect="dark"  expand>
            <router-link slot="brand"  class="navbar-brand mr-lg-5" to="/">
               <i class="ni ni-trophy" /> Glory
            </router-link>

            <ul class="navbar-nav navbar-nav-hover align-items-lg-left">       
                <li class="nav-item">
                    <router-link to="/newepisode" class="nav-link">Открыть эпизод</router-link>
                </li>         
                <base-dropdown tag="li" class="nav-item">
                    <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button">
                        <i class="ni ni-collection d-lg-none"></i>
                        <span class="nav-link-inner--text">Эпизоды</span>
                    </a>
                    <router-link to="/episodes" class="dropdown-item">Мои эпизоды</router-link>
                    <router-link to="/episodes" class="dropdown-item">Избранное</router-link>
                    <router-link to="/episodes" class="dropdown-item">Свежие</router-link>
                    <router-link to="/episodes" class="dropdown-item">Завершенные</router-link>
                </base-dropdown>
                <li class="nav-item">
                    <a class="nav-link" href="" >
                    Правила
                    </a>
                </li>  
                <li class="nav-item">
                    <a class="nav-link" href="" >
                    Персонажи
                    </a>
                </li>  
                <li class="nav-item">
                    <a class="nav-link" href="" >
                    Манифест
                    </a>
                </li> 
                <base-dropdown class="nav-item">
                    <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button">
                        <i class="ni ni-circle-08"></i>
                        <span class="nav-link-inner--text"></span>
                    </a>
                    <router-link to="/landing" class="dropdown-item">Мой профиль</router-link>
                    <router-link to="/profile" class="dropdown-item">Мои персонажи</router-link>
                    <router-link to="/" class="dropdown-item">Выйти</router-link>
                </base-dropdown>
            </ul>
        </base-nav>
        <base-nav v-if="authState && authState.isAuthenticated" class="navbar-main" type="default" effect="dark"  expand>
            <router-link slot="brand"  class="navbar-brand mr-lg-5" to="/">
               <i class="ni ni-trophy" /> Glory
            </router-link>

            <ul class="navbar-nav navbar-nav-hover align-items-lg-left">       
                <li class="nav-item">
                    <a class="nav-link" href="" >
                    Правила
                    </a>
                </li>  
                <li class="nav-item">
                    <a class="nav-link" href="" >
                    Персонажи
                    </a>
                </li>  
                <li class="nav-item">
                    <a class="nav-link" href="" >
                    Манифест
                    </a>
                </li> 
                <li class="nav-item">
                	<router-link to="/login" class="nav-item nav-link"><i class="fa fa-sign-in"></i>Войти</router-link>
                </li>
            </ul>
        </base-nav>
    </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import BaseButton from "@/components/BaseButton";

export default {
  components: {
    BaseNav,
    BaseButton,
    BaseDropdown
  },
  props: ['auth']
};
</script>
<style>
</style>
