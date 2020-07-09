import React from "react";
import { Button } from "@material-ui/core";

const FormButton = ({ classes, label, onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.btn}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default FormButton;
