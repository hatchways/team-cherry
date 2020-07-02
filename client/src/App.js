import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import Signup from "./pages/Signup";
import Login from './pages/Login'
import Main from './pages/Main'
import Header from "./pages/Header"
import { getUser, eraseUser } from './utils/localStorage'
import AxiosInterceptor from './utils/authAxios'

import "./App.css";

function App(props) {

  const unauthorized = () => {
    eraseUser()//user is erased, which should lead them back to sign up since they don't have access to routes if they their localstorage is empty
    console.log('logging out due to unauthorized user')
    props.history.push('/login')
  }

  AxiosInterceptor(unauthorized)


  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path='/main' component={Main} />
        { /* routes should be inaccessible if token doesn't exist*/}
        {getUser() ?
          <Route path='/main' component={Main} />
          :
          ''}

      </BrowserRouter>
    </MuiThemeProvider>
  );
}
export default App;
