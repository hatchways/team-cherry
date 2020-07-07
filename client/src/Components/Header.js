import React from "react";
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
    justifyContent: "flex-start",
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
}));

export default function Header() {
  const classes = useStyles();
  return (
    <div>
      <AppBar position="static" className={classes.AppBar}>
        <Toolbar>
          <Grid container spacing={0}>
            <Grid item xs={4} className={classes.LogoGrid}>
              <Typography variant="h6">
                <span className={classes.fontColorForMentions}>mentions</span>
                <span className={classes.fontColorForCrawler}>crawler.</span>
              </Typography>
            </Grid>

            <Grid item xs={6} className={classes.SearchBarGrid}>
              <div className={classes.SeacrhBarDiv}>
                <TextField
                  disableUnderline={true}
                  className={classes.TextField}
                />
                <SearchIcon className={classes.SearchIcon} />
              </div>
            </Grid>

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
