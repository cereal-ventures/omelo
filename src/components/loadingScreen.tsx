import React from 'react';
import { Grid, Spinner } from '@chakra-ui/core';

export const loadingScreen = (
  <Grid
    templateColumns='1fr'
    height='100vh'
    justifyItems='center'
    alignItems='center'
  >
    <Spinner color='purple' />
  </Grid>
);
