import React, { createContext, useEffect, useReducer } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';
import Loader from 'ui-component/Loader';
import { FIREBASE_API } from 'config';

// Initialize Firebase app if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_API);
}

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user: {
              id: user.uid,
              email: user.email,
              name: user.displayName || 'John Doe'
            }
          }
        });
      } else {
        dispatch({
          type: LOGOUT
        });
      }
    });
  }, []);

  const firebaseEmailPasswordSignIn = (email, password) => firebase.auth().signInWithEmailAndPassword(email, password);

  const firebaseGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  };

  const firebaseRegister = async (email, password) => firebase.auth().createUserWithEmailAndPassword(email, password);

  const logout = () => firebase.auth().signOut(); // Ensure logout function is included in the context

  const resetPassword = async (email) => {
    await firebase.auth().sendPasswordResetEmail(email);
  };

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <FirebaseContext.Provider
      value={{
        ...state,
        firebaseRegister,
        firebaseEmailPasswordSignIn,
        firebaseGoogleSignIn,
        logout, // Include logout function in the context value
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;
