import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    marginRight: '10px'
  },
  leftContainer: {
    display: 'flex'
  },
  // login: {
  //   color: 'white',
  //   border: '1px solid white'
  // }
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            mentionsCrawler
          </Typography>
          {/* <div className={classes.leftContainer}>
            <Typography variant="h6" className={classes.title}>
              Already have an account?
              </Typography>
            <Button className={classes.login} variant="outlined">Log In</Button>
          </div> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}
