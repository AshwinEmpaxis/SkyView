import React, { createContext, useEffect, useReducer } from 'react';
import { CognitoUser, CognitoUserPool, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Loader from 'ui-component/Loader';
import { AWS_API } from 'config';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

export const userPool = new CognitoUserPool({
  UserPoolId: AWS_API.poolId || '',
  ClientId: AWS_API.appClientId || ''
});

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
  } else {
    localStorage.removeItem('serviceToken');
  }
};

// context
const AWSCognitoContext = createContext(null);

// provider
export const AWSCognitoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken) {
          setSession(serviceToken);
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                name: 'Betty'
              }
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    const usr = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    const authData = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    usr.authenticateUser(authData, {
      onSuccess: (session) => {
        setSession(session.getAccessToken().getJwtToken());

        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user: {
              email: authData.getUsername(),
              name: 'John Doe'
            }
          }
        });
      },
      onFailure: (err) => {
        console.error(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        console.log('New password required:', userAttributes, requiredAttributes);
      }
    });
  };

  const register = (email, password, firstName, lastName) =>
    new Promise((success, rej) => {
      userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({ Name: 'name', Value: `${firstName} ${lastName}` })
        ],
        [],
        async (err, result) => {
          if (err) {
            rej(err);
            return;
          }
          success(result);
        }
      );
    });

  const logout = () => {
    const loggedInUser = userPool.getCurrentUser();
    if (loggedInUser) {
      setSession(null);
      loggedInUser.signOut();
      dispatch({ type: LOGOUT });
    }
  };

  if (!state.isInitialized) {
    return <Loader />;
  }

  return <AWSCognitoContext.Provider value={{ ...state, login, logout, register }}>{children}</AWSCognitoContext.Provider>;
};

export default AWSCognitoContext;
