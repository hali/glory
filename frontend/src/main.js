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
import { createApp } from "vue";
import App from "./App.vue";
import VueLazyLoad from "vue3-lazyload";
import router from "./router";
import Argon from "./plugins/argon-kit";
import "./registerServiceWorker";
import { auth0 } from "./plugins/auth0";
import { Tabs, Tab } from "vue3-tabs-component";
import i18n from "./i18n";

const app = createApp(App);
// Add global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error("Vue Error:", err);
  console.info("Error Info:", info);
};

app
  .use(router)
  .use(auth0)
  .use(i18n)
  .use(VueLazyLoad)
  .use(Argon)
  .component("tabs", Tabs)
  .component("tab", Tab)
  .mount("#app");
