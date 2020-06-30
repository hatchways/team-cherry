import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";
import TextField from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  typography: {
    fontFamily: theme.typography.fontFamily,
  },
  palette: {
    background: theme.palette.primary.main,
  },
}));

export default function Header() {
  const classes = useStyles();
  return (
    <div>
      <AppBar
        className={classes.palette}
        position="static"
        style={{ height: "4em" }}
      >
        <Toolbar>
          <Grid container spacing={0}>
            <Grid item xs={4} style={{ display: "flex", alignItems: "center" }}>
              <Typography className={classes.typography} variant="h6">
                <span style={{ color: "white" }}>mentions</span>
                <span style={{ color: "#191970" }}>crawler.</span>
              </Typography>
            </Grid>

            <Grid
              item
              xs={6}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  borderRadius: 50,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  width: "100%",
                  height: "2.5em",
                }}
              >
                <TextField disableUnderline={true} style={{ width: "100%" }} />
                <SearchIcon style={{ color: "black" }} />
              </div>
            </Grid>

            <Grid
              item
              xs={2}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
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
