import Vue from "vue";
import Router from "vue-router";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Home from "./views/Home.vue";
import NewEpisode from "./views/NewEpisode.vue";
import ViewEpisode from "./views/ViewEpisode.vue";
import ListEpisodes from "./views/ListEpisodes.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        default: Home,
        footer: Footer,
        header: Header
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: Header,
        default: Login,
        footer: Footer,
      }
    },
    {
      path: "/register",
      name: "register",
      components: {
        header: Header,
        default: Register,
        footer: Footer,
      }
    },
    {
      path: "/newepisode",
      name: "newepisode",
      components: {
        header: Header,
        default: NewEpisode,
        footer: Footer
      }
    },
    {
      path: "/viewepisode/:id",
      name: "viewepisode",
      components: {
        header: Header,
        default: ViewEpisode,
        footer: Footer
      },
      props: {
        header: false,
        default: true,
        footer: false
      }
    },
    {
      path: "/viewotherplayer/:id",
      name: "viewotherplayer",
      components: {
        header: Header,
        default: ViewEpisode,
        footer: Footer
      },
      props: {
        header: false,
        default: true,
        footer: false
      }
    },
    {
      path: "/episodes",
      name: "episodes",
      components: {
        header: Header,
        default: ListEpisodes,
        footer: Footer
      }
    }
  ]
});
