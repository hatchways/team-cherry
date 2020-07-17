import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h1: {
      fontWeight: '900',
      fontSize: '25px'
    },
    h2: {
      fontWeight: '900',
      fontSize: '15px'
    },
    h3: {
      fontWeight: '900',
      fontSize: '12px'
    }

  },
  palette: {
    primary: {
      light: '#839bf4',
      main: '#6582f2',
      dark: '#465ba9',
      contrastText: '#fff',
      //could customize the h1 variant as well
    },
    secondary: {
      main: '#fff',
    },
    background: {
      default: "#fafbff",
    }
  },

});
