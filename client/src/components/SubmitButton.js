import React from 'react';
import Button from '@material-ui/core/button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: `${theme.palette.primary.main}`,
    color: `${theme.palette.primary.contrastText}`,
  },
}));


const SubmitButton = ({ children }) => {
  const classes = useStyles();

  return (
    <Button
      type='submit'
      fullWidth
      variant='contained'
      color='primary'
      className={`${classes.button}`}
    >{children}</Button>
  );
};

export default SubmitButton;
