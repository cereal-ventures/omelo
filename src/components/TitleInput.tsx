import React, { useState } from 'react';
import { FormControl, Input, FormErrorMessage, Heading } from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import { updateEvent } from '../services/data';

export default function TitleInput({
  isViewOnly,
  projectId,
  eventId,
  title
}: {
  isViewOnly: boolean;
  projectId: string;
  eventId: string;
  title: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
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

    setIsEditing(false);
  };
  const input = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={Boolean(errors.title)}>
        <Input
          color='black'
          variant='unstyled'
          fontWeight='semibold'
          name='title'
          fontSize='inherit'
          placeholder='Enter Title'
          ref={(ref: any) => {
            register(ref, {
              required: 'Please set a title for your event'
            });
            if (ref) ref.focus();
          }}
        />
        <FormErrorMessage>
          {errors?.title && 'Please add a title'}
        </FormErrorMessage>
      </FormControl>
    </form>
  );
  return (
    <Heading
      cursor='pointer'
      as='h2'
      size='lg'
      fontWeight='semibold'
      onClick={() => setIsEditing(!isViewOnly)}
    >
      {isEditing ? input : title}
    </Heading>
  );
}
