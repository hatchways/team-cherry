import React from "react";
import { Grid, TextField } from "@material-ui/core";

import FormButton from "./FormButton";

const UserCompany = ({ classes }) => {
  return (
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
            <FormButton
              label="Remove"
              onClick={() => console.log("remove")}
              classes={classes}
            />
          ),
        }}
      />
    </Grid>
  );
};

export default UserCompany;
