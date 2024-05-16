// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Formik } from 'formik';
// import * as Yup from 'yup';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import {
//   Box,
//   Button,
//   Checkbox,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   FormHelperText,
//   Grid,
//   IconButton,
//   InputAdornment,
//   InputLabel,
//   OutlinedInput,
//   Stack,
//   Typography,
//   useMediaQuery
// } from '@mui/material';

// // third party
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// // project imports
// import useConfig from 'hooks/useConfig';
// import useAuth from 'hooks/useAuth';
// import useScriptRef from 'hooks/useScriptRef';
// import AnimateButton from 'ui-component/extended/AnimateButton';

// import Google from 'assets/images/icons/social-google.svg';

// // FirebaseLogin component
// const FirebaseLogin = ({ loginProp, ...others }) => {
//   // Hooks and state
//   const theme = useTheme();
//   const scriptedRef = useScriptRef();
//   const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
//   const { borderRadius } = useConfig();
//   const [checked, setChecked] = useState(true);
//   const { firebaseEmailPasswordSignIn, firebaseGoogleSignIn } = useAuth();
//   const [showPassword, setShowPassword] = useState(false);

//   // Handlers
//   const handleClickShowPassword = () => setShowPassword(!showPassword);
//   const handleMouseDownPassword = (event) => event.preventDefault();
//   const googleHandler = async () => {
//     try {
//       await firebaseGoogleSignIn();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Validation schema
//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
//     password: Yup.string().max(255).required('Password is required')
//   });

//   // Form submission handler
//   const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
//     try {
//       await firebaseEmailPasswordSignIn(values.email, values.password).then(
//         () => {
//           // navigate(location.state?.from?.pathname || config.defaultPath, { replace: true });
//         },
//         (err) => {
//           if (scriptedRef.current) {
//             setStatus({ success: false });
//             setErrors({ submit: err.message });
//             setSubmitting(false);
//           }
//         }
//       );
//     } catch (err) {
//       console.error(err);
//       if (scriptedRef.current) {
//         setStatus({ success: false });
//         setErrors({ submit: err.message });
//         setSubmitting(false);
//       }
//     }
//   };

//   return (
//     <>
//       {/* Google sign in */}
//       <Grid container direction="column" justifyContent="center" spacing={2}>
//         <Grid item xs={12}>
//           <AnimateButton>
//             <Button
//               disableElevation
//               fullWidth
//               onClick={googleHandler}
//               size="large"
//               variant="outlined"
//               sx={{
//                 color: 'grey.700',
//                 backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
//                 borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : theme.palette.grey[100]
//               }}
//             >
//               <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
//                 <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
//               </Box>
//               Sign in with Google
//             </Button>
//           </AnimateButton>
//         </Grid>
//         {/* OR divider */}
//         <Grid item xs={12}>
//           <Box sx={{ alignItems: 'center', display: 'flex' }}>
//             <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
//             <Button
//               variant="outlined"
//               sx={{
//                 cursor: 'unset',
//                 m: 2,
//                 py: 0.5,
//                 px: 7,
//                 borderColor:
//                   theme.palette.mode === 'dark' ? `${theme.palette.dark.light + 20} !important` : `${theme.palette.grey[100]} !important`,
//                 color: `${theme.palette.grey[900]}!important`,
//                 fontWeight: 500,
//                 borderRadius: `${borderRadius}px`
//               }}
//               disableRipple
//               disabled
//             >
//               OR
//             </Button>
//             <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
//           </Box>
//         </Grid>
//         {/* Email sign in */}
//         <Grid item xs={12} container alignItems="center" justifyContent="center">
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle1">Sign in with Email address</Typography>
//           </Box>
//         </Grid>
//       </Grid>

//       {/* Formik form */}
//       <Formik
//         initialValues={{ email: 'info@codedthemes.com', password: '123456', submit: null }}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//           <form noValidate onSubmit={handleSubmit} {...others}>
//             {/* Email input */}
//             <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
//               <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-email-login"
//                 type="email"
//                 value={values.email}
//                 name="email"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 label="Email Address / Username"
//                 inputProps={{}}
//               />
//               {/* Email input error message */}
//               {touched.email && errors.email && (
//                 <FormHelperText error id="standard-weight-helper-text-email-login">
//                   {errors.email}
//                 </FormHelperText>
//               )}
//             </FormControl>

//             {/* Password input */}
//             <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
//               <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-password-login"
//                 type={showPassword ? 'text' : 'password'}
//                 value={values.password}
//                 name="password"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 endAdornment={
//                   <InputAdornment position="end">
//                     {/* Toggle password visibility */}
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleClickShowPassword}
//                       onMouseDown={handleMouseDownPassword}
//                       edge="end"
//                       size="large"
//                     >
//                       {showPassword ? <Visibility /> : <VisibilityOff />}
//                     </IconButton>
//                   </InputAdornment>
//                 }
//                 label="Password"
//                 inputProps={{}}
//               />
//               {/* Password input error message */}
//               {touched.password && errors.password && (
//                 <FormHelperText error id="standard-weight-helper-text-password-login">
//                   {errors.password}
//                 </FormHelperText>
//               )}
//             </FormControl>

//             {/* Remember me checkbox and Forgot password link */}
//             <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
//               <FormControlLabel
//                 control={
//                   <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
//                 }
//                 label="Remember me"
//               />
//               <Typography
//                 variant="subtitle1"
//                 component={Link}
//                 to={loginProp ? `/forgot-password${loginProp}` : '/forgot-password'}
//                 color="secondary"
//                 sx={{ textDecoration: 'none' }}
//               >
//                 Forgot Password?
//               </Typography>
//             </Stack>

//             {/* Submit button */}
//             {errors.submit && (
//               <Box sx={{ mt: 3 }}>
//                 <FormHelperText error>{errors.submit}</FormHelperText>
//               </Box>
//             )}
//             <Box sx={{ mt: 2 }}>
//               <AnimateButton>
//                 <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
//                   Sign in
//                 </Button>
//               </AnimateButton>
//             </Box>
//           </form>
//         )}
//       </Formik>
//     </>
//   );
// };

// export default FirebaseLogin;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; // Import Axios

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';

// third party
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// project imports
import useConfig from 'hooks/useConfig';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

import Google from 'assets/images/icons/social-google.svg';

// FirebaseLogin component
const FirebaseLogin = ({ loginProp, ...others }) => {
  // Hooks and state
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const { borderRadius } = useConfig();
  const [checked, setChecked] = useState(true);
  const { firebaseEmailPasswordSignIn, firebaseGoogleSignIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Handlers
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const googleHandler = async () => {
    try {
      await firebaseGoogleSignIn();
    } catch (err) {
      console.error(err);
    }
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: Yup.string().max(255).required('Password is required')
  });

  // Form submission handler
  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      const response = await axios.post(
        'http://localhost:55411/Service.svc/login',
        { userName: values.email, password: values.password },
        {
          headers: {
            'Content-Type': 'application/json' // Set the content-type header
          }
        }
      );

      // Handle the response here
      console.log('Login response:', response.data);

      // You can navigate to another page or perform any other actions based on the response
    } catch (error) {
      // Handle errors
      console.error('Login error:', error);

      if (scriptedRef.current) {
        setStatus({ success: false });
        setErrors({ submit: error.message });
        setSubmitting(false);
      }
    }
  };

  return (
    <>
      {/* Google sign in */}
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              onClick={googleHandler}
              size="large"
              variant="outlined"
              sx={{
                color: 'grey.700',
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : theme.palette.grey[100]
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
              </Box>
              Sign in with Google
            </Button>
          </AnimateButton>
        </Grid>
        {/* OR divider */}
        <Grid item xs={12}>
          <Box sx={{ alignItems: 'center', display: 'flex' }}>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            <Button
              variant="outlined"
              sx={{
                cursor: 'unset',
                m: 2,
                py: 0.5,
                px: 7,
                borderColor:
                  theme.palette.mode === 'dark' ? `${theme.palette.dark.light + 20} !important` : `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]}!important`,
                fontWeight: 500,
                borderRadius: `${borderRadius}px`
              }}
              disableRipple
              disabled
            >
              OR
            </Button>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        {/* Email sign in */}
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Sign in with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Formik form */}
      <Formik
        initialValues={{ email: 'info@codedthemes.com', password: '123456', submit: null }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit} // Use the handleSubmit function here
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {/* Email input */}
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {/* Email input error message */}
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            {/* Password input */}
            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    {/* Toggle password visibility */}
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {/* Password input error message */}
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {/* Remember me checkbox and Forgot password link */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label="Remember me"
              />
              <Typography
                variant="subtitle1"
                component={Link}
                to={loginProp ? `/forgot-password${loginProp}` : '/forgot-password'}
                color="secondary"
                sx={{ textDecoration: 'none' }}
              >
                Forgot Password?
              </Typography>
            </Stack>

            {/* Submit button */}
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
