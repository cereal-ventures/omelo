import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  FormControl,
  Heading,
  FormErrorMessage,
  Button
} from '@chakra-ui/core';
import FloatingLabelInput from './FloatLabelInput';
import PrimaryButton from './PrimaryButton';
import { createUser } from '../services';
import { updateUser, addProject } from '../services/data';

export default function SignupForm({ loading }: { loading: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register, errors, setError } = useForm();
  const history = useHistory();
  const hasErrors: boolean = Boolean(Object.keys(errors).length);

  useEffect(() => {
    if (hasErrors) {
      setIsLoading(false);
    }
  }, [hasErrors]);

  return (
    <form
      onSubmit={handleSubmit(
        ({
          signUpEmail: email,
          signUpPassword: password,
          signUpName: name
        }) => {
          if (!hasErrors) {
            setIsLoading(true);
            createUser(email, password)
              .then(
                ({ user }) => user?.updateProfile({ displayName: name }),
                e => Promise.reject(e)
              )
              .then(updateUser)
              .then(() => addProject({ name: 'My First Project' }))
              .then(() => history.push(`/${history.location.search}`))
              .catch(({ message }) => {
                setError([
                  {
                    type: 'noMatch',
                    name: 'network',
                    message
                  }
                ]);
              });
          }
        }
      )}
    >
      <Heading as='h2' size='lg' fontWeight='light' textAlign='center'>
        Let's get you powered up
      </Heading>
      <Heading as='h6' size='sm' fontWeight='light' textAlign='center' my='2'>
        Unlimited project timelines, for $9/month
      </Heading>
      <FloatingLabelInput
        name='signUpName'
        type='text'
        label='Name:'
        my={8}
        error={errors?.signUpName}
        ref={register({ required: 'Name is required' })}
      />
      <FloatingLabelInput
        name='signUpEmail'
        type='email'
        label='Email:'
        my={8}
        error={errors?.signUpEmail}
        ref={register({ required: 'Email is required' })}
      />
      <FloatingLabelInput
        name='signUpPassword'
        type='password'
        label='Password:'
        mb={8}
        error={errors?.signUpPassword}
        ref={register({
          required: 'Your password must be at least 6 characters',
          minLength: {
            value: 6,
            message: 'Your password must be at least 6 characters'
          }
        })}
      />
      <FormControl isInvalid={Boolean(errors?.network)}>
        <FormErrorMessage>
          {(errors['network'] as any)?.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl textAlign='center' my={4}>
        <PrimaryButton type='submit' isLoading={isLoading}>
          Sign Up
        </PrimaryButton>
      </FormControl>
      <Button
        isDisabled={isLoading}
        variant='link'
        color='brand.secondary'
        textAlign='center'
        display='inline-block'
        width='100%'
        onClick={() => history.push(`/login${history.location.search}`)}
      >
        Already have an account?
      </Button>
    </form>
  );
}
