import React from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Input } from '@chakra-ui/core';

import { addProject, UserEmail } from '../services/data';

export default function ZeroState({ userEmail }: { userEmail: UserEmail }) {
  const { register, handleSubmit } = useForm();

  const submit = handleSubmit(({ firstProjectTitle }) => {
    if (userEmail) {
      addProject({ name: firstProjectTitle, userEmail });
    }
  });
  return (
    <Grid width='100%' height='100vh' alignItems='center' justifyItems='center'>
      <form onBlur={submit} onSubmit={submit}>
        <Input
          ref={register({ required: true })}
          name='firstProjectTitle'
          focusBorderColor='brand.secondary'
          variant='flushed'
          placeholder='Enter a project name to get started'
          width='240px'
        />
      </form>
    </Grid>
  );
}
