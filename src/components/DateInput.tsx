import React from 'react';
import {
  FormControl,
  Flex,
  Icon,
  Input,
  FormErrorMessage
} from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import { updateEvent } from '../services/data';

export default function DateInput({
  eventId,
  projectId,
  date
}: {
  projectId: string;
  eventId: string;
  date: string;
}) {
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      date: new Date(date).toISOString().substr(0, 10)
    }
  });

  const hasErrors: boolean = Boolean(Object.keys(errors).length);
  const onSubmit = ({ date }: { [x: string]: any }) => {
    if (!hasErrors) {
      updateEvent({
        projectId,
        eventId,
        payload: {
          date: new Date(date).toLocaleDateString('en-US', {
            timeZone: 'UTC'
          })
        }
      });
    }
  };
  return (
    <FormControl mb={6} isInvalid={Boolean(errors?.date)}>
      <Flex alignItems='center' color='brand.secondary'>
        <Icon position='relative' name='calendar' marginRight={6} />
        <Input
          color='black'
          fontWeight='semibold'
          variant='flushed'
          borderColor='gray.100'
          focusBorderColor='brand.secondary'
          name='date'
          type='date'
          onBlur={handleSubmit(onSubmit)}
          ref={(ref: any) =>
            register(ref, {
              required: 'Please set a date for your event'
            })
          }
        />
      </Flex>
      <FormErrorMessage>
        {errors?.date && 'Please add a date to your event'}
      </FormErrorMessage>
    </FormControl>
  );
}
