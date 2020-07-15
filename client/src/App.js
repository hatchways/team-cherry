import React, { useState, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { theme } from "./themes/theme";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Settings from "./pages/Settings";
import Header from "./components/Header";
import { eraseUser, getUser } from "./utils/localStorage";
import { loginInterceptor, AxiosInterceptor } from "./utils/authAxios";
import Snackbar from "@material-ui/core/Snackbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";
import "./index.css";
import { SearchTerm } from "./utils/SearchContext";
// import "fontsource-roboto";

function App() {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [protectedRoutes, unhideProtectedRoutes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  //adds an interceptor to check requests. If a request is sent with a 401, user is erased and send back to login
  const unauthorized = () => {
    eraseUser();
    setOpen(true);
    setErrorMessage("Logged out due to authorization failure");
    //user is erased, which should lead them back to login, they will not have access to routes if their localstorage is empty.Snackbar should also open up telling them what happened.
    console.log("logging out due to authorization failure");
  };
  const userLogin = () => {
    unhideProtectedRoutes("unhide");
  };

  const isAuthorized = () => {
    if (getUser()) {
      return true
    }
    else return false
  }
  //this interceptor catches 401s
  AxiosInterceptor(unauthorized, isAuthorized);

  //this interceptor stores user on storage, then unhides protected routes.
  loginInterceptor(userLogin);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <SearchTerm.Provider value={{ searchTerm, setSearchTerm }}>
          <Header />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            {/* routes should be inaccessible after here if token doesn't exist*/}
            {isAuthorized() ? (
              <Route exact path="/main" component={Main} />
            ) : (
                <Redirect to="/signup" />
              )}
            <Route render={() => <Redirect to="/login" />} />
          </Switch>
        </SearchTerm.Provider>
      </BrowserRouter>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
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
