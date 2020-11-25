'use strict';

import {
  AuthenticationDetails,
	CognitoUserPool,
	CognitoUser
} from 'amazon-cognito-identity-js';
import config from '../config';
import * as AWS from 'aws-sdk/global';

AWS.config.region = config.AWSRegion;

const getUserPool = () => {
  const userPoolData = {
    UserPoolId: config.CognitoUserPoolId,
    ClientId: config.CognitoUserPoolClientId
  };

  return new CognitoUserPool(userPoolData);
}

const login = async (username, password) => {
  const authnData = {
    Username: username,
    Password: password
  };
  const authnDetails = new AuthenticationDetails(authnData);

  const userPool = getUserPool();
  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  cognitoUser.authenticateUser(authnDetails, {
    onSuccess: function (result) {
      const loginInfos = {};
      loginInfos[`cognito-idp.${config.AWSRegion}.amazonaws.com/${config.CognitoUserPoolId}`] = result
        .getIdToken()
        .getJwtToken()

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: config.CognitoIdentityPoolId,
        Logins: loginInfos,
      });

      //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
      AWS.config.credentials.refresh(error => {
        if (error) {
          console.error(error);
          Promise.reject(error);
        } else {
          // Instantiate aws sdk service objects now that the credentials have been updated.
          // example: var s3 = new AWS.S3();
          console.log('Successfully logged!');
          Promise.resolve({ status: 'success' });
        }
      });
    },
    onFailure: function (error) {
      console.log(error.message || JSON.stringify(error));
      Promise.reject(error);
    },
    newPasswordRequired: function (userAttributes) {
      console.log('password change required');
      Promise.resolve({
        status: 'passwordChangeRequired',
        userAttributes: userAttributes
      })
    }
//        delete userAttributes.email_verified;
//        cognitoUser.completeNewPasswordChallenge('hogehoge', userAttributes, this);
  });
}

export default { login }
