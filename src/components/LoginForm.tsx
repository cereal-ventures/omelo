import React from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FormControl, Heading, Link } from '@chakra-ui/core';
import FloatingLabelInput from './FloatLabelInput';
import PrimaryButton from './PrimaryButton';
import { signIn } from '../services';

export default function LoginForm({ loading }: { loading: boolean }) {
  const { errors, handleSubmit, register, setError } = useForm();
  const history = useHistory();

  return (
    <form
      onSubmit={handleSubmit(({ email, password }) => {
        signIn(email, password)
          .then(
            () => {
              history.push('/');
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
