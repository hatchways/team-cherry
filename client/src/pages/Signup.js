import React, { useState, } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import SubmitButton from '../components/SubmitButton'
import CustomTextField from '../components/CustomTextField'
import axios from 'axios'


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

export default function Signup(props) {
  const classes = useStyles();
  const loginSignup = props.location.pathname

  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const createAccount = async (event) => {
    try {
      event.preventDefault()
      let passedFields = true

      //error handling here for fields
      if (!validateEmail(email)) {
        setErrorMessage('Please enter a valid email')
        passedFields = false

      }
      if (password.length < 7) {
        setErrorMessage('Please enter a password longer than 7 characters')
        passedFields = false
      }
      if (email === '' || company === '' || password === '') {
        setErrorMessage('Please fill in all fields')
        passedFields = false
      }
      if (!passedFields) {
        setOpen(true)
        return
      }

      //if frontend validations pass, make server call here to create user
      const res = await axios.get('welcome', {
        email: email,
        password: password,
        company: company
      })
      if (res.status === 400) {
        setErrorMessage('That email already exists. Please choose another')
        setOpen(true)
        return
      }
      if (res.data.user) {
        const { history } = props
        history.push('/main')
      }

    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Container className={classes.mainContainer} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {loginSignup === '/signup' ?
          <React.Fragment>
            <Typography variant="h1">
              Lets Get Started!
        </Typography>
            <Typography >
              Create an account
        </Typography>
          </React.Fragment>
          :
          <React.Fragment>
            <Typography variant="h1">
              Welcome Back!
        </Typography>
          </React.Fragment>
        }
        <form className={classes.form} onSubmit={createAccount} noValidate>
          <CustomTextField
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"

            onChange={event => { setEmail(event.target.value) }}
          />
          {loginSignup === '/signup' ?
            <CustomTextField
              name="CompanyName"
              label="Company Name"
              id="CompanyName"
              onChange={event => { setCompany(event.target.value) }}
            />
            :
            ''
          }
          <CustomTextField
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={event => { setPassword(event.target.value) }}
          />
          <SubmitButton>
            {loginSignup === '/signup' ? 'Create' : 'Log In'}
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
