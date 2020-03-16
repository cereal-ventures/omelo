import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Avatar, Flex, Box, Button, Input } from '@chakra-ui/core';
import { getCurrentUser } from '../services';
import { addComment } from '../services/data';

export default function CommentInput({
  eventId,
  projectId
}: {
  eventId: string;
  projectId: string;
}) {
  const [value, setValue] = useState('');
  const user = getCurrentUser();
  const { register, handleSubmit, errors } = useForm();

  const hasErrors = Object.keys(errors).length;
  return (
    <Box width='100%'>
      <form
        autoComplete='off'
        onSubmit={handleSubmit(({ comment }, e) => {
          if (!hasErrors) {
            addComment({ eventId, projectId, comment, resolved: false }).then(
              () => {
                e?.target.reset();
                setValue('');
              }
            );
          }
        })}
      >
        <Flex align='center'>
          <Avatar
            size='xs'
            name={user?.displayName || ''}
            src={user?.photoURL || ''}
          />
          <Box mx={2} flexGrow={1} position='relative' top='-1px'>
            <Input
              onChange={(e: any) => setValue(e.target.value)}
              fontSize='14px'
              fontWeight='semibold'
              placeholder='Add comment...'
              name='comment'
              variant='unstyled'
              ref={register({ required: '' })}
            />
          </Box>
          {value.length >= 1 && (
            <Button
              variantColor='purple'
              type='submit'
              size='xs'
              fontWeight='semibold'
            >
              Send
            </Button>
          )}
        </Flex>
      </form>
    </Box>
  );
}