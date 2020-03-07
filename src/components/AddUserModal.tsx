import React from 'react';
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
  Stack
} from '@chakra-ui/core';
import { addUserToProject } from '../services/data';
import FloatLabelInput from './FloatLabelInput';
import { useForm } from 'react-hook-form';

export default function AddUserModal({
  projectId,
  projectName,
  users
}: {
  projectId: string;
  projectName: string;
  users: Array<string>;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, errors, handleSubmit } = useForm();

  const hasErrors = Object.keys(errors).length;
  const onSubmit = ({ name, email }: any) => {
    if (!hasErrors)
      addUserToProject({
        name,
        email,
        projectId,
        projectName
      }).then(onClose);
  };

  return (
    <>
      <Button
        size='xs'
        px={4}
        color='brand.secondary'
        variant='link'
        onClick={onOpen}
        textTransform='uppercase'
      >
        + Add Teammate
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
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
              <Stack mt={12}>
                <Button type='submit' variantColor='green' borderRadius='full'>
                  Invite User
                </Button>
                <Button variant='link' onClick={onClose}>
                  Cancel
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
