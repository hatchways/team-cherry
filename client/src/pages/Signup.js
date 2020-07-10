import React, { useState } from "react";
import {
  CssBaseline,
  Typography,
  makeStyles,
  Container,
} from "@material-ui/core/";

import SubmitButton from "../components/SubmitButton";
import CustomTextField from "../components/CustomTextField";
import axios from "axios";
import { getUser } from "../utils/localStorage";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  mainContainer: {
    border: "1px solid white",
    borderRadius: "5px",
    boxShadow: "0 2px 4px 0 gray",
    backgroundColor: "white",
    width: "900px",
    marginTop: "150px",
  },
}));

export default function Signup(props) {
  const classes = useStyles();
  const loginSignup = props.location.pathname;

  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [emailErrMsg, setEmailErrMsg] = useState("");
  const [company, setCompany] = useState("");
  const [companyErr, setCompanyErr] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState(false);

  //helps with persisted login status
  if (getUser()) {
    const { history } = props;
    history.push("/main");
  }
  const createAccount = async (event) => {
    try {
      event.preventDefault();
      setEmailErr(false);
      setCompanyErr(false);
      setPasswordErr(false);

      //error handling here for fields
      if (!validateEmail(email)) {
        setEmailErr(true);
        setEmailErrMsg("Please enter a valid email address");
        return;
      }
      if (company === "") {
        setCompanyErr(true);
        return;
      }
      if (password.length < 7) {
        setPasswordErr(true);
        return;
      }

      //if frontend validations pass, make server call here to create user
      const res = await axios.post("api/users/register", {
        email: email,
        password: password,
        company: company,
      });
      if (res === "That email already exists") {
        setEmailErr(true);
        setEmailErrMsg("That email already exists");
        return;
      }

      const { history } = props;
      history.push("/main");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Container
        className={classes.mainContainer}
        component="main"
        maxWidth="xs"
      >
        <div className={classes.paper}>
          {loginSignup === "/signup" ? (
            <React.Fragment>
              <Typography variant="h1">Lets Get Started!</Typography>
              <Typography>Create an account</Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography variant="h1">Welcome Back!</Typography>
            </React.Fragment>
          )}
          <form className={classes.form} onSubmit={createAccount} noValidate>
            <CustomTextField
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              error={emailErr}
              helperText={emailErrMsg}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            {loginSignup === "/signup" ? (
              <CustomTextField
                name="CompanyName"
                label="Company Name"
                id="CompanyName"
                error={companyErr}
                helperText={companyErr ? "Please enter your company" : ""}
                onChange={(event) => {
                  setCompany(event.target.value);
                }}
              />
            ) : (
              ""
            )}
            <CustomTextField
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              error={passwordErr}
              helperText={
                passwordErr
                  ? "Please enter a password longer than 7 characters"
                  : ""
              }
            />
            <SubmitButton>
              {loginSignup === "/signup" ? "Create" : "Log In"}
            </SubmitButton>
          </form>
        </div>
      </Container>
    </div>
  );
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
