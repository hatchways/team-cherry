import React, { useContext } from "react";
import { Grid, InputLabel } from "@material-ui/core";

import AddCompanyForm from "./AddCompanyForm";
import UserCompany from "./UserCompany";
import { SettingsContext } from "../../../utils/settings-context";

const CompanyForms = ({ classes, removeCompany }) => {
  const { state } = useContext(SettingsContext);
  return (
    <Grid item sm={12} className={classes.formFieldContainer}>
      <Grid className={classes.fieldLabel}>
        <InputLabel>
          <h2>Your Companies</h2>
        </InputLabel>
      </Grid>
      <Grid className={classes.formsWrapper}>
        {state.companies.map((company) => (
          <UserCompany
            classes={classes}
            name={company.name}
            key={company.id}
            removeCompany={removeCompany}
          />
        ))}
        <AddCompanyForm classes={classes} />
      </Grid>
    </Grid>
  );
};

export default CompanyForms;
