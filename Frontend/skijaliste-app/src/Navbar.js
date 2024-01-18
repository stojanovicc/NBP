import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#427D9D'}}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SkiExplorer
        </Typography>
        <Tabs>
          <Tab label="Početna" component={Link} to="/" sx={{ color: 'white'}}/>
          <Tab label="Skijalista" component={Link} to="/Skijalista" sx={{ color: 'white' }}/>
          <Tab label="Aktivnosti" component={Link} to="/Aktivnost" sx={{ color: 'white' }}/>
          <Tab label="Kontakt" component={Link} to="/Kontakt" sx={{ color: 'white' }}/>
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;