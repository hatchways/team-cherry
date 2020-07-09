import React from "react";
import { Box } from "@material-ui/core";

const TabPanel = ({ children, currentTabIndex, index, props }) => {
  return (
    <div
      role="tabpanel"
      hidden={currentTabIndex !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {currentTabIndex === index && <Box>{children}</Box>}
    </div>
  );
};

export default TabPanel;
