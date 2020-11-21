import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Home
  }
]

export default new VueRouter({
  mode:'history',
  routes: routes
});
