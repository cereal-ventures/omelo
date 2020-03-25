import React from 'react';
import { FormControl, Input, FormErrorMessage } from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import { updateEvent } from '../services/data';

export default function TitleInput({
  projectId,
  eventId,
  title
}: {
  projectId: string;
  eventId: string;
  title: string;
}) {
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      title
    }
  });

  const hasErrors: boolean = Boolean(Object.keys(errors).length);
  const onSubmit = ({ title: updatedTitle }: { [x: string]: any }) => {
    if (!hasErrors && updatedTitle !== title) {
      updateEvent({
        type: 'UPDATE_TITLE',
        projectId,
        eventId,
        payload: {
          title: updatedTitle
        }
      });
    }
  };
  return (
    <FormControl isInvalid={Boolean(errors.title)}>
      <Input
        color='black'
        borderColor='gray.100'
        focusBorderColor='brand.secondary'
        variant='unstyled'
        fontWeight='semibold'
        name='title'
        fontSize='inherit'
        placeholder='Enter Title'
        onBlur={handleSubmit(onSubmit)}
        ref={(ref: any) =>
          register(ref, {
            required: 'Please set a title for your event'
          })
        }
      />
      <FormErrorMessage>
        {errors?.title && 'Please add a title'}
      </FormErrorMessage>
    </FormControl>
  );
}
