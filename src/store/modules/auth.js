'use strict'

import authService from '@/services/authService'

import { LOGIN, LOGOUT, RESET_PASSWORD, CHECK_AUTH } from '../actionTypes'
import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_ERROR,
  AUTH_CHECK_SUCCESS,
  AUTH_CHECK_FAIL,
  REMOVE_AUTH
} from '../mutationTypes'

const state = {
  isAuthenticated: false,
  error: null
}

const actions = {
  async [LOGIN]({ commit }, { username, password }) {
    try {
      const result = await authService.login(username, password)
      if (result.status === 'success') {
        commit(LOGIN_SUCCESS)
      } else {
        commit(LOGIN_ERROR, null)
      }
    } catch (error) {
      commit(LOGIN_ERROR, error)
    }
  },
  async [RESET_PASSWORD]({ commit }, { username, currentPassword, password }) {
    try {
      await authService.resetPassword(username, currentPassword, password)
      commit(PASSWORD_RESET_SUCCESS)
    } catch (error) {
      commit(PASSWORD_RESET_ERROR, error)
    }
  },
  async [CHECK_AUTH]({ commit }) {
    try {
      const isAuthenticated = await authService.checkAuth()
      if (isAuthenticated) {
        commit(AUTH_CHECK_SUCCESS)
      } else {
        commit(AUTH_CHECK_FAIL)
      }
    } catch (error) {
      commit(REMOVE_AUTH, error)
    }
  },
  async [LOGOUT]({ commit }) {
    try {
      await authService.logout()
    } catch (error) {
      commit(REMOVE_AUTH, error)
    }
  }
}

const mutations = {
  [LOGIN_SUCCESS](state) {
    state.isAuthenticated = true
    state.error = null
  },
  [LOGIN_ERROR](state, error) {
    state.isAuthenticated = false
    state.error = error
  },
  [PASSWORD_RESET_SUCCESS](state, error) {
    state.isAuthenticated = true
    state.error = null
  },
  [PASSWORD_RESET_ERROR](state, error) {
    state.error = error
  },
  [AUTH_CHECK_SUCCESS](state) {
    state.isAuthenticated = true
    state.error = null
  },
  [AUTH_CHECK_FAIL](state) {
    state.isAuthenticated = false
  },
  [REMOVE_AUTH](state, error) {
    state.isAuthenticated = false
    state.error = error
  }
}
export default {
  state,
  actions,
  mutations
}
