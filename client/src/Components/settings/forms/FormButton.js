import React from "react";
import { Button } from "@material-ui/core";

const FormButton = ({ classes, label, onClick, color }) => {
  return (
    <Button
      variant="contained"
      color={color}
      className={classes.btn}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default FormButton;
