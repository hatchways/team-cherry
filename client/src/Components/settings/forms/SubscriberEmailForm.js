import React, { useState } from "react";
import axios from "axios";
import { Grid, InputLabel, TextField } from "@material-ui/core";

import FormButton from "../forms/FormButton";
import { getUser, storeUser } from "../../../utils/localStorage";

const SubscriberEmailForm = ({ classes }) => {
  const [user, setUser] = useState(getUser());
  const [input, setInput] = useState(user.subscriberEmail);

  const updateSubscriberEmail = async (email) => {
    await axios.put("/api/users/subscribe-mail/update", {
      subscriberEmail: email,
    });
    // update user object on client
    storeUser({ ...user, subscriberEmail: email });
  };

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
        onClick={() => updateSubscriberEmail(input)}
      />
    </>
  );
};

export default SubscriberEmailForm;
