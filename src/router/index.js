'use strict'

import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import PasswordReset from '@/views/PasswordReset.vue'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/password-reset',
    name: 'passwordReset',
    component: PasswordReset
  },
  {
    path: '/',
    name: 'home',
    component: Home
  }
]

export default new VueRouter({
  mode: 'history',
  routes: routes
})
