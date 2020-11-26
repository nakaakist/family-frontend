'use strict';

import authService from '@/services/authService';

import { LOGIN, LOGOUT, CHECK_AUTH } from '../actionTypes';
import {
  LOGIN_SUCCESS,
  PASSWORD_CHANGE_REQUIRED,
  LOGIN_ERROR,
  AUTH_CHECK_SUCCESS,
  REMOVE_AUTH
} from '../mutationTypes';

const state = {
  user: {},
  isAuthenticated: false,
  isPasswordChangeRequired: false,
  error: null
};

const actions = {
  async [LOGIN]({ commit }, username, password) {
    try {
      const result = await authService.login(username, password);
      if (result.status === 'success') {
        commit(LOGIN_SUCCESS);
      } else if (result.status === 'passwordChangeRequuired') {
        commit(PASSWORD_CHANGE_REQUIRED, result.userAttributes);
      } else {
        commit(LOGIN_ERROR, null);
      }
    } catch (error) {
      console.error(error);
      commit(LOGIN_ERROR, error);
    }
  },
  async [CHECK_AUTH]({ commit }) {
    try {
      const isAuthenticated = await authService.checkAuth();
      if (isAuthenticated) {
        commit(AUTH_CHECK_SUCCESS);
      } else {
        commit(REMOVE_AUTH, null);
      }
    } catch (error) {
      console.error(error);
      commit(REMOVE_AUTH, error);
    }
  },
  async [LOGOUT]({ commit }) {
    try {
      await authService.logout();
    } catch (error) {
      commit(REMOVE_AUTH, error);
    }
  }
};

const mutations = {
  [LOGIN_SUCCESS](state) {
    state.isAuthenticated = true;
    state.isPasswordChangeRequired = false;
    state.error = null;
  },
  [PASSWORD_CHANGE_REQUIRED](state, userAttributes) {
    state.user = userAttributes;
    state.isAuthenticated = false;
    state.isPasswordChangeRequired = true;
    state.error = null;
  },
  [LOGIN_ERROR](state, error) {
    state.user = {};
    state.isAuthenticated = false;
    state.isPasswordChangeRequired = true;
    state.error = error;
  },
  [AUTH_CHECK_SUCCESS](state) {
    state.isAuthenticated = true;
    state.isPasswordChangeRequired = false;
    state.error = null;
  },
  [REMOVE_AUTH](state, error) {
    state.user = {};
    state.isAuthenticated = false;
    state.isPasswordChangeRequired = false;
    state.error = error;
  }
};

export default {
  state,
  actions,
  mutations
};
