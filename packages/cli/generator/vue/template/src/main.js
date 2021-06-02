<%_ if(vueVersion === '2') { _%>
import Vue from 'vue';
<%_ } else { _%>
import { createApp } from 'vue';
<%_ } _%>
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');