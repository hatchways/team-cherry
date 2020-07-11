import React, { useState, useContext } from "react";
import axios from "axios";
import { TextField, Grid } from "@material-ui/core";

import FormButton from "./FormButton";
import { SettingsContext } from "../settings-context";

const AddCompanyForm = ({ classes }) => {
  const [input, setInput] = useState("");
  const { state, dispatch } = useContext(SettingsContext);

  const addCompanyToUser = async (companyName) => {
    if (!state.companies.map((c) => c.name).includes(companyName)) {
      const { data } = await axios.post("/api/company", { companyName });
      dispatch({ type: "add_company", payload: data });
    }
  };

  return (
    <Grid className={classes.inputWrapper}>
      <TextField
        variant="outlined"
        className={classes.formField}
        label="Company Name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
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
              onClick={() => {
                addCompanyToUser(input);
                setInput("");
              }}
              color="primary"
              classes={classes}
            />
          ),
        }}
      />
    </Grid>
  );
};

export default AddCompanyForm;
