<template>
  <v-container>
    <v-row align="center">
      <v-col align="center">
        <h4 class="title">
          パスワードをリセット
        </h4>
        <v-text-field
          v-model="username"
          label="メールアドレス"
        />
        <v-text-field
          v-model="currentPassword"
          :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showCurrentPassword ? 'text' : 'password'"
          label="現在のパスワード"
          @click:append="showCurrnetPassword = !showCurrentPassword"
        />
        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="新しいパスワード"
          @click:append="showPassword = !showPassword"
        />
        <v-text-field
          v-model="passwordConfirm"
          :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPasswordConfirm ? 'text' : 'password'"
          label="新しいパスワード(確認用)"
          @click:append="showPasswordConfirm = !showPasswordConfirm"
        />
        <v-btn
          block
          :disabled="passwordResetButtonDisabled"
          @click="resetPassword"
        >
          リセット
        </v-btn>
        <v-alert
          v-if="passwordResetErrorMessage"
          type="error"
        >
          {{ passwordResetErrorMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { RESET_PASSWORD } from '@/store/actionTypes'

export default {
  data: function() {
    return {
      username: '',
      currentPassword: '',
      password: '',
      passwordConfirm: '',
      showCurrentPassword: false,
      showPassword: false,
      showPasswordConfirm: false,
      passwordResetErrorMessage: null,
      passwordResetButtonDisabled: false
    }
  },
  methods: {
    resetPassword: function() {
      if (this.password !== this.passwordConfirm) {
        this.passwordResetErrorMessage = '確認用パスワードが一致していません'
        return
      }

      this.resetPassowrdButtonDisabled = true
      this.$store.dispatch(RESET_PASSWORD,
        {
          username: this.username,
          currentPassword: this.currentPassword,
          password: this.password
        })
        .then(() => {
          this.passwordResetButtonDisabled = false
          if (this.$store.state.auth.isAuthenticated) {
            this.$router.push({ name: 'home' })
          } else if (this.$store.state.auth.error) {
            this.passwordResetErrorMessage = this.$store.state.auth.error.message
          } else {
            this.passwordResetErrorMessage = 'Unknown error'
          }
        })
    }
  }
}
</script>
