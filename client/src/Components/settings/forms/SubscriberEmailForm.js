import React from "react";
import { Grid, InputLabel, TextField } from "@material-ui/core";

const SubscriberEmailForm = ({ classes }) => {
  return (
    <Grid item sm={12} className={classes.formFieldContainer}>
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
  );
};

export default SubscriberEmailForm;
