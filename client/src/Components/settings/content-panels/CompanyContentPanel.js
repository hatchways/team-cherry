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
  formFieldContainer: {
    width: "45%",
    display: "flex",
  },
  formField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
    },
    marginLeft: "10px",
    width: "100%",
  },
  fieldLabel: {
    width: "30%",
  },
  inputWrapper: {
    width: "70%",
    display: "flex",
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
      <Button variant="contained" color="primary" className={classes.btn}>
        Save
      </Button>
    </Grid>
  );
};

export default CompanyContentPanel;
