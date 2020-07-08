import React from "react";
import { Grid, makeStyles } from "@material-ui/core";

import TabPanel from "./TabPanel";
import CompanyContentPanel from "./content-panels/CompanyContentPanel";
import SecurityContentPanel from "./content-panels/SecurityContentPanel";

const useStyles = makeStyles((theme) => ({
  content: {
    paddingLeft: "10%",
    paddingTop: "3%",
    backgroundColor: "#d3f5f5",
    display: "flex",
    flexDirection: "column",
  },
}));

const SettingsContent = ({ currentTabIndex }) => {
  const classes = useStyles();
  return (
    <Grid item container xs={9} className={classes.content}>
      <TabPanel currentTabIndex={currentTabIndex} index={0}>
        <CompanyContentPanel />
      </TabPanel>
      <TabPanel currentTabIndex={currentTabIndex} index={1}>
        <SecurityContentPanel />
      </TabPanel>
    </Grid>
  );
};

export default SettingsContent;
