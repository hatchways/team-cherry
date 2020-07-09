import React from "react";
import { Grid, TextField } from "@material-ui/core";

import FormButton from "./FormButton";

const UserCompany = ({ classes, name, removeCompany }) => {
  return (
    <Grid className={classes.inputWrapper}>
      <TextField
        variant="outlined"
        className={classes.formField}
        value={name}
        disabled={true}
        InputProps={{
          style: {
            fontWeight: "bold",
          },
          endAdornment: (
            <FormButton
              label="Remove"
              color="secondary"
              onClick={() => removeCompany(name)}
              classes={classes}
            />
          ),
        }}
      />
    </Grid>
  );
};

export default UserCompany;
