import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Grid,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";
import TextField from "@material-ui/core/Input";
import { getUser } from "../utils/localStorage";
import { DebounceInput } from "react-debounce-input";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  fontColorForMentions: {
    color: "white",
  },
  fontColorForCrawler: {
    color: "#191970",
  },
  AppBar: {
    height: "5.4em",
    boxShadow: "none",
    position: "fixed",
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

  return (
    <div>
      <AppBar position="static" className={classes.AppBar}>
        <Toolbar>
          <Grid container className={classes.spacing} spacing={0}>
            <Grid item xs={4} className={classes.LogoGrid}>
              <Typography variant="h6">
                <span className={classes.fontColorForMentions}>mentions</span>
                <span className={classes.fontColorForCrawler}>crawler.</span>
              </Typography>
            </Grid>

            {getUser() ? (
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
            ) : (
              <Grid>
                <div></div>
              </Grid>
            )}

            <Grid item xs={2} className={classes.SettingsIcon}>
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}
