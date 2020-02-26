import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Popover,
  PopoverTrigger,
  Icon,
  PopoverCloseButton,
  PopoverContent,
  PopoverBody,
  FormControl,
  Input,
  ButtonGroup,
  Button,
  Link,
  Heading,
  Flex,
  Box
} from '@chakra-ui/core';
import { addAsset } from '../services/data';

function AddAssetForm({
  eventId,
  projectId,
  onClose
}: {
  eventId: string;
  projectId: string;
  onClose: (() => void) | undefined;
}) {
  const { register, handleSubmit, errors } = useForm();
  const hasErrors: boolean = Boolean(Object.keys(errors).length);
  const onSubmit = ({
    assetName: name,
    assetUrl: url
  }: {
    [x: string]: any;
  }) => {
    if (!hasErrors) {
      addAsset({
        name,
        type: 'link',
        url,
        eventId,
        projectId
      });
      onClose && onClose();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl mb={8} isInvalid={Boolean(errors.assetName)}>
        <Input
          ref={register({
            required: 'Please enter a name'
          })}
          name='assetName'
          variant='flushed'
          placeholder='Enter a name'
        />
      </FormControl>
      <FormControl mb={8} isInvalid={Boolean(errors.assetUrl)}>
        <Input
          ref={register({
            required: 'Please enter a valid url',
            pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/
          })}
          name='assetUrl'
          variant='flushed'
          placeholder='Enter a url'
        />
      </FormControl>
      <ButtonGroup display='flex' justifyContent='flex-end' spacing={4}>
        <Link as='button' onClick={onClose}>
          Cancel
        </Link>
        <Button type='submit' variantColor='teal'>
          Save
        </Button>
      </ButtonGroup>
    </form>
  );
}

export default function AddLinkDropdown({
  eventId,
  projectId
}: {
  [x: string]: any;
}) {
  return (
    <Popover placement='bottom-start'>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Flex my={8} justifyContent='space-between' alignItems='center'>
              <Heading
                as='h4'
                size='sm'
                fontWeight='semibold'
                display='flex'
                alignItems='center'
                color='brand.secondary'
              >
                <Icon name='copy' mr={6} />
                <Box as='span' color='black'>
                  Assets
                </Box>
              </Heading>
              <Link
                as='button'
                color='brand.secondary'
                textTransform='uppercase'
                fontWeight='bold'
                fontSize='12px'
                ml={8}
              >
                Add New
              </Link>
            </Flex>
          </PopoverTrigger>
          <PopoverContent fontSize='md' zIndex={4} width='275px'>
            <PopoverCloseButton />
            <PopoverBody px={4}>
              <Heading size='sm' mb={4}>
                Add Link
              </Heading>
              <AddAssetForm
                eventId={eventId}
                projectId={projectId}
                onClose={onClose}
              />
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
