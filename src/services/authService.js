'use strict'

import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'
import * as AWS from 'aws-sdk/global'

AWS.config.region = process.env.VUE_APP_AWS_REGION

const getUserPool = () => {
  const userPoolData = {
    UserPoolId: process.env.VUE_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.VUE_APP_COGNITO_USER_POOL_CLIENT_ID
  }

  return new CognitoUserPool(userPoolData)
}

const getUserByUsername = (username) => {
  const userPool = getUserPool()
  const userData = {
    Username: username,
    Pool: userPool
  }

  return new CognitoUser(userData)
}

const authenticate = (user, authnDetails) => {
  return new Promise((resolve, reject) => {
    user.authenticateUser(authnDetails, {
      onSuccess: function (result) {
        const loginInfos = {}
        loginInfos[
          `cognito-idp.${process.env.VUE_APP_AWS_REGION}.amazonaws.com/${process.env.VUE_APP_COGNITO_USER_POOL_ID}`
        ] = result.getIdToken().getJwtToken()

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.VUE_APP_COGNITO_IDENTITY_POOL_ID,
          Logins: loginInfos
        })

        // refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        return AWS.config.credentials.refresh((error) => {
          if (error) {
            reject(error)
          }

          resolve({ status: 'success' })
        })
      },
      onFailure: function (error) {
        reject(error)
      },
      newPasswordRequired: function (userAttributes) {
        reject(new Error('passwordResetRequired'))
      }
    })
  })
}

const authenticateAndResetPassword = (user, authnDetails, password) => {
  return new Promise((resolve, reject) => {
    user.authenticateUser(authnDetails, {
      onSuccess: function (result) {
        return reject(new Error('リセットの必要ないよ'))
      },
      onFailure: function (error) {
        reject(error)
      },
      newPasswordRequired: function (userAttributes) {
        delete userAttributes.email_verified
        delete userAttributes.phone_number_verified
        user.completeNewPasswordChallenge(password, userAttributes,
          {
            onSuccess: function (data) {
              resolve()
            },
            onFailure: function (error) {
              reject(error)
            }
          }
        )
      }
    })
  })
}

const login = async (username, password) => {
  const authnData = {
    Username: username,
    Password: password
  }
  const authnDetails = new AuthenticationDetails(authnData)
  const user = getUserByUsername(username)

  return await authenticate(user, authnDetails)
}

const logout = () => {
  const userPool = getUserPool()
  const currentUser = userPool.getCurrentUser()
  currentUser.signOut()
  window.localStorage.clear()
}

const resetPassword = async (username, currentPassword, password) => {
  const authnData = {
    Username: username,
    Password: currentPassword
  }
  const authnDetails = new AuthenticationDetails(authnData)
  const user = getUserByUsername(username)

  return await authenticateAndResetPassword(user, authnDetails, password)
}

const checkAuth = async () => {
  const userPool = getUserPool()
  const currentUser = userPool.getCurrentUser()

  if (currentUser === null) {
    return false
  }

  return await new Promise((resolve, reject) => {
    currentUser.getSession((error, session) => {
      if (error) {
        reject(error)
      }
      resolve(session.isValid())
    })
  })
}

export default {
  login,
  logout,
  resetPassword,
  checkAuth
}
