<%_ if (vueVersion === '2') { _%>
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
<%_ } _%>

<%_ if (vueVersion === '3') { _%>
<%_ if (historyMode) { _%>
import { createRouter, createWebHistory } from 'vue-router';
<%_ } else { _%>
import { createRouter, createWebHashHistory } from 'vue-router';
<%_ } _%>
<%_ } _%>


import Home from '../views/Home.vue';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	}
];


<%_ if (vueVersion === '2') { _%>
const router = new VueRouter({
	<%_ if (historyMode) { _%>
	mode: 'history',
	<%_ } _%>
	routes
});
<%_ } _%>

<%_ if (vueVersion === '3') { _%>
const router = createRouter({
	<%_ if (historyMode) { _%>
	history: createWebHashHistory(),
	<%_ } else { _%>
		history: createWebHistory(),
	<%_ } _%>
	routes
});
<%_ } _%>

export default router;
