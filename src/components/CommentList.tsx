import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  Heading,
  Text,
  Icon,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  Link
} from '@chakra-ui/core';
import { useComments } from './hooks/useComments';
import { removeComment } from '../services/data';

function ContextMenu({
  projectId,
  eventId,
  commentId
}: {
  projectId: string;
  eventId: string;
  commentId: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          position='absolute'
          right='16px'
          top='8px'
          height='auto'
          minWidth='auto'
          variant='unstyled'
        >
          &#8942;
        </Button>
      </PopoverTrigger>
      <PopoverContent zIndex={4} width='200px'>
        <PopoverHeader>
          <Heading as='h6' size='sm' fontWeight='semibold'>
            Comment:
          </Heading>
        </PopoverHeader>

        <PopoverFooter>
          <Link
            as='button'
            color='red.400'
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this comment?')
              ) {
                removeComment({ eventId, projectId, commentId });
              }
            }}
          >
            Delete Comment
          </Link>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

export default function CommentList({
  isViewOnly,
  eventId,
  projectId
}: {
  isViewOnly: boolean;
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
              position='relative'
            >
              {!isViewOnly && (
                <ContextMenu
                  projectId={projectId}
                  eventId={eventId}
                  commentId={comment.id}
                />
              )}
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
