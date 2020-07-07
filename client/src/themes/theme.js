import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h1: {
      fontWeight: '900',
      fontSize: '25px'
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
    background: {
      default: "#fafbff",
    }
  },

});
