import React, { useEffect, useState } from 'react';
import { formatDistanceToNow, isToday, isPast, isTomorrow } from 'date-fns';
import { useHistory } from 'react-router-dom';
import {
  Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  Button,
  Icon,
  Box,
  Flex,
  ButtonGroup,
  DrawerFooter,
  Divider,
  DrawerOverlay,
  Badge
} from '@chakra-ui/core';
import { activityTypes } from '../constants';
import { updateEvent, removeEvent } from '../services/data';
import Assets from './Assets';
import DateInput from './DateInput';
import TitleInput from './TitleInput';
import ActivityFeed from './ActivityFeed';
import Composer from './Composer';

interface Props {
  isViewOnly: boolean;
  isOverdue?: boolean;
  projectId: string;
  id: string;
  title: string;
  date: Date;
  isOpen: boolean;
  completed: boolean;
  assetCount: number;
}

function StatusButtons({
  title,
  projectId,
  eventId,
  completed,
  onComplete
}: {
  title: string;
  projectId: string;
  eventId: string;
  completed: boolean;
  onComplete: () => void;
}) {
  const handleChange = () => {
    updateEvent({
      type: completed
        ? activityTypes.EVENT_RESET
        : activityTypes.EVENT_COMPLETE,
      projectId,
      eventId,
      payload: {
        title,
        completed: !completed
      }
    });
  };
  return (
    <ButtonGroup spacing={4}>
      <Button
        size='xs'
        variantColor='green'
        variant={completed ? 'link' : 'outline'}
        onClick={handleChange}
      >
        {completed ? 'Reset Status' : 'Mark complete'}
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
        Delete
      </Button>
    </ButtonGroup>
  );
}

function Footer({
  projectId,
  eventId
}: {
  projectId: string;
  eventId: string;
}) {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      setHeight(height);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <DrawerFooter
      width='100%'
      position='absolute'
      top={`${height - 56}px`}
      backgroundColor='white'
    >
      <Divider
        width='100%'
        top='-8px'
        left={0}
        color='black'
        position='absolute'
        zIndex={4}
      />
      <Composer eventId={eventId} projectId={projectId} />
    </DrawerFooter>
  );
}

function getDateProps(date: Date, completed: boolean) {
  if (completed) {
    return {
      backgroundColor: 'rgba(156, 189,59,.1)',
      color: '#5e7519',
      children: 'Completed'
    };
  }

  if (isTomorrow(date)) {
    return {
      backgroundColor: 'rgba(242, 201,76,.1)',
      color: '#906d00',
      children: 'Tomorrow'
    };
  }

  if (isToday(date)) {
    return {
      backgroundColor: 'rgba(242, 201,76,.1)',
      color: '#906d00',
      children: 'Today'
    };
  }

  if (isPast(date)) {
    return {
      backgroundColor: 'rgba(241,73,101,.1)',
      color: '#F14965',
      children: formatDistanceToNow(date, { addSuffix: true })
    };
  }

  return {
    backgroundColor: 'rgba(112,115,134,.05)',
    color: '#707386',
    children: formatDistanceToNow(date, { addSuffix: true })
  };
}

export default function EventDetailPanel({
  isViewOnly = false,
  projectId,
  id: eventId,
  title,
  date,
  isOpen,
  completed,
  assetCount
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
      <Icon position='relative' name='calendar' marginRight={2} top='-1px' />
      <Box as='span' color='black'>
        {new Date(date).toLocaleDateString(navigator.languages[0] || 'en-US')}
      </Box>
    </Heading>
  );

  const dateInputEl = (
    <DateInput projectId={projectId} eventId={eventId} date={date} />
  );

  const eventTitleEl = (
    <TitleInput
      isViewOnly={isViewOnly}
      title={title}
      projectId={projectId}
      eventId={eventId}
    />
  );

  const indicator = (
    <Badge
      py={1}
      px={2}
      ml={2}
      position='relative'
      top='1px'
      fontSize='10px'
      {...(date && getDateProps(new Date(date), completed))}
    />
  );

  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay zIndex={1} />
      <DrawerContent zIndex={2} maxWidth='375px' width='85vw'>
        <DrawerHeader>
          <Flex mb={2} justify='space-between' align='center'>
            {eventTitleEl}
          </Flex>
          <Flex mb={4} align='center'>
            {isViewOnly ? dateHeading : date ? dateInputEl : null}
            {indicator}
          </Flex>
          {!isViewOnly && (
            <StatusButtons
              title={title}
              projectId={projectId}
              eventId={eventId}
              completed={completed}
              onComplete={onClose}
            />
          )}
        </DrawerHeader>
        <Divider />
        <DrawerBody pt={4} pb={[40, 24]} position='relative' overflow='auto'>
          {Boolean(assetCount) && (
            <Assets
              assetCount={assetCount}
              eventId={eventId}
              projectId={projectId}
              isViewOnly={isViewOnly}
            />
          )}
          <ActivityFeed
            isViewOnly={isViewOnly}
            eventId={eventId}
            projectId={projectId}
          />
        </DrawerBody>
        {!isViewOnly && <Footer eventId={eventId} projectId={projectId} />}
      </DrawerContent>
    </Drawer>
  );
}
