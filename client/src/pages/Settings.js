import React, { useState, useEffect } from "react";
import { makeStyles, Grid } from "@material-ui/core";

import axios from "axios";

import SidePanel from "../components/settings/SidePanel";
import SettingsContent from "../components/settings/SettingsContent";

import { getUser, storeUser } from "../utils/localStorage";

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
  const [user, setUser] = useState(getUser());

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

  const removeCompanyFromUser = async (companyName) => {
    // note the delete method is the only method where if you require request body data
    // you have to do it in this way, other methods let you pass in a javascript object directly
    // without having to preface with data
    await axios.delete("/api/company", { data: { name: companyName } });
    setUserCompanies(
      userCompanies.filter((company) => company.name !== companyName)
    );
  };

  const addCompanyToUser = async (companyName) => {
    if (!userCompanies.map((c) => c.name).includes(companyName)) {
      const { data } = await axios.post("/api/company", { companyName });
      setUserCompanies([...userCompanies, data]);
    }
  };

  const updateSubscriberEmail = async (email) => {
    await axios.put("/api/users/subscribe-mail/update", {
      subscriberEmail: email,
    });
    // update user object on client
    storeUser({ ...user, subscriberEmail: email });
  };

  return (
    <Grid container className={classes.container}>
      <SidePanel setTabIndex={onChangeTabs} currentTabIndex={currentTabIndex} />
      <SettingsContent
        currentTabIndex={currentTabIndex}
        userCompanies={userCompanies}
        user={user}
        removeCompany={removeCompanyFromUser}
        addCompany={addCompanyToUser}
        updateSubEmail={updateSubscriberEmail}
      />
    </Grid>
  );
};

export default Settings;
