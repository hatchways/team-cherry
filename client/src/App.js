import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { theme } from "./themes/theme";
import Signup from "./pages/Signup";
import Login from './pages/Login'
import Main from './pages/Main'
import Header from "./pages/Header"
import { getUser, eraseUser } from './utils/localStorage'
import AxiosInterceptor from './utils/authAxios'
import Snackbar from '@material-ui/core/Snackbar';

import "./App.css";

function App() {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')


  //adds an interceptor to check requests. If a request is sent with a 401, user is erased and send back to login
  const unauthorized = () => {
    eraseUser()
    setOpen(true)
    setErrorMessage('Logged out due to authorization failure')
    //user is erased, which should lead them back to login, they will not have access to routes if their localstorage is empty.Snackbar should also open up telling them what happened.
    console.log('logging out due to authorization failure')

  }

  AxiosInterceptor(unauthorized)


  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          { /* routes should be inaccessible after here if token doesn't exist*/}
          {getUser() ?
            <Route path='/main' component={Main} />
            :
            ''}
          <Route path="/" exact component={Signup} />
          <Route render={() => <Redirect to="/" />} />
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
