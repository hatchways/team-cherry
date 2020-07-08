import React from "react";
import { makeStyles, Grid, Tabs, Tab } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({
  sidePanel: {
    display: "flex",
    flexDirection: "column",
  },
  sidePanelIcon: {
    marginTop: ".6em",
    marginLeft: ".2em",
  },
  panelHeader: {
    marginLeft: "20%",
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
        >
          <Tab label="Company" />
          <Tab label="Security" />
          <Tab label="Logout" />
        </Tabs>
      </Grid>
    </Grid>
  );
};

export default SettingsSidePanel;
