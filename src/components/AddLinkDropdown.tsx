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
  ButtonGroup,
  Button,
  Link,
  Heading,
  Flex,
  Box
} from '@chakra-ui/core';
import { addAsset } from '../services/data';
import FloatLabelInput from './FloatLabelInput';

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
        <FloatLabelInput
          ref={register({
            required: 'Please enter a name'
          })}
          type='text'
          name='assetName'
          variant='flushed'
          label='Enter a name'
          placeholder='Enter a name'
        />
      </FormControl>
      <FormControl mb={8} isInvalid={Boolean(errors.assetUrl)}>
        <FloatLabelInput
          ref={register({
            required: 'Please enter a valid url',
            pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/
          })}
          name='assetUrl'
          type='text'
          variant='flushed'
          label='Enter a url'
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

const linkHeading = (
  <Heading
    as='h4'
    size='sm'
    fontWeight='semibold'
    display='flex'
    alignItems='center'
    color='brand.secondary'
  >
    <Icon name='copy' mr={6} size='19px' />
    <Box as='span' color='black'>
      Attachments
    </Box>
  </Heading>
);

export default function AddLinkDropdown({
  isViewOnly,
  eventId,
  projectId
}: {
  [x: string]: any;
}) {
  return isViewOnly ? (
    <Box my={8}>{linkHeading}</Box>
  ) : (
    <Popover placement='bottom-start'>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Flex my={8} justifyContent='space-between' alignItems='center'>
              {linkHeading}
              <Button
                size='xs'
                variant='outline'
                color='brand.secondary'
                textTransform='uppercase'
                fontWeight='bold'
                fontSize='12px'
                ml={8}
              >
                Add New
              </Button>
            </Flex>
          </PopoverTrigger>
          <PopoverContent fontSize='md' zIndex={4} width='275px' px={2} py={3}>
            <PopoverCloseButton />
            <PopoverBody px={4}>
              <Heading size='sm' mb={6}>
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
