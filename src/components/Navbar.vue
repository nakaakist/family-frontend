<template>
  <v-app-bar
    dense
    dark
    app
  >
    <v-toolbar-title> Family </v-toolbar-title>
    <v-spacer />
    <v-btn
      icon
      to="/"
    >
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn
      v-if="this.$store.state.auth.isAuthenticated"
      icon
      @click="logout"
    >
      <v-icon>
        mdi-logout
      </v-icon>
    </v-btn>
    <v-btn
      v-else
      icon
      to="/login"
    >
      <v-icon>
        mdi-login
      </v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { LOGOUT } from '@/store/actionTypes'

export default {
  methods: {
    logout: function() {
      this.$store.dispatch(LOGOUT)
        .then(() => {
          this.$router.go({ path: this.$router.currentRoute.path, force: true })
        })
    }
  }
}
</script>
