import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Grid,
  Container,
  Button
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";
import TextField from "@material-ui/core/Input";
import { getUser } from "../utils/localStorage";
import { DebounceInput } from "react-debounce-input";
import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  redirectContainer: {
    display: 'flex',
    whiteSpace: "nowrap"
  },
  redirectText: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px'
  },
  redirectButton: {
    borderRadius: '25px'
  },
  fontColorForMentions: {
    color: "white",
  },
  fontColorForCrawler: {
    color: "#191970",
  },
  AppBar: {
    height: "5.4em",
    boxShadow: "none",
  },
  LogoGrid: {
    display: "flex",
    alignItems: "center",
  },
  SearchBarGrid: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  SeacrhBarDiv: {
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    paddingLeft: "10px",
    paddingRight: "10px",
    width: "100%",
    height: "2.5em",
  },
  TextField: {
    width: "100%",
  },
  SearchIcon: {
    color: "black",
  },
  SettingsIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  spacing: {
    justifyContent: "space-between",
  },
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
  const [keywords, setKeywords] = useState("");
  const [redirect, setRedirect] = useState('')

  useEffect(() => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    let keywords = currentUrlParams.get("keywords");
    setKeywords(keywords);
  }, []);

  const handleSearchBar = async (event) => {
    // Set keywords into URL params.
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("keywords", event.target.value);
    history.push(window.location.pathname + "?" + currentUrlParams.toString());
  };
  let pathName = window.location.pathname
  useEffect(() => {
    if (pathName != '/login') {
      setRedirect('Log In')
    }
    else {
      setRedirect('Sign Up')
    }
  }, [pathName])

  const redirectTo = () => {
    if (pathName != '/login') {
      setRedirect('Sign Up')
      history.push('/login')
    }
    else {
      setRedirect('Log In')
      history.push('/signup')
    }
  }
  // const pathname = window.location.pathname
  // if (pathname === '/login') {
  //   console.log(pathname)
  //   setRedirect('on')
  // }


  return (
    <div>
      <AppBar className={classes.AppBar}>
        <Toolbar>
          <Grid container className={classes.spacing} spacing={0}>
            <Grid item xs={4} className={classes.LogoGrid}>
              <Typography variant="h6">
                <span className={classes.fontColorForMentions}>mentions</span>
                <span className={classes.fontColorForCrawler}>crawler.</span>
              </Typography>
            </Grid>

            {getUser() ? (
              <React.Fragment>
                <Grid item xs={6} className={classes.SearchBarGrid}>
                  <div className={classes.SeacrhBarDiv}>
                    <DebounceInput
                      element={TextField}
                      debounceTimeout={300}
                      className={classes.TextField}
                      disableUnderline={true}
                      onChange={handleSearchBar}
                      value={keywords}
                    />
                    <SearchIcon className={classes.SearchIcon} />
                  </div>
                </Grid>
                <Grid item xs={2} className={classes.SettingsIcon}>
                  <Link to="/settings">
                    <IconButton color="inherit">
                      <SettingsIcon />
                    </IconButton>
                  </Link>
                </Grid>
              </React.Fragment>
            ) : (
                <Grid>
                  <Container className={classes.redirectContainer}>
                    <Typography variant='h2' className={classes.redirectText}>
                      {redirect === 'Log In' ? 'Already have an account?' : "Don't have an account?"}
                    </Typography>
                    <Button
                      className={classes.redirectButton}
                      variant="outlined"
                      color="secondary"
                      onClick={redirectTo}
                    >
                      <Typography variant='h3'>
                        {redirect}
                      </Typography>

                    </Button>
                  </Container>
                </Grid>
              )}
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}
