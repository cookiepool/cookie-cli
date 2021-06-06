<%_ if(vueVersion === '2') { _%>
import Vue from 'vue';
<%_ } else { _%>
import { createApp } from 'vue';
<%_ } _%>
import App from './App.vue';
<%_ if(hasRouter) { _%>
import router from './router';
<%_ } _%>
<%_ if(hasVuex) { _%>
import store from './store';
<%_ } _%>

<%_ if (vueVersion === '2') { _%>
Vue.config.productionTip = false;

new Vue({
  <%_ if(hasRouter) { _%>
  router,
  <%_ } _%>
  <%_ if(hasVuex) { _%>
  store,
  <%_ } _%>
  render: (h) => h(App),
}).$mount('#app');
<%_ } _%>

<%_ if (vueVersion === '3') { _%>
createApp(App)
  <%_ if(hasRouter) { _%>
  .use(router)
  <%_ } _%>
  <%_ if(hasVuex) { _%>
  .use(store)
  <%_ } _%>
  .mount('#app');
<%_ } _%>