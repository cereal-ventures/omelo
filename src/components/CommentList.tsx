import React from 'react';
import { Box, Flex, Avatar, Heading, Text, Icon } from '@chakra-ui/core';
import { useComments } from './hooks/useComments';

export default function CommentList({
  eventId,
  projectId
}: {
  projectId: string;
  eventId: string;
}) {
  const { loading, comments } = useComments({ projectId, eventId });
  return (
    <Box mt={8}>
      <Flex align='center' color='brand.secondary'>
        <Icon mr={6} name='chat' size='16px' position='relative' left='1px' />
        <Heading color='black' size='xs' as='h6'>
          Comments
        </Heading>
      </Flex>
      {!loading &&
        comments.map(comment => {
          return (
            <Box
              key={comment.id}
              backgroundColor='white'
              p={4}
              mt={4}
              border='1px solid'
              borderColor='neutral.1'
              borderRadius='4px'
            >
              <Flex>
                <Avatar size='xs' />
                <Box ml={2}>
                  <Heading size='xs' as='h5' fontWeight='semibold'>
                    {comment.displayName}
                  </Heading>
                  <Text
                    mt={2}
                    fontSize='12px'
                    fontWeight='semibold'
                    color='#A0A4A8'
                  >
                    {comment.date}
                  </Text>
                  <Text mt={2} fontSize='12px' fontWeight='semibold'>
                    {comment.comment}
                  </Text>
                </Box>
              </Flex>
            </Box>
          );
        })}
    </Box>
  );
}
