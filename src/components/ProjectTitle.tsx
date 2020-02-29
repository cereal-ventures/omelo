import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Heading, Box, Input, Button } from '@chakra-ui/core';

import { updateProject } from '../services/data';

export default function ProjectTitle({
  projectName,
  projectId,
  setIsPanelOpen
}: {
  projectName: string;
  projectId: string;
  setIsPanelOpen: () => void;
}) {
  const { register, handleSubmit } = useForm();
  const [isEditing, setIsEditing] = useState(false);

  const submit = handleSubmit(({ projectTitle }) => {
    if (projectTitle.trim()) {
      updateProject({ projectId, payload: { name: projectTitle } }).then(() => {
        setIsEditing(false);
      });
    } else {
      setIsEditing(false);
    }
  });
  return (
    <Box
      display='flex'
      alignItems='center'
      p={8}
      position='fixed'
      width='100%'
      top='0px'
    >
      <Button
        size='xs'
        fontSize='md'
        display={{ md: 'none' }}
        mr={4}
        onClick={setIsPanelOpen}
      >
        &#9776;
      </Button>
      {!isEditing ? (
        <Heading size='sm' onClick={() => setIsEditing(true)}>
          {projectName}
        </Heading>
      ) : (
        <form onBlur={submit} onSubmit={submit}>
          <Input
            ref={(el: any) => {
              register(el);
              if (el) el.focus();
            }}
            name='projectTitle'
            focusBorderColor='brand.secondary'
            variant='flushed'
            placeholder={projectName}
          />
        </form>
      )}
    </Box>
  );
}
