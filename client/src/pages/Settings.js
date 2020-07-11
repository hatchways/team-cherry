import React, { useState, useEffect, useReducer } from "react";
import { makeStyles, Grid } from "@material-ui/core";

import axios from "axios";

import SidePanel from "../components/settings/SidePanel";
import SettingsContent from "../components/settings/SettingsContent";

import {
  SettingsContext,
  settingsReducer,
  settingsInitialState,
} from "../utils/settings-context";
import { getUser, storeUser } from "../utils/localStorage";

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
  const [userCompanies, setUserCompanies] = useState([]);
  const [user, setUser] = useState(getUser());

  const [state, dispatch] = useReducer(settingsReducer, settingsInitialState);

  // api fetch
  useEffect(() => {
    async function getCompanies() {
      const res = await axios.get("/api/company");
      // setUserCompanies(res.data.companies);
      dispatch({ type: "get_companies", payload: res.data.companies });
    }
    getCompanies();
  }, []);

  const onChangeTabs = (event, newValue) => {
    setTabIndex(newValue);
  };

  const removeCompanyFromUser = async (companyName) => {
    // note the delete method is the only method where if you require request body data
    // you have to do it in this way, other methods let you pass in a javascript object directly
    // without having to preface with data
    await axios.delete("/api/company", { data: { name: companyName } });
    setUserCompanies(
      userCompanies.filter((company) => company.name !== companyName)
    );
  };

  const updateSubscriberEmail = async (email) => {
    await axios.put("/api/users/subscribe-mail/update", {
      subscriberEmail: email,
    });
    // update user object on client
    storeUser({ ...user, subscriberEmail: email });
  };

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      <Grid container className={classes.container}>
        <SidePanel
          setTabIndex={onChangeTabs}
          currentTabIndex={currentTabIndex}
        />
        <SettingsContent
          currentTabIndex={currentTabIndex}
          user={user}
          removeCompany={removeCompanyFromUser}
          updateSubEmail={updateSubscriberEmail}
        />
      </Grid>
    </SettingsContext.Provider>
  );
};

export default Settings;
