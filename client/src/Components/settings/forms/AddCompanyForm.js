import React from "react";
import { TextField, Grid } from "@material-ui/core";
import FormButton from "./FormButton";

const AddCompanyForm = ({ classes }) => {
  return (
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
            <FormButton
              label="Add"
              onClick={() => console.log("add")}
              classes={classes}
            />
          ),
        }}
      />
    </Grid>
  );
};

export default AddCompanyForm;
