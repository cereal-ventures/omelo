import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Link,
  Box,
  Heading,
  Text,
  Flex,
  Avatar,
  Tooltip,
  Select,
  Divider,
  ModalHeader
} from '@chakra-ui/core';
import { updateProject, addUserToProject } from '../services/data';
import FloatLabelInput from './FloatLabelInput';

function ProjectTeammates({ users = [] }: { users?: Array<any> }) {
  return (
    <Flex mr={4}>
      {users.map((user: any, i: number) => (
        <Tooltip
          key={i}
          zIndex={4}
          hasArrow={true}
          aria-label={user.displayName || user.email}
          label={user.displayName || user.email}
        >
          <Box>
            <Avatar
              src={user.photoUrl}
              display='block'
              size='sm'
              mr={-2}
              name={user.displayName}
            />
          </Box>
        </Tooltip>
      ))}
    </Flex>
  );
}

function InviteUserForm({
  projectId,
  projectName,
  onClose,
  users
}: {
  projectName: string;
  projectId: string;
  users: Array<string>;
  onClose: () => void;
}) {
  const { register, errors, handleSubmit } = useForm();

  const hasErrors = Object.keys(errors).length;
  const onSubmit = ({ email, permission }: any) => {
    if (!hasErrors) {
      addUserToProject({
        email,
        projectId,
        projectName,
        permission
      }).then(onClose);
    }
  };
  return (
    <Box width='100%'>
      <Heading fontSize='12px' textTransform='uppercase' mb={4}>
        Add Teammate
      </Heading>
      <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
        <Flex align='center'>
          <Flex width='100%' position='relative'>
            <FloatLabelInput
              flexGrow={1}
              width='100%'
              name='email'
              type='email'
              label='Email Address'
              error={errors?.email}
              ref={register({
                required: 'A valid email is required',
                validate: value => {
                  if (users.includes(value)) {
                    return 'This user is already added to this project';
                  }
                }
              })}
            />
            <Select
              position='absolute'
              top='8px'
              right={0}
              dir='rtl'
              width='auto'
              name='permission'
              variant='unstyled'
              ref={register}
            >
              <option value='viewer'>View Only</option>
              <option value='commenter'>Can Comment</option>
              <option value='editor'>Can Edit</option>
            </Select>
          </Flex>
          <Button
            px={8}
            ml={4}
            maxWidth='160px'
            type='submit'
            size='sm'
            variantColor='green'
            borderRadius='full'
          >
            Share
          </Button>
        </Flex>
      </form>
    </Box>
  );
}

export default function ShareModal({
  projectId,
  projectName,
  users
}: {
  projectId: string;
  projectName: string;
  users: Array<any>;
}) {
  const [isShared, setIsShared] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const url = `${window.location.protocol}//${window.location.host}/public/${projectId}`;

  useEffect(() => {
    if (isShared) {
      navigator.clipboard.writeText(url);
    }
  }, [isShared, url]);

  useEffect(() => {
    if (!isOpen) {
      setIsShared(false);
    }
  }, [isOpen]);

  return (
    <>
      <Flex align='center'>
        <ProjectTeammates users={users} />
        <Button
          size='sm'
          px={4}
          color='brand.secondary'
          variant='outline'
          borderRadius='full'
          onClick={() => {
            onOpen();
            updateProject({ projectId, payload: { isPublic: true } });
          }}
        >
          Share Project
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent borderRadius='8px' mx='auto'>
          <ModalCloseButton />
          <ModalHeader pt={8} pb={4} px={8}>
            <Box textAlign='center'>
              <Heading
                mb={2}
                size='lg'
                color='brand.secondary'
                fontWeight='semibold'
              >
                Share this project
              </Heading>
              <Text fontSize='md' fontWeight='light'>
                Anyone with this link can view your timeline
              </Text>
            </Box>
          </ModalHeader>
          <Divider />
          <ModalBody px={8}>
            <Heading fontSize='12px' textTransform='uppercase'>
              Public Link
            </Heading>
            <Flex align='center' justify='space-between' width='100%' pt={4}>
              <Link
                fontWeight='semibold'
                color='brand.secondary'
                href={url}
                target='blank'
              >
                {url}
              </Link>
              <Button
                variant='link'
                variantColor='green'
                fontWeight='semibold'
                onClick={() => {
                  setIsShared(true);
                }}
              >
                {!isShared ? (
                  <>Copy Link</>
                ) : (
                  <span role='img' aria-label='celebrate emoji'>
                    🎉 Link Copied
                  </span>
                )}
              </Button>
            </Flex>
          </ModalBody>
          <Divider />
          <ModalBody py={4} px={8}>
            <Heading fontSize='12px' textTransform='uppercase' mb={4}>
              Team
            </Heading>
            {users.map(user => {
              return (
                <Flex
                  align='center'
                  justify='space-between'
                  key={user.uid}
                  mt={2}
                >
                  <Text>{user.displayName}</Text>
                  <Text>{user.permission}</Text>
                </Flex>
              );
            })}
          </ModalBody>
          <Divider />
          <ModalFooter px={8} pb={8}>
            <InviteUserForm
              projectId={projectId}
              projectName={projectName}
              users={users}
              onClose={onClose}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
