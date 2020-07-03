import React, { useState, } from 'react';
import { CssBaseline, Typography, makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';

import SubmitButton from '../components/SubmitButton'
import CustomTextField from '../components/CustomTextField'
import axios from 'axios'
import { storeUser } from '../utils/localStorage'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  mainContainer: {
    border: '1px solid white',
    borderRadius: '5px',
    boxShadow: '0 2px 4px 0 gray',
    backgroundColor: 'white',
    marginTop: '100px',
    width: '900px',
  },
}));

export default function Login(props) {
  const classes = useStyles();

  const [email, setEmail] = useState('')
  const [emailErr, setEmailErr] = useState(false)
  const [emailErrMsg, setEmailErrMsg] = useState('')
  const [password, setPassword] = useState('')
  const [passwordErr, setPasswordErr] = useState(false)
  const [passwordErrMsg, setpasswordErrMsg] = useState('')

  const login = async (event) => {
    try {
      event.preventDefault()
      setEmailErr(false)
      setPasswordErr(false)
      if (!validateEmail(email)) {
        setEmailErr(true)
        setEmailErrMsg('Please enter a valid email')
      }
      if (password.length < 7) {
        setPasswordErr(true)
        setpasswordErrMsg('Please enter a password with at least 7 characters')
      }
      if (emailErr || passwordErr) return

      const res = await axios.post('api/users/login', {
        email: email,
        password: password,
      })
      if (res.status === 400) {
        if (res.data.user) {
          setEmailErr(true)
          setEmailErrMsg(res.data.user)
          return
        }
        if (res.data.password)
          setPasswordErr(true)
        setpasswordErrMsg(res.data.password)
        return
      }

      storeUser(res.data.user)

      const { history } = props
      history.push('/main')
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Container className={classes.mainContainer} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <React.Fragment>
          <Typography variant="h1">
            Welcome Back!
        </Typography>
        </React.Fragment>
        <form className={classes.form} onSubmit={login} noValidate>
          <CustomTextField
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            error={emailErr}
            helperText={emailErr ? emailErrMsg : ''}
            onChange={event => { setEmail(event.target.value) }}
          />
          <CustomTextField
            name="password"
            label="Password"
            type="password"
            id="password"
            error={passwordErr}
            helperText={passwordErr ? passwordErrMsg : ''}
            onChange={event => { setPassword(event.target.value) }}
          />
          <SubmitButton>
            Log In
          </SubmitButton>
        </form>
      </div>
    </Container>
  );
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
