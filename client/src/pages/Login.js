import React, { useState, } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
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
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const login = async (event) => {
    try {
      event.preventDefault()
      let passedFields = true
      if (email === '' || password === '') {
        setErrorMessage('Please fill in all fields')
        passedFields = false
      }

      if (!validateEmail(email)) {
        setErrorMessage('Please enter your email')
        passedFields = false
      }
      if (password.length < 7) {
        setErrorMessage('Please enter your password')
        passedFields = false
      }
      if (!passedFields) {
        setOpen(true)
        return
      }
      const res = await axios.post('api/users/register', {
        email: email,
        password: password,
      })

      storeUser(res.body.user)//this is untested right now, but general idea is to just set token received from server to localstorage

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

            onChange={event => { setEmail(event.target.value) }}
          />
          <CustomTextField
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={event => { setPassword(event.target.value) }}
          />
          <SubmitButton>
            Log In
          </SubmitButton>
        </form>
      </div>
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
    </Container>
  );
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
