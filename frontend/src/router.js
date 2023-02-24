import { createRouter, createWebHistory } from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Home from "./views/Home.vue";
import NewEpisode from "./views/NewEpisode.vue";
import ViewEpisode from "./views/ViewEpisode.vue";
import EditEpisode from "./views/EditEpisode.vue";
import EditPost from "./views/EditPost.vue";
import ListEpisodes from "./views/ListEpisodes.vue";
import { LoginCallback, navigationGuard } from '@okta/okta-vue';
import PlayerHub from './views/PlayerHub';
import OtherPlayer from './views/OtherPlayer';
import Profile from './views/Profile';
import CharacterView from './views/CharacterView';
import ListCharacters from './views/ListCharacters';
import MyFeedback from './views/MyFeedback';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        default: Home,
        footer: AppFooter,
        header: AppHeader
      }
    },
    {
      path: "/newepisode",
      name: "newepisode",
      components: {
        header: AppHeader,
        default: NewEpisode,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/episode/:id",
      name: "viewepisode",
      components: {
        header: AppHeader,
        default: ViewEpisode,
        footer: AppFooter
      },
      props: {
        header: false,
        default: true,
        footer: false
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/editepisode/:id",
      name: "editepisode",
      components: {
        header: AppHeader,
        default: EditEpisode,
        footer: AppFooter
      },
      props: {
        header: false,
        default: true,
        footer: false
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/post/:id",
      name: "editpost",
      components: {
        header: AppHeader,
        default: EditPost,
        footer: AppFooter
      },
      props: {
        header: false,
        default: true,
        footer: false
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/episodes",
      name: "episodes",
      components: {
        header: AppHeader,
        default: ListEpisodes,
        footer: AppFooter
      }
    },
    {
      path: "/characters",
      name: "characters",
      components: {
        header: AppHeader,
        default: ListCharacters,
        footer: AppFooter
      }
    },
    {
      path: "/character/:id",
      name: "viewcharacter",
      components: {
        header: AppHeader,
        default: CharacterView,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login/callback',
      component: LoginCallback
    },
    {
      path: '/player',
      components: {
        header: AppHeader,
        default: PlayerHub,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      components: {
        header: AppHeader,
        default: Profile,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/myfeedback',
      components: {
        header: AppHeader,
        default: MyFeedback,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/viewotherplayer/:id",
      name: "viewotherplayer",
      components: {
        header: AppHeader,
        default: OtherPlayer,
        footer: AppFooter
      },
      props: {
        header: false,
        default: true,
        footer: false
      }
    }
  ]
})

router.beforeEach(navigationGuard);

export default router;
