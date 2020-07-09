import React, { useState } from "react";
import { TextField, Grid } from "@material-ui/core";
import FormButton from "./FormButton";

const AddCompanyForm = ({ classes, addCompany }) => {
  const [input, setInput] = useState("");
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
                addCompany(input);
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
