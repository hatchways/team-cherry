import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import Signup from "./pages/Signup";
import Login from './pages/Login'
import Header from "./pages/Header"

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />

      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
