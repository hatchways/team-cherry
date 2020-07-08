//TODO This file is getting huge... need to refacting into smaller pieces

import React from "react";
import {
  Button,
  TextField,
  Grid,
  makeStyles,
  InputLabel,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  fieldLabel: {
    width: "30%",
  },
  formsWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "70%",
    justifyContent: "space-around",
  },
  formFieldContainer: {
    width: "60%",
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
    width: "10%",
    borderRadius: "25px",
  },
}));

const CompanyContentPanel = (props) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.container}>
      <Grid className={classes.formFieldContainer}>
        <Grid className={classes.fieldLabel}>
          <InputLabel>
            <h2>Your Companies</h2>
          </InputLabel>
        </Grid>
        <Grid className={classes.formsWrapper}>
          <Grid className={classes.inputWrapper}>
            <TextField
              variant="outlined"
              className={classes.formField}
              value="Your existing Company"
              disabled={true}
              InputProps={{
                style: {
                  fontWeight: "bold",
                },
                endAdornment: (
                  <Button
                    varaint="contained"
                    color="primary"
                    className={classes.btn}
                  >
                    Remove
                  </Button>
                ),
              }}
            />
          </Grid>
          <Grid className={classes.inputWrapper}>
            <TextField
              variant="outlined"
              className={classes.formField}
              label="Company Name"
              InputLabelProps={{
                style: {
                  fontWeight: "bold",
                },
              }}
              InputProps={{
                style: {
                  fontWeight: "bold",
                },
                endAdornment: (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.btn}
                  >
                    Add
                  </Button>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.formFieldContainer}>
        <Grid className={classes.fieldLabel}>
          <InputLabel>
            <h2>Weekly Report</h2>
          </InputLabel>
        </Grid>
        <Grid className={classes.formsWrapper}>
          <Grid className={classes.inputWrapper}>
            <TextField
              variant="outlined"
              className={classes.formField}
              value="yoursubmail@emails.com"
              InputProps={{ style: { fontWeight: "bold" } }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" className={classes.btn}>
        Save
      </Button>
    </Grid>
  );
};

export default CompanyContentPanel;
