import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { theme } from "./themes/theme";
import Signup from "./pages/Signup";
import Login from './pages/Login'
import Main from './pages/Main'
import Header from "./pages/Header"
import { eraseUser } from './utils/localStorage'
import { loginInterceptor, AxiosInterceptor } from './utils/authAxios'
import Snackbar from '@material-ui/core/Snackbar';
import "fontsource-roboto";
import CssBaseline from "@material-ui/core/CssBaseline";

import "./App.css";

function App() {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [protectedRoutes, unhideProtectedRoutes] = useState(false)
  //adds an interceptor to check requests. If a request is sent with a 401, user is erased and send back to login
  const unauthorized = () => {
    eraseUser()
    setOpen(true)
    setErrorMessage('Logged out due to authorization failure')
    //user is erased, which should lead them back to login, they will not have access to routes if their localstorage is empty.Snackbar should also open up telling them what happened.
    console.log('logging out due to authorization failure')
  }

  const userLogin = () => {
    unhideProtectedRoutes(true)
  }

  const unsetProtectedRoutes = () => {
    unhideProtectedRoutes(false)
  }
  //this interceptor catches 401s
  AxiosInterceptor(unauthorized, unsetProtectedRoutes)

  //this interceptor stores user on storage, then unhides protected routes.
  loginInterceptor(userLogin)

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          { /* routes should be inaccessible after here if token doesn't exist*/}
          {protectedRoutes ?
            <Route exact path='/main' component={Main} />
            :
            <Redirect to="/signup" />}
          <Route render={() => <Redirect to="/login" />} />
        </Switch>

      </BrowserRouter>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setOpen(false)}
        autoHideDuration={6000}
        open={open}
        message={errorMessage}
      />
    </MuiThemeProvider>
  );
}
export default App;
