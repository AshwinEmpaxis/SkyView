// /**
//  * Color intention that you want to used in your theme
//  * @param {JsonObject} theme Theme customization object
//  */

// export default function themePalette(theme) {
//   return {
//     mode: theme?.customization?.navType,
//     common: {
//       black: theme.colors?.darkPaper
//     },
//     primary: {
//       light: theme.colors?.primaryLight,
//       main: theme.colors?.primaryMain,
//       dark: theme.colors?.primaryDark,
//       200: theme.colors?.primary200,
//       800: theme.colors?.primary800
//     },
//     secondary: {
//       light: theme.colors?.secondaryLight,
//       main: theme.colors?.secondaryMain,
//       dark: theme.colors?.secondaryDark,
//       200: theme.colors?.secondary200,
//       800: theme.colors?.secondary800
//     },
//     error: {
//       light: theme.colors?.errorLight,
//       main: theme.colors?.errorMain,
//       dark: theme.colors?.errorDark
//     },
//     orange: {
//       light: theme.colors?.orangeLight,
//       main: theme.colors?.orangeMain,
//       dark: theme.colors?.orangeDark
//     },
//     warning: {
//       light: theme.colors?.warningLight,
//       main: theme.colors?.warningMain,
//       dark: theme.colors?.warningDark
//     },
//     success: {
//       light: theme.colors?.successLight,
//       200: theme.colors?.success200,
//       main: theme.colors?.successMain,
//       dark: theme.colors?.successDark
//     },
//     grey: {
//       50: theme.colors?.grey50,
//       100: theme.colors?.grey100,
//       500: theme.darkTextSecondary,
//       600: theme.heading,
//       700: theme.darkTextPrimary,
//       900: theme.textDark
//     },
//     dark: {
//       light: theme.colors?.darkTextPrimary,
//       main: theme.colors?.darkLevel1,
//       dark: theme.colors?.darkLevel2,
//       800: theme.colors?.darkBackground,
//       900: theme.colors?.darkPaper
//     },
//     text: {
//       primary: theme.darkTextPrimary,
//       secondary: theme.darkTextSecondary,
//       dark: theme.textDark,
//       hint: theme.colors?.grey100
//     },
//     background: {
//       paper: theme.paper,
//       default: theme.backgroundDefault
//     }
//   };
// }

// assets
import defaultColor from 'assets/scss/_themes-vars.module.scss';
import theme1 from 'assets/scss/_theme1.module.scss';
import theme2 from 'assets/scss/_theme2.module.scss';
import theme3 from 'assets/scss/_theme3.module.scss';
import theme4 from 'assets/scss/_theme4.module.scss';
import theme5 from 'assets/scss/_theme5.module.scss';
import theme6 from 'assets/scss/_theme6.module.scss';

/**
 * Color intention that you want to use in your theme
 * @param {JsonObject} theme Theme customization object
 * @param {string} presetColor The preset color theme to use
 */
export default function themePalette(theme, presetColor) {
  const navType = theme?.customization?.navType || 'light'; // Assuming default navigation type is 'light'

  let colors;
  switch (presetColor) {
    case 'theme1':
      colors = theme1;
      break;
    case 'theme2':
      colors = theme2;
      break;
    case 'theme3':
      colors = theme3;
      break;
    case 'theme4':
      colors = theme4;
      break;
    case 'theme5':
      colors = theme5;
      break;
    case 'theme6':
      colors = theme6;
      break;
    case 'default':
    default:
      colors = defaultColor;
  }

  return {
    mode: navType,
    common: {
      black: colors.darkPaper
    },
    primary: {
      light: navType === 'dark' ? colors.darkPrimaryLight : colors.primaryLight,
      main: navType === 'dark' ? colors.darkPrimaryMain : colors.primaryMain,
      dark: navType === 'dark' ? colors.darkPrimaryDark : colors.primaryDark,
      200: navType === 'dark' ? colors.darkPrimary200 : colors.primary200,
      800: navType === 'dark' ? colors.darkPrimary800 : colors.primary800
    },
    secondary: {
      light: navType === 'dark' ? colors.darkSecondaryLight : colors.secondaryLight,
      main: navType === 'dark' ? colors.darkSecondaryMain : colors.secondaryMain,
      dark: navType === 'dark' ? colors.darkSecondaryDark : colors.secondaryDark,
      200: navType === 'dark' ? colors.darkSecondary200 : colors.secondary200,
      800: navType === 'dark' ? colors.darkSecondary800 : colors.secondary800
    },
    error: {
      light: colors.errorLight,
      main: colors.errorMain,
      dark: colors.errorDark
    },
    orange: {
      light: colors.orangeLight,
      main: colors.orangeMain,
      dark: colors.orangeDark
    },
    warning: {
      light: colors.warningLight,
      main: colors.warningMain,
      dark: colors.warningDark
    },
    success: {
      light: colors.successLight,
      200: colors.success200,
      main: colors.successMain,
      dark: colors.successDark
    },
    grey: {
      50: colors.grey50,
      100: colors.grey100,
      500: navType === 'dark' ? colors.darkTextSecondary : colors.grey500,
      600: navType === 'dark' ? colors.darkTextTitle : colors.grey900,
      700: navType === 'dark' ? colors.darkTextPrimary : colors.grey700,
      900: navType === 'dark' ? colors.darkTextPrimary : colors.grey900
    },
    dark: {
      light: colors.darkTextPrimary,
      main: colors.darkLevel1,
      dark: colors.darkLevel2,
      800: colors.darkBackground,
      900: colors.darkPaper
    },
    text: {
      primary: navType === 'dark' ? colors.darkTextPrimary : colors.grey700,
      secondary: navType === 'dark' ? colors.darkTextSecondary : colors.grey500,
      dark: navType === 'dark' ? colors.darkTextPrimary : colors.grey900,
      hint: colors.grey100
    },
    divider: navType === 'dark' ? colors.darkTextPrimary : colors.grey200,
    background: {
      paper: navType === 'dark' ? colors.darkLevel2 : colors.paper,
      default: navType === 'dark' ? colors.darkPaper : colors.paper
    }
  };
}
