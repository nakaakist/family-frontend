'use strict'

import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import '@aws-amplify/ui-vue'
import Amplify from 'aws-amplify'
import awsconfig from '@/aws-exports'
import { CHECK_AUTH } from '@/store/actionTypes'

Amplify.configure(awsconfig)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  store.dispatch(CHECK_AUTH).then(() => {
    console.log('auth result: ', store.state.auth.isAuthenticated)
    if (store.state.auth.isAuthenticated) {
      next()
    } else {
      if (to.name === 'home' || to.name === 'login' || to.name === 'passwordReset') {
        next()
      } else {
        next({ name: 'home' })
      }
    }
  })
})

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
