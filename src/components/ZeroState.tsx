import React from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Input } from '@chakra-ui/core';

import { addProject } from '../services/data';

export default function ZeroState() {
  const { register, handleSubmit } = useForm();

  const submit = handleSubmit(({ firstProjectTitle }) => {
    addProject({ name: firstProjectTitle });
  });
  return (
    <Grid
      width='100%'
      height='100vh'
      alignItems='center'
      justifyItems='center'
      px={4}
    >
      <form
        onBlur={submit}
        onSubmit={submit}
        style={{ width: '100%', maxWidth: '320px' }}
      >
        <Input
          ref={register({ required: true })}
          name='firstProjectTitle'
          focusBorderColor='brand.secondary'
          variant='flushed'
          placeholder='Enter a project name to get started'
          width='100%'
          textAlign='center'
        />
      </form>
    </Grid>
  );
}
