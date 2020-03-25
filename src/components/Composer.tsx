import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Avatar, Flex, Box, Button, Input, Grid } from '@chakra-ui/core';
import { getCurrentUser } from '../services';
import { addComment } from '../services/data';
import AddAttachment from './AddAttatchment';

export default function Composer({
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
    <Box width='100%' position='relative' pr='32px'>
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
          <Grid
            alignItems='center'
            justifyItems='center'
            gridTemplateColumns='auto auto'
            gridGap='4px'
          >
            <Button
              isDisabled={value.length === 0}
              variantColor='purple'
              type='submit'
              size='xs'
              fontWeight='semibold'
            >
              Send
            </Button>
          </Grid>
        </Flex>
      </form>
      <Box
        position='absolute'
        right='0px'
        top='50%'
        transform='translateY(-50%)'
      >
        <AddAttachment eventId={eventId} projectId={projectId} />
      </Box>
    </Box>
  );
}
