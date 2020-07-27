import React, { useState } from "react";
import axios from "axios";
import { Grid, InputLabel, TextField } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import FormButton from "../forms/FormButton";
import { getUser, storeUser } from "../../../utils/localStorage";

const SubscriberEmailForm = ({ classes }) => {
  const [user, setUser] = useState(getUser());
  const [input, setInput] = useState(user.subscriberEmail);
  const [open, setOpen] = useState(false);

  const emailOpt = {
    in: "/api/users/subscribe-mail/opt-in",
    out: "/api/users/subscribe-mail/opt-out",
  };

  const toggleEmailOpt = async () => {
    const route = user.emailOptIn ? emailOpt.out : emailOpt.in;
    const {
      data: { optIn },
    } = await axios.put(route);
    storeUser({ ...user, emailOptIn: optIn });
    setUser({ ...user, emailOptIn: optIn });
    setOpen(true);
  };

  const updateSubscriberEmail = async (email) => {
    await axios.put("/api/users/subscribe-mail/update", {
      subscriberEmail: email,
    });
    // update user object on client
    storeUser({ ...user, subscriberEmail: email });
    setUser({ ...user, subscriberEmail: email });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Grid item sm={12} className={classes.formFieldContainer}>
        <Grid className={classes.fieldLabel}>
          <InputLabel>
            <h2> Weekly Report Email Address</h2>
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
      <Grid className={classes.emailButtonsContainer}>
        <FormButton
          classes={classes}
          label="Update Email Address"
          color="primary"
          onClick={() => updateSubscriberEmail(input)}
        />
        <FormButton
          classes={classes}
          label={
            user.emailOptIn
              ? "Opt Out Of Weekly Emails"
              : "Opt In To Receive Weekly Emails"
          }
          color={user.emailOptIn ? "secondary" : "primary"}
          onClick={() => toggleEmailOpt()}
        />
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={
          user.emailOptIn
            ? "Email Subscription Successful!"
            : "You have unsubscribed from weekly emails"
        }
      ></Snackbar>
    </>
  );
};

export default SubscriberEmailForm;
