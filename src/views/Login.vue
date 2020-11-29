<template>
  <v-container>
    <v-row align="center">
      <v-col align="center">
        <h4 class="title">
          Familyにログイン
        </h4>
        <v-text-field
          v-model="username"
          label="メールアドレス"
        />
        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="パスワード"
          @click:append="showPassword = !showPassword"
        />
        <v-btn
          block
          :disabled="loginButtonDisabled"
          @click="login"
        >
          ログイン
        </v-btn>
        <v-alert
          v-if="loginErrorMessage"
          type="error"
        >
          {{ loginErrorMessage }}
        </v-alert>
        <v-alert
          v-if="isPasswordResetRequired"
          type="warning"
        >
          <router-link :to="{ name: 'passwordReset' }">
            パスワードのリセットが必要です。
          </router-link>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { LOGIN } from '@/store/actionTypes'

export default {
  data: function() {
    return {
      username: '',
      password: '',
      showPassword: false,
      loginErrorMessage: null,
      loginButtonDisabled: false,
      isPasswordResetRequired: false
    }
  },
  methods: {
    login: function() {
      this.loginButtonDisabled = true
      this.$store.dispatch(LOGIN, { username: this.username, password: this.password })
        .then(() => {
          this.loginButtonDisabled = false
          if (this.$store.state.auth.isAuthenticated) {
            this.$router.push({ name: 'home' })
          } else if (this.$store.state.auth.error) {
            if (this.$store.state.auth.error.message === 'passwordResetRequired') {
              this.isPasswordResetRequired = true
            } else {
              this.loginErrorMessage = this.$store.state.auth.error.message
            }
          } else {
            this.loginErrorMessage = 'Unknown error'
          }
        })
    }
  }
}
</script>
