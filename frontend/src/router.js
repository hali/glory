import { createRouter, createWebHistory } from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Home from "./views/Home.vue";
import NewEpisode from "./views/NewEpisode.vue";
import ViewEpisode from "./views/ViewEpisode.vue";
import EditEpisode from "./views/EditEpisode.vue";
import EditPost from "./views/EditPost.vue";
import ListEpisodes from "./views/ListEpisodes.vue";
import PlayerHub from "./views/PlayerHub";
import OtherPlayer from "./views/OtherPlayer";
import Profile from "./views/Profile";
import CharacterView from "./views/CharacterView";
import ListCharacters from "./views/ListCharacters";
import FAQPage from "./views/FAQ";
import LookingForYou from "./views/LookingForYou";
import { authGuard } from "@auth0/auth0-vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        default: Home,
        footer: AppFooter,
        header: AppHeader,
      },
    },
    {
      path: "/faq",
      name: "faq",
      components: {
        default: FAQPage,
        footer: AppFooter,
        header: AppHeader,
      },
    },
    {
      path: "/newepisode",
      name: "newepisode",
      components: {
        header: AppHeader,
        default: NewEpisode,
        footer: AppFooter,
      },
      beforeEnter: authGuard,
    },
    {
      path: "/episode/:id",
      name: "viewepisode",
      components: {
        header: AppHeader,
        default: ViewEpisode,
        footer: AppFooter,
      },
      beforeEnter: authGuard,
      props: {
        header: false,
        default: true,
        footer: false,
      },
    },
    {
      path: "/editepisode/:id",
      name: "editepisode",
      components: {
        header: AppHeader,
        default: EditEpisode,
        footer: AppFooter,
      },
      beforeEnter: authGuard,
      props: {
        header: false,
        default: true,
        footer: false,
      },
    },
    {
      path: "/post/:id",
      name: "editpost",
      components: {
        header: AppHeader,
        default: EditPost,
        footer: AppFooter,
      },
      beforeEnter: authGuard,
      props: {
        header: false,
        default: true,
        footer: false,
      },
    },
    {
      path: "/episodes",
      name: "episodes",
      components: {
        header: AppHeader,
        default: ListEpisodes,
        footer: AppFooter,
      },
    },
    {
      path: "/characters",
      name: "characters",
      components: {
        header: AppHeader,
        default: ListCharacters,
        footer: AppFooter,
      },
    },
    {
      path: "/character/:id",
      name: "viewcharacter",
      components: {
        header: AppHeader,
        default: CharacterView,
        footer: AppFooter,
      },
      beforeEnter: authGuard,
    },
    {
      path: "/player",
      components: {
        header: AppHeader,
        default: PlayerHub,
        footer: AppFooter,
      },
      beforeEnter: authGuard,
    },
    {
      path: "/profile",
      components: {
        header: AppHeader,
        default: Profile,
        footer: AppFooter,
      },
      beforeEnter: authGuard,
    },
    {
      path: "/viewotherplayer/:id",
      name: "viewotherplayer",
      components: {
        header: AppHeader,
        default: OtherPlayer,
        footer: AppFooter,
      },
      beforeEnter: authGuard,
      props: {
        header: false,
        default: true,
        footer: false,
      },
    },
    {
      path: "/looking",
      name: "looking",
      components: {
        header: AppHeader,
        default: LookingForYou,
        footer: AppFooter,
      },
      beforeEnter: authGuard,
    },
  ],
});

export default router;
