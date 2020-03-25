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

export const skeletonTimeline = (
  <Grid
    position='relative'
    width='100%'
    justifyItems='center'
    height='100vh'
    overflow='auto'
  >
    <svg overflow='visible' width={20} height='100vh'>
      <rect
        className='timeline'
        fill='#F5F6FC'
        width='100%'
        rx='10'
        height='100%'
      />
    </svg>
  </Grid>
);
