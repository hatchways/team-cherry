import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  field: {
    borderRadius: '25px',
  }
}));

const CustomTextField = ({ name, label, id, type, onChange }) => {
  const classes = useStyles()

  return (
    <TextField
      inputProps={{
        className: classes.field
      }}
      name={`${name}`}
      label={`${label}`}
      id={`${id}`}
      type={`${type}`}
      required
      variant='outlined'
      margin='normal'
      fullWidth
      onChange={onChange}
    />
  )
}

export default CustomTextField
