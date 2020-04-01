import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Box,
  Flex,
  Avatar,
  Heading,
  Text,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  Link,
  Grid,
  PopoverArrow
} from '@chakra-ui/core';
import { useActivity } from './hooks/useActivity';
import { removeComment } from '../services/data';
import { activityTypes } from '../constants';

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
        <PopoverArrow />
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

function Comment({
  item,
  projectId,
  eventId,
  isViewOnly,
  photoUrl
}: {
  [x: string]: any;
}) {
  return (
    <Flex key={item.id}>
      <Box
        border='1px solid'
        borderColor='gray.100'
        backgroundColor='gray.50'
        p={2}
        pr={4}
        borderRadius={4}
        position='relative'
        width='100%'
      >
        <Flex align='center' mb={2}>
          <Avatar size='xs' name={item.displayName} src={photoUrl} mr={2} />
          <Heading as='h6' size='xs' fontSize='12px' mr={1}>
            {item.displayName}
          </Heading>
          <Heading as='h6' size='xs' fontSize='12px' color='#A0A4A8'>
            {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
          </Heading>
        </Flex>
        {!isViewOnly && (
          <ContextMenu
            projectId={projectId}
            eventId={eventId}
            commentId={item.id}
          />
        )}

        <Text fontSize='12px' fontWeight='semibold' ml={8}>
          {item.comment}
        </Text>
      </Box>
    </Flex>
  );
}

function Update({ displayName, photoUrl, children }: { [x: string]: any }) {
  return (
    <Flex
      align='center'
      border='1px solid'
      borderColor='gray.50'
      p={2}
      borderRadius={4}
    >
      <Avatar size='xs' name={displayName} src={photoUrl} mr={2} />
      {children}
    </Flex>
  );
}

export default function ActivityFeed({
  isViewOnly,
  eventId,
  projectId
}: {
  isViewOnly: boolean;
  projectId: string;
  eventId: string;
}) {
  const { loading, activity } = useActivity({ projectId, eventId });
  if (loading) {
    return null;
  }
  return (
    <Grid rowGap={4}>
      {activity.map(item => {
        if (item.type === activityTypes.CREATE_EVENT) {
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoURL}
            >
              <Heading as='h6' size='xs' fontSize='12px'>
                {item.displayName} created <strong>{item.title}</strong>
              </Heading>
            </Update>
          );
        }
        if (item.type === activityTypes.UPDATE_TITLE) {
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoURL}
            >
              <Heading as='h6' size='xs' fontSize='12px'>
                {item.displayName} edited the title
              </Heading>
            </Update>
          );
        }
        if (item.type === activityTypes.COMMENT)
          return (
            <Comment
              key={item.id}
              photoUrl={item.photoURL}
              isViewOnly={isViewOnly}
              item={item}
              eventId={eventId}
              projectId={projectId}
            />
          );
        if (item.type === activityTypes.UPDATE_DATE) {
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoURL}
            >
              <Heading as='h6' size='xs' fontSize='12px'>
                {item.displayName} updated the date{' '}
                <strong>{item.prevDate}</strong> to{' '}
                <strong>{item.newDate}</strong>
              </Heading>
            </Update>
          );
        }

        if (item.type === activityTypes.EVENT_RESET) {
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoURL}
            >
              <Heading as='h6' size='xs' fontSize='12px' whiteSpace='nowrap'>
                {item.displayName} reopened <strong>{item.title}</strong>
              </Heading>
            </Update>
          );
        }

        if (item.type === activityTypes.EVENT_COMPLETE) {
          const [name] = item.displayName.split(' ');
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoURL}
            >
              <Heading as='h6' size='xs' fontSize='12px' whiteSpace='nowrap'>
                <Box as='strong' color='brand.secondary'>
                  {name}
                </Box>{' '}
                completed <strong>{item.title}</strong>
              </Heading>
            </Update>
          );
        }

        return null;
      })}
    </Grid>
  );
}
