import React from 'react';
import AppBar from '@material-ui/core/AppBar/AppBar';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { Link, useLocation } from 'react-router-dom';

const useStyles = makeStyles({
  'app-bar': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  'add-cake': {
    position: 'absolute',
    right: 5,
    top: 5,
    color: '#fff',
  },
});

export default () => {
  const { pathname } = useLocation();
  const classes = useStyles();

  return (
    <AppBar className={classes['app-bar']} position="relative">
      <Typography variant="h6">Cake Stand</Typography>
      {pathname !== '/new' && <Link to="/new" className={classes['add-cake']} variant="text">Add Cake</Link>}
    </AppBar>
  );
};
