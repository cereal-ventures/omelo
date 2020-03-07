import React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Heading,
  Image
} from '@chakra-ui/core';
import { acceptProjectInvite } from '../services/data';
import img from '../images/collab.png';

export default function AcceptInviteModal({
  projectName,
  invite,
  onClose,
  isOpen
}: {
  projectName: string | null | undefined;
  invite: string | null | undefined;
  onClose: () => void;
  isOpen: boolean;
}) {
  return invite ? (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent p={8} mx='auto' maxWidth={{ xs: '90vw', md: '600px' }}>
        <ModalCloseButton />
        <ModalBody textAlign='center'>
          <Heading
            mb={4}
            color='brand.secondary'
            size='lg'
            fontWeight='semibold'
          >
            {projectName
              ? `You have been invited to ${projectName}`
              : 'Join Project'}
          </Heading>
          <Heading mb={8} as='h6' size='sm' fontWeight='normal'>
            You have been invited to join{' '}
            {projectName ? projectName : 'this project'}{' '}
            <span role='img' aria-label='celebrate'>
              🎉
            </span>
          </Heading>
          <Image
            mx='auto'
            maxWidth='300px'
            src={img}
            alt='Collaboration illustration'
            mb={12}
          />
          <Button
            variantColor='green'
            borderRadius='full'
            onClick={async () => {
              await acceptProjectInvite(invite).then(onClose);
            }}
          >
            Accept Invite
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : null;
}
