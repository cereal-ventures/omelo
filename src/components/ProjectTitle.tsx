import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Heading, Flex, Input, Button, FormControl } from '@chakra-ui/core';
import ShareModal from './ShareModal';
import { updateProject } from '../services/data';

export default function ProjectTitle({
  users = [],
  projectName,
  projectId,
  setIsPanelOpen
}: {
  users: Array<any>;
  projectName: string;
  projectId: string;
  setIsPanelOpen: () => void;
}) {
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      projectTitle: projectName
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  const submit = handleSubmit(({ projectTitle }: any) => {
    if (projectTitle && projectTitle !== projectName) {
      updateProject({ projectId, payload: { name: projectTitle } });
    }
    setIsEditing(false);
  });
  return (
    <Flex
      position='fixed'
      alignItems='center'
      justifyContent='space-between'
      width={{ xs: '100%', md: 'calc(100% - 275px)' }}
      top='0px'
      p={8}
    >
      <Flex alignItems='center'>
        <Button
          size='xs'
          fontSize='md'
          display={{ md: 'none' }}
          mr={4}
          onClick={setIsPanelOpen}
        >
          &#9776;
        </Button>
        <Heading size='md' onClick={() => setIsEditing(true)}>
          {!isEditing ? (
            projectName
          ) : (
            <form onBlur={submit} onSubmit={submit} autoComplete='off'>
              <FormControl isInvalid={Boolean(errors.projectTitle)}>
                <Input
                  ref={(el: any) => {
                    register(el);
                    if (el) el.focus();
                  }}
                  fontSize='inherit'
                  color='inherit'
                  fontWeight='inherit'
                  name='projectTitle'
                  variant='unstyled'
                  placeholder={projectName}
                />
              </FormControl>
            </form>
          )}
        </Heading>
      </Flex>
      <ShareModal
        projectId={projectId}
        users={users}
        projectName={projectName}
      />
    </Flex>
  );
}
