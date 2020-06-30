import React, { useState, } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  mainContainer: {
    border: '1px solid white',
    borderRadius: '5px',
    boxShadow: '0 2px 4px 0 gray',
    backgroundColor: 'white',
    marginTop: '100px',
    width: '900px',
  }
}));

export default function SignupLogin(props) {
  const classes = useStyles();
  const loginSignup = props.location.pathname

  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const createAccount = event => {
    event.preventDefault()
    // console.log(email, company, password)
    let passedFields = true
    if (email === '' || company === '' || password === '') {
      setErrorMessage('Please fill in all fields')
      passedFields = false
    }

    if (!validateEmail(email)) {
      setErrorMessage('incorrect email')
      passedFields = false
    }
    if (password.length < 6) {
      setErrorMessage('Please enter a password longer than 6 characters')
      passedFields = false
    }
    if (!passedFields) {
      setOpen(true)
      return
    }

    const { history } = props
    history.push('/login')
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={event => { setEmail(event.target.value) }}
          />
          {loginSignup === '/signup' ?
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="CompanyName"
              label="Company Name"
              id="CompanyName"
              onChange={event => { setCompany(event.target.value) }}
            />
            :
            ''
          }

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={event => { setPassword(event.target.value) }}
          />
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="primary"
            className={classes.submit}
          >
            {loginSignup === '/signup' ? 'Create' : 'Log In'}

          </Button>
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
