import React from "react";
import { useHistory } from "react-router-dom";

import { Grid, makeStyles, Tab, Tabs } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

import axios from "axios";

import { eraseUser } from "../../utils/localStorage";

const useStyles = makeStyles((theme) => ({
  sidePanel: {
    display: "flex",
    flexDirection: "column",
    marginTop: "3%",
  },
  sidePanelIcon: {
    marginTop: ".6em",
    marginLeft: ".2em",
  },
  panelHeader: {
    marginLeft: "40%",
    display: "flex",
    flexDirection: "row",
  },
  panelTabs: {
    display: "flex",
    flexDirection: "column",
  },
}));

const SettingsSidePanel = ({ setTabIndex, currentTabIndex }) => {
  const classes = useStyles();
  const history = useHistory();

  const logoutUser = async (e) => {
    e.preventDefault();
    await axios.post("api/users/logout");
    eraseUser();
    history.push("/login");
  };

  return (
    <Grid item xs={3} container className={classes.sidePanel}>
      <Grid item className={classes.panelHeader}>
        <h1>Settings</h1>
        <SettingsIcon
          color="primary"
          fontSize="large"
          className={classes.sidePanelIcon}
        />
      </Grid>
      <Grid item>
        <Tabs
          orientation="vertical"
          indicatorColor="primary"
          value={currentTabIndex}
          onChange={setTabIndex}
          variant="fullWidth"
        >
          <Tab label="Company" />
          <Tab label="Security" />
          <Tab onClick={logoutUser} label="Logout" />
        </Tabs>
      </Grid>
    </Grid>
  );
};

export default SettingsSidePanel;
