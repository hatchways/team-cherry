import React, { useState, useEffect, useReducer, useMemo } from "react";
import { makeStyles, Grid } from "@material-ui/core";

import axios from "axios";

import SidePanel from "../components/settings/SidePanel";
import SettingsContent from "../components/settings/SettingsContent";

import {
  SettingsContext,
  settingsReducer,
  settingsInitialState,
} from "../utils/settings-context";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    marginTop: "1%",
  },
}));

const Settings = (props) => {
  const classes = useStyles();
  const [currentTabIndex, setTabIndex] = useState(0);

  const [state, dispatch] = useReducer(settingsReducer, settingsInitialState);
  const context = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  // api fetch
  useEffect(() => {
    async function getCompanies() {
      const res = await axios.get("/api/company");
      dispatch({ type: "get_companies", payload: res.data.companies });
    }
    getCompanies();
  }, []);

  const onChangeTabs = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <SettingsContext.Provider value={context}>
      <Grid container className={classes.container}>
        <SidePanel
          setTabIndex={onChangeTabs}
          currentTabIndex={currentTabIndex}
        />
        <SettingsContent currentTabIndex={currentTabIndex} />
      </Grid>
    </SettingsContext.Provider>
  );
};

export default Settings;
