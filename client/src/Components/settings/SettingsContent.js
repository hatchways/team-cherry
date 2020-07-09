import React from "react";
import { useHistory } from "react-router-dom";

import { Grid, Button, Typography, makeStyles } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";

import TabPanel from "./content-panels/TabPanel";
import CompanyContentPanel from "./content-panels/CompanyContentPanel";
import SecurityContentPanel from "./content-panels/SecurityContentPanel";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: "3%",
    backgroundColor: "#d3f5f5",
    display: "flex",
    flexDirection: "column",
  },
}));

const SettingsContent = ({ currentTabIndex, userCompanies }) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Grid item container xs={9} className={classes.content}>
      <Grid xs={1}>
        <Button onClick={() => history.goBack()}>
          <HomeIcon />
          <Typography>Go Back</Typography>
        </Button>
      </Grid>
      <TabPanel currentTabIndex={currentTabIndex} index={0}>
        <CompanyContentPanel userCompanies={userCompanies} />
      </TabPanel>
      <TabPanel currentTabIndex={currentTabIndex} index={1}>
        <SecurityContentPanel />
      </TabPanel>
      <TabPanel currentTabIndex={currentTabIndex} index={2}>
        <h1>You are logging off..</h1>
      </TabPanel>
    </Grid>
  );
};

export default SettingsContent;
