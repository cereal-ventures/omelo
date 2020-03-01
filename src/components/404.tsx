import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Box, Image, Heading, Button, Text } from '@chakra-ui/core';
import { logo } from './icons';
import img from '../images/404@2x.png';

export default function Page404() {
  return (
    <Grid
      templateColumns='1fr'
      height='100vh'
      justifyItems='center'
      alignItems='center'
    >
      <Grid
        gridTemplateColumns='1fr'
        maxWidth='400px'
        justifyItems='center'
        alignItems='center'
      >
        <Image mb={8} maxWidth='140px' src={img} alt='404 Text Illustration' />
        <Heading mb={4} size='sm' fontWeight='semibold'>
          Whoopsie Daisies...this page doesn’t exist
        </Heading>
        <Text mb={8}>Looking to sign in?</Text>
        <Link to='/signup'>
          <Button
            as='div'
            variant='outline'
            textAlign='center'
            mb={4}
            backgroundColor='neutral.5'
          >
            <Heading as='span' size='sm'>
              Sign Up
            </Heading>
            <Box as='span' transform='scale(.5)' transformOrigin='right center'>
              {logo}
            </Box>
          </Button>
        </Link>
        <Link to='/login'>
          <Heading as='span' size='sm'>
            Log In
          </Heading>
        </Link>
      </Grid>
      <Box position='fixed' top={8} left={8}>
        {logo}
      </Box>
    </Grid>
  );
}
