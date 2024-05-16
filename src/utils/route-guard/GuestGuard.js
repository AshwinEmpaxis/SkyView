// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import useAuth from 'hooks/useAuth';
// import config from 'config';
// import PropTypes from 'prop-types';

// // ==============================|| GUEST GUARD ||============================== //

// /**
//  * Guest guard for routes having no auth required
//  * @param {PropTypes.node} children children element/node
//  */

// const GuestGuard = ({ children }) => {
//   const { isLoggedIn } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isLoggedIn) {
//       navigate(config.defaultPath, { replace: true });
//     }
//   }, [isLoggedIn, navigate]);

//   return children;
// };

// GuestGuard.propTypes = {
//   children: PropTypes.node.isRequired
// };

// export default GuestGuard;

// import { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
// import useAuth from 'hooks/useAuth';
// import config from 'config';
// import PropTypes from 'prop-types';

// // ==============================|| GUEST GUARD ||============================== //

// /**
//  * Guest guard for routes having no auth required
//  * @param {PropTypes.node} children children element/node
//  */

// const GuestGuard = ({ children }) => {
//   const { isLoggedIn } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (isLoggedIn) {
//       const intendedRoute = location?.state?.from?.pathname || config.defaultPath;
//       navigate(intendedRoute, { replace: true });
//     }
//   }, [isLoggedIn, navigate, location.state]);

//   return children;
// };

// GuestGuard.propTypes = {
//   children: PropTypes.node.isRequired
// };

// export default GuestGuard;

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import config from 'config';
import PropTypes from 'prop-types';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      // Store the original destination in sessionStorage
      sessionStorage.setItem('originalDestination', JSON.stringify(location));

      // Redirect to the intended route or default path
      const intendedRoute = location?.state?.from?.pathname || config.defaultPath;
      navigate(intendedRoute, { replace: true });
    }
  }, [isLoggedIn, navigate, location.state]);

  // After successful authentication, redirect the user to the original destination
  useEffect(() => {
    const originalDestination = JSON.parse(sessionStorage.getItem('originalDestination'));
    if (!isLoggedIn && originalDestination) {
      navigate(originalDestination, { replace: true });
      sessionStorage.removeItem('originalDestination'); // Clear sessionStorage after redirection
    }
  }, [isLoggedIn, navigate]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired
};

export default GuestGuard;
