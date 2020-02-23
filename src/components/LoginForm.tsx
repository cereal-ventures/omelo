import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FormControl, Heading, Link } from '@chakra-ui/core';
import FloatingLabelInput from './FloatLabelInput';
import PrimaryButton from './PrimaryButton';
import { signIn } from '../services';

export default function LoginForm({ loading }: { loading: boolean }) {
  const { handleSubmit, register } = useForm();
  const history = useHistory();
  const [error, setError] = useState(null);

  return (
    <form
      onSubmit={handleSubmit(({ email, password }) => {
        signIn(email, password)
          .then(() => {
            history.push('/');
          })
          .catch(({ message }) => {
            setError(message);
          });
      })}
    >
      <Heading as='h2' size='lg' fontWeight='light' textAlign='center'>
        Welcome Back
      </Heading>
      <Heading as='h6' size='sm' fontWeight='light' textAlign='center' my='2'>
        It's nice to see you again
      </Heading>
      <FloatingLabelInput
        name='email'
        type='email'
        label='Email:'
        my={8}
        register={register}
        error={error}
      />
      <FloatingLabelInput
        name='password'
        type='password'
        label='Password:'
        my={8}
        register={register}
        error={error}
      />
      <FormControl textAlign='center' my={4}>
        <PrimaryButton type='submit' isLoading={loading}>
          Login
        </PrimaryButton>
      </FormControl>
      <Link
        as='button'
        color='brand.secondary'
        textAlign='center'
        display='inline-block'
        width='100%'
        onClick={() => history.push('/signup')}
      >
        Need to create an account?
      </Link>
    </form>
  );
}
