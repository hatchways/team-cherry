//TODO This file is getting huge... need to refacting into smaller pieces

import React from "react";
import { Grid, makeStyles } from "@material-ui/core";

import CompanyForms from "../forms/CompanyForms";
import SubscriberEmailForm from "../forms/SubscriberEmailForm";
import FormButton from "../forms/FormButton";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    paddingRight: "10%",
  },
  fieldLabel: {
    width: "15%",
  },
  formsWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "70%",
    justifyContent: "space-around",
  },
  formFieldContainer: {
    display: "flex",
    marginBottom: "40px",
  },
  formField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
    },
    marginLeft: "10px",
    width: "100%",
  },
  inputWrapper: {
    width: "70%",
    display: "flex",
    marginBottom: "10px",
  },
  btn: {
    width: "12%",
    borderRadius: "25px",
  },
}));

const CompanyContentPanel = ({ userCompanies }) => {
  const classes = useStyles();
  return (
    <Grid item container sm={12} className={classes.container}>
      <CompanyForms classes={classes} userCompanies={userCompanies} />
      <SubscriberEmailForm classes={classes} />
      <FormButton
        classes={classes}
        label="Save"
        onClick={() => console.log("save")}
      />
    </Grid>
  );
};

export default CompanyContentPanel;
