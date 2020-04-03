import React, { useEffect, useState, useContext } from 'react';
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
  ModalHeader,
  Icon,
  Input,
  Grid
} from '@chakra-ui/core';
import { updateProject, addUserToProject } from '../services/data';
import { ProjectContext } from './ProjectContext';

function ProjectTeammates({ users = [] }: { users?: Array<any> }) {
  return (
    <Flex mr={4} display={{ xs: 'none', md: 'flex' }}>
      {users.map((user: any, i: number) => {
        const avatarOptions = user.photoUrl ? { backgroundColor: '#fff' } : {};
        return (
          <Tooltip
            key={i}
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
                {...avatarOptions}
              />
            </Box>
          </Tooltip>
        );
      })}
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
  const { permission } = useContext(ProjectContext);

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
      <form
        style={{ width: '100%' }}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete='off'
      >
        <Grid gridTemplateColumns={{ xs: '1fr', md: '2fr 1fr auto' }} gap={2}>
          <Input
            name='email'
            type='email'
            flexGrow={2}
            width='100%'
            placeholder='Email Address'
            size='sm'
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
            flexGrow={1}
            width={{ xs: '100%', md: 'auto' }}
            minWidth={{ md: '120px' }}
            name='permission'
            variant='outline'
            size='sm'
            ref={register}
            zIndex={4}
          >
            <option value='viewer'>View Only</option>
            <option value='commenter'>Can Comment</option>
            {['owner', 'editor'].includes(permission) && (
              <option value='editor'>Can Edit</option>
            )}
          </Select>
          <Button px={6} type='submit' size='sm' variantColor='purple'>
            Share
          </Button>
        </Grid>
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
          variant='outline'
          onClick={() => {
            onOpen();
            updateProject({ projectId, payload: { isPublic: true } });
          }}
        >
          Share Timeline
          <Icon name='link' size='.65em' ml={2} />
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent borderRadius='8px' mx='auto'>
          <ModalCloseButton zIndex={4} />
          <ModalHeader pt={8} pb={4} px={8}>
            <Box textAlign='center'>
              <Heading
                mb={2}
                size='lg'
                color='brand.secondary'
                fontWeight='semibold'
              >
                Share Timeline
              </Heading>
              <Text fontSize='md' fontWeight='light'>
                Anyone with this link can view your timeline
              </Text>
            </Box>
          </ModalHeader>
          <Divider />
          <ModalBody py={4} px={8}>
            <Heading fontSize='12px' textTransform='uppercase' mb={4}>
              Public Link
            </Heading>
            <Grid
              alignItems='center'
              gridTemplateColumns={{ xs: '1fr', md: '1fr auto' }}
              gap={2}
            >
              <Link
                fontWeight='semibold'
                color='brand.secondary'
                href={url}
                target='blank'
              >
                {url}
              </Link>
              <Button
                size='sm'
                display={{ xs: 'none', md: 'block' }}
                variantColor='purple'
                fontWeight='semibold'
                onClick={() => {
                  setIsShared(true);
                }}
              >
                {!isShared ? (
                  <>
                    Copy Link <Icon name='link' ml={2} size='.75em' />
                  </>
                ) : (
                  <span role='img' aria-label='celebrate emoji'>
                    Link Copied 🎉
                  </span>
                )}
              </Button>
            </Grid>
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
          <ModalFooter px={8} pb={12} display='block'>
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
