
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import Snackbar from 'ui-component/extended/Snackbar';
import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

import Locales from 'ui-component/Locales';
// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <Locales>
          <NavigationScroll>
            <AuthProvider>
              <Routes />
              <Snackbar />
            </AuthProvider>
          </NavigationScroll>
        </Locales>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

