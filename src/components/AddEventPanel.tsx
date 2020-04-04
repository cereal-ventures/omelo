import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  FormErrorMessage,
  Input,
  Button,
  FormControl,
  Heading,
  Flex,
  DrawerOverlay,
  Badge,
  Stack
} from '@chakra-ui/core';
import DatePopover from './DatePopover';
import { addEvent } from '../services/data';

interface Props {
  isOpen: boolean;
  projectId: string;
}

export default function AddEventPanel({ isOpen, projectId }: Props) {
  const [date, setDate] = useState(new Date(Date.now()));
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      title: ''
    }
  });
  const history = useHistory();

  const onClose = () => {
    history.push(`/${projectId}`);
  };
  const hasErrors = Boolean(Object.keys(errors).length);
  const onSubmit = ({ title, completed = false }: { [x: string]: any }) => {
    if (!hasErrors) {
      addEvent({
        projectId,
        title,
        date: date.toLocaleDateString('en-US', {
          timeZone: 'UTC'
        }),
        completed,
        isDisabled: false
      });
      onClose();
      setDate(new Date(Date.now()));
    }
  };

  const indicator = (
    <Badge
      fontSize='10px'
      variantColor='purple'
      flexShrink={0}
      position='relative'
      top='1px'
      py={1}
      px={2}
      ml={2}
    >
      New
    </Badge>
  );

  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay zIndex={1} />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <DrawerContent zIndex={2} maxWidth='375px' width='85vw' pt={12}>
          <DrawerHeader mb={2}>
            <Flex align='center' justify='space-between'>
              <Heading fontWeight='semibold' size='md' flexGrow={1}>
                <FormControl isInvalid={Boolean(errors.title)}>
                  <Input
                    fontWeight='semibold'
                    fontSize='inherit'
                    borderColor='gray.100'
                    focusBorderColor='brand.secondary'
                    variant='unstyled'
                    name='title'
                    placeholder='Add a title ...'
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
          <DrawerBody>
            <FormControl mb={6} isInvalid={!date}>
              <Flex
                border='1px solid'
                borderColor='gray.100'
                borderRadius={4}
                p={2}
                align='center'
                justify='space-between'
              >
                <DatePopover
                  date={date}
                  onChange={(date: Date) => setDate(date)}
                />
                {indicator}
              </Flex>
              <FormErrorMessage>
                {!date && 'Please add a date'}
              </FormErrorMessage>
            </FormControl>
            <Stack mt={4}>
              <Button
                size='sm'
                px={6}
                type='submit'
                variantColor='purple'
                width='100%'
              >
                Save
              </Button>
              <Button size='sm' variant='link' onClick={onClose}>
                Cancel
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
