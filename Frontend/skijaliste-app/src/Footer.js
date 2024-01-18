import React from 'react';
import { Paper, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Paper elevation={3} sx={{ backgroundColor: '#164863', padding: 0.5, position: 'fixed', bottom: 0, width: '100%' }}>
      <Typography variant="body2" color="white" align="center">
        © 2024 SkiExplorer
      </Typography>
    </Paper>
  );
};

export default Footer;