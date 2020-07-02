import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import Signup from "./pages/Signup";
import Login from './pages/Login'
import Main from './pages/Main'
import Header from "./pages/Header"
import { getToken } from './utils/localStorage'

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path='/main' component={Main} />
        { /* routes should be inaccessible if token doesn't exist*/}
        {getToken() ?
          <Route path='/main' component={Main} />
          :
          ''}

      </BrowserRouter>
    </MuiThemeProvider>
  );
}
export default App;
