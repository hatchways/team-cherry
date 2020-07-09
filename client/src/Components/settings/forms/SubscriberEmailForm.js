import React, { useState } from "react";
import { Grid, InputLabel, TextField } from "@material-ui/core";
import FormButton from "../forms/FormButton";

const SubscriberEmailForm = ({ classes, user, updateSubEmail }) => {
  const [input, setInput] = useState(user.subscriberEmail);
  return (
    <>
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              InputProps={{ style: { fontWeight: "bold" } }}
            />
          </Grid>
        </Grid>
      </Grid>
      <FormButton
        classes={classes}
        label="Save"
        color="primary"
        onClick={() => updateSubEmail(input)}
      />
    </>
  );
};

export default SubscriberEmailForm;
