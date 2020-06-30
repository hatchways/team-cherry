import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";
import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import Main from "./pages/Main";
import "fontsource-roboto";

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route path="/landing" component={LandingPage} />
        <Route path="/" component={Main} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
