import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  Icon,
  Box,
  Flex,
  ButtonGroup,
  Tooltip
} from '@chakra-ui/core';
import { updateEvent, removeEvent } from '../services/data';
import Assets from './Assets';
import DateInput from './DateInput';
import TitleInput from './TitleInput';

interface Props {
  isViewOnly: boolean;
  projectId: string;
  id: string;
  title: string;
  date: string;
  isOpen: boolean;
  completed: boolean;
}

function StatusButtons({
  projectId,
  eventId,
  completed,
  onComplete
}: {
  projectId: string;
  eventId: string;
  completed: boolean;
  onComplete: () => void;
}) {
  const handleChange = () => {
    updateEvent({
      projectId,
      eventId,
      payload: {
        completed: !completed
      }
    });
  };
  return (
    <ButtonGroup ml={12} mt={6} spacing={4}>
      <Button
        size='sm'
        borderRadius='full'
        variantColor='green'
        variant={completed ? 'outline' : 'solid'}
        onClick={handleChange}
      >
        {completed ? 'Reset Status' : 'Mark completed'}
      </Button>
      <Button
        size='xs'
        variant='link'
        onClick={() => {
          if (window.confirm('Are you sure you want to delete this project?')) {
            onComplete();
            removeEvent({ projectId, eventId });
          }
        }}
      >
        Delete Event
      </Button>
    </ButtonGroup>
  );
}

export default function EventDetailPanel({
  isViewOnly = false,
  projectId,
  id: eventId,
  title,
  date,
  isOpen,
  completed
}: Props) {
  const history = useHistory();

  const onClose = () => {
    if (isViewOnly) {
      history.push(`/public/${projectId}`);
    } else {
      history.push(`/${projectId}`);
    }
  };

  const dateHeading = (
    <Heading fontWeight='semibold' as='h4' size='sm' color='brand.secondary'>
      <Icon position='relative' name='calendar' marginRight={6} top='-1px' />
      <Box as='span' color='black'>
        {new Date(date).toLocaleDateString('en-US')}
      </Box>
    </Heading>
  );

  const dateInputEl = (
    <DateInput projectId={projectId} eventId={eventId} date={date} />
  );

  const eventTitleEl = (
    <Heading fontWeight='semibold' size='md' flexGrow={1}>
      {isViewOnly ? (
        title
      ) : title ? (
        <TitleInput title={title} projectId={projectId} eventId={eventId} />
      ) : null}
    </Heading>
  );

  const indicator = (
    <Tooltip
      hasArrow
      zIndex={3}
      placement='left'
      aria-label={completed ? 'Event has been completed' : 'Not yet completed'}
      label={completed ? 'Event has been completed' : 'Not yet completed'}
    >
      <Flex
        align='center'
        justify='center'
        width='32px'
        height='32px'
        backgroundColor={completed ? 'rgba(156,189,59,.25)' : 'white'}
        borderRadius='full'
        border='1px solid'
        borderColor={completed ? 'system.positive' : 'gray.200'}
        position='relative'
        mr={4}
      >
        {completed && <Icon name='check' color='system.positive' size='16px' />}
      </Flex>
    </Tooltip>
  );

  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay zIndex={1} />
      <DrawerContent zIndex={2}>
        <DrawerHeader>
          <Flex align='center'>
            {indicator}
            {eventTitleEl}
          </Flex>
          {!isViewOnly && (
            <StatusButtons
              projectId={projectId}
              eventId={eventId}
              completed={completed}
              onComplete={onClose}
            />
          )}
        </DrawerHeader>
        <DrawerBody pl={8} pt={4}>
          {isViewOnly ? dateHeading : date ? dateInputEl : null}
          <Assets
            eventId={eventId}
            projectId={projectId}
            isViewOnly={isViewOnly}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
