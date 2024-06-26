import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import GuestGuard from 'utils/route-guard/GuestGuard';
// login option 3 routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const AuthForgotPassword = Loadable(lazy(() => import('views/pages/authentication/auth-forms/AuthForgotPassword')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: (
    <NavMotion>
      <GuestGuard>
        <MinimalLayout />
      </GuestGuard>
    </NavMotion>
  ),
  children: [
    {
      path: '/',
      element: <AuthLogin />
    },
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: '/register',
      element: <AuthRegister />
    },
    {
      path: '/forgot-password',
      element: <AuthForgotPassword />
    }
  ]
};

export default AuthenticationRoutes;
