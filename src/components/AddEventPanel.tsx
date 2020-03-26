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
  Box,
  Tooltip,
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
    <Tooltip
      hasArrow
      placement='left'
      zIndex={3}
      aria-label='Not yet completed'
      label='Not yet completed'
    >
      <Badge
        fontSize='10px'
        variantColor='purple'
        py={1}
        px={4}
        flexShrink={0}
        position='relative'
        mr={2}
      >
        New
      </Badge>
    </Tooltip>
  );

  return (
    <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay zIndex={1} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent zIndex={2} maxWidth='375px' width='85vw'>
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
              {indicator}
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <FormControl mb={6} isInvalid={!date}>
              <Box
                border='1px solid'
                borderColor='gray.100'
                borderRadius={4}
                p={2}
              >
                <DatePopover
                  date={date}
                  onChange={(date: Date) => setDate(date)}
                />
              </Box>
              <FormErrorMessage>
                {!date && 'Please add a date'}
              </FormErrorMessage>
            </FormControl>
            <Stack align='center' mt={4}>
              <Button
                size='sm'
                width='100%'
                px={6}
                type='submit'
                variantColor='purple'
              >
                Save
              </Button>
              <Button size='sm' variant='link' mt={2} onClick={onClose}>
                Cancel
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </form>
    </Drawer>
  );
}
