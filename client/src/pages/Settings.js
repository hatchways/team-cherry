import React, { useState } from "react";
import { makeStyles, Grid } from "@material-ui/core";

import SidePanel from "../components/settings/SidePanel";
import SettingsContent from "../components/settings/SettingsContent";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
}));

const Settings = (props) => {
  const classes = useStyles();
  const [currentTabIndex, setTabIndex] = useState(0);

  const onChangeTabs = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Grid container className={classes.container}>
      <SidePanel setTabIndex={onChangeTabs} currentTabIndex={currentTabIndex} />
      <SettingsContent currentTabIndex={currentTabIndex} />
    </Grid>
  );
};

export default Settings;
