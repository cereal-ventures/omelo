import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerFooter,
  FormErrorMessage,
  Input,
  Button,
  FormControl,
  Heading,
  Icon,
  Flex
} from '@chakra-ui/core';
import { addEvent } from '../services/data';

interface Props {
  isOpen: boolean;
  projectId: string;
}

export default function AddEventPanel({ isOpen, projectId }: Props) {
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      date: new Date(Date.now()).toISOString().substr(0, 10),
      title: ''
    }
  });
  const history = useHistory();

  const onClose = () => {
    history.push(`/${projectId}`);
  };
  const hasErrors = Boolean(Object.keys(errors).length);
  const onSubmit = ({
    title,
    date,
    completed = false
  }: {
    [x: string]: any;
  }) => {
    if (!hasErrors) {
      addEvent({
        projectId,
        title,
        date: new Date(date).toLocaleDateString('en-US', {
          timeZone: 'UTC'
        }),
        completed,
        isDisabled: false
      });
      onClose();
    }
  };

  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerHeader mb={8}>
            <Heading size='md' fontWeight='semibold'>
              Add Event
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <FormControl mb={6} isInvalid={Boolean(errors.title)}>
              <Flex alignItems='center'>
                <Icon
                  position='relative'
                  name='edit'
                  marginRight={4}
                  top='-1px'
                />
                <Input
                  focusBorderColor='brand.secondary'
                  variant='flushed'
                  name='title'
                  placeholder='Event Title'
                  ref={(ref: any) =>
                    register(ref, {
                      required: 'Please set a title for your event'
                    })
                  }
                />
              </Flex>
              <FormErrorMessage>
                {errors.title && 'Please add a title to your event'}
              </FormErrorMessage>
            </FormControl>
            <FormControl mb={6} isInvalid={Boolean(errors.date)}>
              <Flex alignItems='center'>
                <Icon
                  position='relative'
                  name='calendar'
                  marginRight={4}
                  top='-1px'
                />
                <Input
                  variant='flushed'
                  focusBorderColor='brand.secondary'
                  name='date'
                  type='date'
                  ref={(ref: any) =>
                    register(ref, {
                      required: 'Please set a date for your event'
                    })
                  }
                />
              </Flex>
              <FormErrorMessage>
                {errors.date && 'Please add a date to your event'}
              </FormErrorMessage>
            </FormControl>
          </DrawerBody>
          <DrawerFooter justifyContent='start'>
            <Button
              borderRadius='full'
              px={6}
              type='submit'
              variantColor='teal'
            >
              Save
            </Button>
            <Button variant='link' ml={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
