import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import SignupLogin from "./pages/SignupLogin";
import Header from "./pages/Header"

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <Route path='/login' component={SignupLogin} />
        <Route path="/signup" component={SignupLogin} />

      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
