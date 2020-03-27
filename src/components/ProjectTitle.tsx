import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Heading, Flex, Input, Button } from '@chakra-ui/core';
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
        {!isEditing ? (
          <Heading size='md' onClick={() => setIsEditing(true)}>
            {projectName}
          </Heading>
        ) : (
          <form onBlur={submit} onSubmit={submit} autoComplete='off'>
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
      </Flex>
      <ShareModal
        projectId={projectId}
        users={users}
        projectName={projectName}
      />
    </Flex>
  );
}
