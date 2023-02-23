/*!

=========================================================
* Vue Argon Design System - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system/blob/master/LICENSE.md)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { createApp } from 'vue';
import App from "./App.vue";
import VueLazyLoad from 'vue3-lazyload';
import router from "./router";
import Argon from "./plugins/argon-kit";
import './registerServiceWorker';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaVue from '@okta/okta-vue';
import sampleConfig from './config';
const oktaAuth = new OktaAuth(sampleConfig.oidc)

createApp(App)
  .use(OktaVue, { oktaAuth })
  .use(router)
  .use(VueLazyLoad)
  .use(Argon)
  .mount('#app')