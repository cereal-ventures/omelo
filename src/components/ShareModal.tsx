import React, { useEffect, useState } from 'react';
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Link,
  Box,
  Heading,
  Text
} from '@chakra-ui/core';
import { updateProject } from '../services/data';

export default function ShareModal({ projectId }: { projectId: string }) {
  const [isShared, setIsShared] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const url = `${window.location.protocol}//${window.location.host}/public/${projectId}`;

  useEffect(() => {
    if (isShared) {
      navigator.clipboard.writeText(url);
    }
  }, [isShared, url]);
  return (
    <>
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

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent p={8} mx='auto' maxWidth={{xs: '90vw', md: '600px'}}>
          <ModalCloseButton />
          <ModalBody textAlign='center'>
            <Heading
              mb={2}
              size='lg'
              color='brand.secondary'
              fontWeight='normal'
            >
              Share this project
            </Heading>
            <Text mb={4} fontWeight='light'>
              Use this link to share your timeline
            </Text>
            <Box
              p={4}
              backgroundColor='neutral.5'
              textAlign='center'
              borderRadius={8}
            >
              <Link
                href={`/public/${projectId}`}
                overflowWrap='break-word'
                target='_blank'
                color='brand.secondary'
              >
                {url}
              </Link>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Link
              as='button'
              fontWeight='semibold'
              color='system.positive'
              mx='auto'
              onClick={() => {
                setIsShared(true);
              }}
            >
              {!isShared ? 'Copy To Clipboard' : 'Copied  🎉'}
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
