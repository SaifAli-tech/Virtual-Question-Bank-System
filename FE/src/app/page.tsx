"use client";

import React from 'react';
import { Typography, Button, Container, Grid, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        component="main"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: (theme) => theme.spacing(8, 0, 6),
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography component="h1" variant="h2" color="textPrimary" gutterBottom>
            Welcome to the Virtual Question Bank System
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Enhance your examination preparation with our comprehensive question bank system. 
            Manage your questions, track your progress, and get detailed analytics to improve your learning experience.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" sx={{ margin: 2 }}>
                Get Started
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary" sx={{ margin: 2 }}>
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
