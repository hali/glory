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
import OktaVue from '@okta/okta-vue';
import {Tabs, Tab} from 'vue3-tabs-component';
import i18n from './i18n';

// Import the oktaAuth instance from our helper file
import { oktaAuth } from './services/oktaHelper';

// Make oktaAuth accessible globally for debugging
window.$oktaAuth = oktaAuth;

// Initialize Okta Auth once before app creation
try {
  oktaAuth.start();
  console.log('Okta Auth started successfully');
} catch (error) {
  console.error('Failed to start Okta Auth:', error);
}

const app = createApp(App);

// Add global property for Okta Auth (both $auth and $oktaAuth for compatibility)
app.config.globalProperties.$auth = oktaAuth;
app.config.globalProperties.$oktaAuth = oktaAuth;

// Add global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.info('Error Info:', info);
  
  // Prevent authentication errors from crashing the app
  if (err.toString().includes('authentication') || err.toString().includes('okta')) {
    console.warn('Authentication related error handled gracefully');
    return;
  }
};

app
  .use(OktaVue, { oktaAuth })
  .use(router)
  .use(i18n)
  .use(VueLazyLoad)
  .use(Argon)
  .component('tabs', Tabs)
  .component('tab', Tab)
  .mount('#app');