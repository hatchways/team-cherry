import React from "react";
import { Grid, InputLabel } from "@material-ui/core";

import AddCompanyForm from "./AddCompanyForm";
import UserCompany from "./UserCompany";

const CompanyForms = ({ classes }) => {
  return (
    <Grid item sm={12} className={classes.formFieldContainer}>
      <Grid className={classes.fieldLabel}>
        <InputLabel>
          <h2>Your Companies</h2>
        </InputLabel>
      </Grid>
      <Grid className={classes.formsWrapper}>
        <UserCompany classes={classes} />
        <AddCompanyForm classes={classes} />
      </Grid>
    </Grid>
  );
};

export default CompanyForms;
