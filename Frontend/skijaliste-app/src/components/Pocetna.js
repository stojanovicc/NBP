import React from 'react';
import {Typography, Container, Grid, Paper, Card, CardContent, CardMedia, Button, Slide, Grow, Zoom, Box, } from '@mui/material';
import { Link } from 'react-router-dom';

const Pocetna = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Slide direction="up" in timeout={500}>
        <Card
          sx={{
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 3,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <CardMedia
            component="img"
            height="100%"
            image="https://wallpaperaccess.com/full/83510.jpg"
            alt="Mountain"
          />
        </Card>
        </Slide>
      </Grid>
    </Grid>
  );
};

export default Pocetna;
