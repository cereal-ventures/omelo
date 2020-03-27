import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  FormControl,
  Heading,
  Button,
  Divider,
  Box,
  Text,
  Stack
} from '@chakra-ui/core';
import FloatingLabelInput from './FloatLabelInput';
import PrimaryButton from './PrimaryButton';
import { signIn } from '../services';
import GoogleAuthButton from './GoogleAuthButton';

function EmailPasswordLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { errors, handleSubmit, register, setError } = useForm();
  const history = useHistory();

  return (
    <form
      onSubmit={handleSubmit(({ email, password }) => {
        setIsLoading(true);
        signIn(email, password)
          .then(
            () => {
              history.push(`/${history.location.search}`);
            },
            e => Promise.reject(e)
          )
          .catch(({ message }) => {
            setError([
              {
                type: 'noMatch',
                name: 'network',
                message
              }
            ]);
          });
      })}
    >
      <FloatingLabelInput
        name='email'
        type='email'
        label='Email:'
        my={8}
        ref={register}
        error={null}
      />
      <FloatingLabelInput
        name='password'
        type='password'
        label='Password:'
        my={8}
        ref={register}
        error={errors.network}
      />
      <FormControl textAlign='center' my={4}>
        <PrimaryButton type='submit' isLoading={isLoading}>
          Login
        </PrimaryButton>
      </FormControl>
    </form>
  );
}

export default function LoginForm() {
  const history = useHistory();
  return (
    <>
      <Heading as='h2' size='lg' fontWeight='light' textAlign='center'>
        Welcome Back
      </Heading>
      <Heading as='h6' size='sm' fontWeight='light' textAlign='center' my='2'>
        It's nice to see you again
      </Heading>
      <FormControl mt={8}>
        <GoogleAuthButton />
      </FormControl>
      <Stack position='relative' my={8}>
        <Text
          p={1}
          backgroundColor='white'
          position='absolute'
          left='50%'
          top='50%'
          transform='translate(-50%,-50%)'
          zIndex={1}
          fontSize='xs'
        >
          Or
        </Text>
        <Divider />
      </Stack>
      <EmailPasswordLogin />
      <Button
        variant='link'
        color='brand.secondary'
        textAlign='center'
        display='inline-block'
        width='100%'
        onClick={() => history.push(`/signup${history.location.search}`)}
      >
        Need to create an account?
      </Button>
    </>
  );
}
