import React from "react";
import { Grid, InputLabel } from "@material-ui/core";

import AddCompanyForm from "./AddCompanyForm";
import UserCompany from "./UserCompany";

const CompanyForms = ({
  classes,
  userCompanies,
  removeCompany,
  addCompany,
}) => {
  return (
    <Grid item sm={12} className={classes.formFieldContainer}>
      <Grid className={classes.fieldLabel}>
        <InputLabel>
          <h2>Your Companies</h2>
        </InputLabel>
      </Grid>
      <Grid className={classes.formsWrapper}>
        {userCompanies.map((company) => (
          <UserCompany
            classes={classes}
            name={company.name}
            key={company.id}
            removeCompany={removeCompany}
          />
        ))}
        <AddCompanyForm classes={classes} addCompany={addCompany} />
      </Grid>
    </Grid>
  );
};

export default CompanyForms;
