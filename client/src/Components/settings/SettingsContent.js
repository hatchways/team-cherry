import React from "react";
import { Grid, makeStyles } from "@material-ui/core";

import TabPanel from "./TabPanel";
import CompanyContentPanel from "./CompanyContentPanel";
import SecurityContentPanel from "./SecurityContentPanel";

const useStyles = makeStyles((theme) => ({
  content: {
    paddingLeft: "10%",
    paddingTop: "1%",
    backgroundColor: "#d3f5f5",
    display: "flex",
    flexDirection: "column",
  },
}));

const SettingsContent = ({ currentTabIndex }) => {
  const classes = useStyles();
  return (
    <Grid item container xs={9} className={classes.content}>
      <h1>Main Content</h1>
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
