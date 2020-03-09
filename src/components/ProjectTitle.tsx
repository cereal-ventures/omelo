import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Heading, Flex, Input, Button, Avatar, Box } from '@chakra-ui/core';
import ShareModal from './ShareModal';
import AddUserModal from './AddUserModal';
import { ProjectContext } from './ProjectContext';

import { updateProject } from '../services/data';

function ProjectTeammates({
  users = [],
  projectId,
  projectName
}: {
  projectName: string;
  projectId: string;
  users?: Array<any>;
}) {
  const { permission } = useContext(ProjectContext);
  return permission !== 'viewer' ? (
    <Box position='absolute' top={24}>
      <Heading as='h4' fontSize='12px' textTransform='uppercase' mb={4}>
        Teammates:
      </Heading>
      {users.map((user: any) => (
        <Flex key={user?.uid} mb={4} align='center'>
          <Avatar
            src={user.photoUrl}
            display='block'
            size='xs'
            mr={2}
            name={user.displayName}
          />
          <Box as='span' fontSize='sm' fontWeight='semibold'>
            {user.displayName || user.email}
          </Box>
        </Flex>
      ))}
      <AddUserModal
        users={users.map(user => user?.email)}
        projectId={projectId}
        projectName={projectName}
      />
    </Box>
  ) : null;
}

export default function ProjectTitle({
  projectName,
  projectId,
  setIsPanelOpen,
  users = []
}: {
  projectName: string;
  projectId: string;
  users?: Array<any>;
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
      <ProjectTeammates
        users={users}
        projectName={projectName}
        projectId={projectId}
      />
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
      </Flex>
      <ShareModal projectId={projectId} />
    </Flex>
  );
}
