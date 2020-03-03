import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  FormErrorMessage,
  Input,
  Button,
  FormControl,
  Heading,
  Icon,
  Flex,
  Box,
  Tooltip
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

  const indicator = (
    <Tooltip
      hasArrow
      placement='left'
      zIndex={3}
      aria-label='Not yet completed'
      label='Not yet completed'
    >
      <Box
        width='32px'
        height='32px'
        backgroundColor={'white'}
        borderRadius='full'
        border='1px solid'
        borderColor={'gray.200'}
        position='relative'
        mr={4}
      />
    </Tooltip>
  );

  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay zIndex={1} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent zIndex={2}>
          <DrawerHeader mb={4}>
            <Flex align='center'>
              {indicator}

              <Heading fontWeight='semibold' size='md' flexGrow={1}>
                <FormControl isInvalid={Boolean(errors.title)}>
                  <Input
                    fontWeight='semibold'
                    fontSize='inherit'
                    borderColor='gray.100'
                    focusBorderColor='brand.secondary'
                    variant='flushed'
                    name='title'
                    placeholder='Enter Title'
                    ref={(ref: any) =>
                      register(ref, {
                        required: 'Please set a title'
                      })
                    }
                  />
                  <FormErrorMessage>
                    {errors.title && 'Please add a title'}
                  </FormErrorMessage>
                </FormControl>
              </Heading>
            </Flex>
          </DrawerHeader>
          <DrawerBody pl={8}>
            <FormControl mb={6} isInvalid={Boolean(errors.date)}>
              <Flex alignItems='center' color='brand.secondary'>
                <Icon
                  position='relative'
                  name='calendar'
                  marginRight={6}
                  top='-1px'
                  size='19px'
                />
                <Input
                  color='black'
                  variant='flushed'
                  fontWeight='semibold'
                  borderColor='gray.100'
                  focusBorderColor='brand.secondary'
                  name='date'
                  type='date'
                  ref={(ref: any) =>
                    register(ref, {
                      required: 'Please set a valid date'
                    })
                  }
                />
              </Flex>
              <FormErrorMessage>
                {errors.date && 'Please add a date'}
              </FormErrorMessage>
            </FormControl>
            <Flex align='center' mt={12}>
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
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
