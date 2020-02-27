import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Checkbox,
  PopoverBody,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  Link,
  Icon,
  Box,
  Flex
} from '@chakra-ui/core';
import { updateEvent, removeEvent } from '../services/data';
import Assets from './Assets';

interface Props {
  isViewOnly: boolean;
  projectId: string;
  id: string;
  title: string;
  date: Date;
  isOpen: boolean;
  completed: boolean;
}

function ContextMenu({
  projectId,
  eventId,
  onComplete
}: {
  projectId: string;
  eventId: string;
  onComplete: () => void;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button position='relative' height='auto' minWidth='auto'>
          &#8942;
        </Button>
      </PopoverTrigger>
      <PopoverContent fontSize='md' zIndex={4} width='200px'>
        <PopoverArrow top='24px' />
        <PopoverHeader>Event Settings</PopoverHeader>
        <PopoverBody>
          <Link
            as='button'
            color='red.400'
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this project?')
              ) {
                removeEvent({ projectId, eventId })?.then(onComplete);
              }
            }}
          >
            Delete Event
          </Link>
        </PopoverBody>
      </PopoverContent>
    </Popover>
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

  const handleChange = () => {
    updateEvent({
      projectId,
      eventId,
      payload: {
        completed: !completed
      }
    });
  };

  const onClose = () => {
    if (isViewOnly) {
      history.push(`/public/${projectId}`);
    } else {
      history.push(`/${projectId}`);
    }
  };
  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader display='flex' justifyContent='space-between'>
          <Heading fontWeight='semibold' size='md'>
            {title}
          </Heading>
          {!isViewOnly && (
            <ContextMenu
              projectId={projectId}
              eventId={eventId}
              onComplete={onClose}
            />
          )}
        </DrawerHeader>

        <DrawerBody>
          <Flex alignItems='center' mt={8}>
            <Checkbox
              isDisabled={isViewOnly}
              variantColor='purple'
              value={`${completed}`}
              onChange={handleChange}
              defaultIsChecked={completed}
            >
              <Heading
                fontWeight='semibold'
                as='h4'
                size='sm'
                ml={4}
                color='black'
              >
                Completed
              </Heading>
            </Checkbox>
          </Flex>
          <Heading
            fontWeight='semibold'
            as='h4'
            size='sm'
            mt={8}
            color='brand.secondary'
          >
            <Icon
              position='relative'
              name='calendar'
              marginRight={6}
              top='-1px'
            />
            <Box as='span' color='black'>
              {new Date(date).toLocaleDateString('en-US')}
            </Box>
          </Heading>

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
