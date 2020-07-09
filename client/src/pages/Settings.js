import React, { useState, useEffect } from "react";
import { makeStyles, Grid } from "@material-ui/core";

import axios from "axios";

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
  const [userCompanies, setUserCompanies] = useState([]);

  // api fetch
  useEffect(() => {
    async function getCompanies() {
      const res = await axios.get("/api/company");
      setUserCompanies(res.data.companies);
    }
    getCompanies();
  }, []);

  const onChangeTabs = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Grid container className={classes.container}>
      <SidePanel setTabIndex={onChangeTabs} currentTabIndex={currentTabIndex} />
      <SettingsContent
        currentTabIndex={currentTabIndex}
        userCompanies={userCompanies}
      />
    </Grid>
  );
};

export default Settings;
