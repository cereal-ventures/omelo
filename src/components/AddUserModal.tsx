import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Heading,
  Text,
  ModalHeader,
  Stack,
  Select
} from '@chakra-ui/core';
import { addUserToProject } from '../services/data';
import FloatLabelInput from './FloatLabelInput';
import { ProjectContext } from './ProjectContext';

export default function AddUserModal({
  projectId,
  projectName,
  users
}: {
  projectId: string;
  projectName: string;
  users: Array<string>;
}) {
  const { permission } = useContext(ProjectContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, errors, handleSubmit } = useForm();

  const hasErrors = Object.keys(errors).length;
  const onSubmit = ({ name, email, permission }: any) => {
    if (!hasErrors) {
      addUserToProject({
        name,
        email,
        projectId,
        projectName,
        permission
      }).then(onClose);
    }
  };

  return permission === 'owner' ? (
    <>
      <Button
        size='xs'
        px={4}
        color='brand.secondary'
        variant='link'
        onClick={onOpen}
        textTransform='uppercase'
      >
        + Add New
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={8} mx='auto' maxWidth='450px'>
          <ModalCloseButton />
          <ModalHeader textAlign='center'>
            <Heading
              mb={2}
              size='lg'
              color='brand.secondary'
              fontWeight='semibold'
            >
              Add A Teammate
            </Heading>
            <Text fontWeight='light' fontSize='md'>
              This will send them an email invitation to join this project.
            </Text>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FloatLabelInput
                name='name'
                type='text'
                label='Full Name'
                error={errors?.name}
                ref={register({ required: 'Please provide a name' })}
              />
              <FloatLabelInput
                mt={8}
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
              <Select name='permission' mt={8} variant='flushed' ref={register}>
                <option value='viewer'>Can view</option>
                <option value='commenter'>Can view & comment</option>
                <option value='editor'>Can edit</option>
              </Select>
              <Stack mt={12} align='center'>
                <Button
                  px={8}
                  maxWidth='160px'
                  type='submit'
                  variantColor='green'
                  borderRadius='full'
                >
                  Invite User
                </Button>
                <Button mt={4} variant='link' onClick={onClose}>
                  Cancel
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  ) : null;
}
