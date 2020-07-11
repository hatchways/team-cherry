import React, { useContext } from "react";
import axios from "axios";
import { Grid, TextField } from "@material-ui/core";

import { SettingsContext } from "../../../utils/settings-context";
import FormButton from "./FormButton";

const UserCompany = ({ classes, name }) => {
  const { dispatch } = useContext(SettingsContext);

  const removeCompanyFromUser = async (companyName) => {
    await axios.delete("/api/company", { data: { name: companyName } });
    dispatch({ type: "remove_company", payload: companyName });
  };

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
              onClick={() => removeCompanyFromUser(name)}
              classes={classes}
            />
          ),
        }}
      />
    </Grid>
  );
};

export default UserCompany;
