import React from 'react';
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
  Grid
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
  isViewOnly
}: {
  [x: string]: any;
}) {
  return (
    <Box
      key={item.id}
      backgroundColor='white'
      p={4}
      border='1px solid'
      borderColor='neutral.1'
      borderRadius='4px'
      position='relative'
    >
      {!isViewOnly && (
        <ContextMenu
          projectId={projectId}
          eventId={eventId}
          commentId={item.id}
        />
      )}
      <Flex>
        <Avatar size='xs' name={item.displayName} />
        <Box ml={2}>
          <Heading size='xs' as='h5' fontWeight='semibold'>
            {item.displayName}
          </Heading>
          <Text mt={2} fontSize='12px' fontWeight='semibold' color='#A0A4A8'>
            {item.date}
          </Text>
          <Text mt={2} fontSize='12px' fontWeight='semibold'>
            {item.comment}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

function Update({ displayName, photoUrl, children }: { [x: string]: any }) {
  return (
    <Flex pl={4} align='center'>
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
    <Grid rowGap={8}>
      {activity.map(item => {
        if (item.type === activityTypes.CREATE_EVENT) {
          const [name] = item.displayName.split(' ');
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoUrl}
            >
              <Heading as='h6' size='xs' fontSize='12px'>
                <Box as='strong' color='brand.secondary'>
                  {name}
                </Box>{' '}
                created <strong>{item.title}</strong>
              </Heading>
            </Update>
          );
        }
        if (item.type === activityTypes.UPDATE_TITLE) {
          const [name] = item.displayName.split(' ');
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoUrl}
            >
              <Heading as='h6' size='xs' fontSize='12px'>
                <Box as='strong' color='brand.secondary'>
                  {name}
                </Box>{' '}
                updated the event title to <strong>{item.title}</strong>
              </Heading>
            </Update>
          );
        }
        if (item.type === activityTypes.COMMENT)
          return (
            <Comment
              key={item.id}
              isViewOnly={isViewOnly}
              item={item}
              eventId={eventId}
              projectId={projectId}
            />
          );
        if (item.type === activityTypes.UPDATE_DATE) {
          const [name] = item.displayName.split(' ');
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoUrl}
            >
              <Heading as='h6' size='xs' fontSize='12px'>
                <Box as='strong' color='brand.secondary'>
                  {name}
                </Box>{' '}
                updated the date <strong>{item.prevDate}</strong> to{' '}
                <strong>{item.newDate}</strong>
              </Heading>
            </Update>
          );
        }

        if (item.type === activityTypes.EVENT_RESET) {
          const [name] = item.displayName.split(' ');
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoUrl}
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

        if (item.type === activityTypes.EVENT_COMPLETE) {
          const [name] = item.displayName.split(' ');
          return (
            <Update
              key={item.id}
              displayName={item.displayName}
              photoUrl={item.photoUrl}
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
