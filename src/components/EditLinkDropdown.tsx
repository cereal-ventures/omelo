import React, { SyntheticEvent } from 'react';
import { useForm } from 'react-hook-form';
import {
  Popover,
  PopoverTrigger,
  PopoverCloseButton,
  PopoverContent,
  PopoverBody,
  FormControl,
  Input,
  ButtonGroup,
  Button,
  Link,
  Heading
} from '@chakra-ui/core';
import { updateAsset, removeAsset } from '../services/data';

function UpdateAssetForm({
  eventId,
  projectId,
  name,
  url,
  assetId,
  onClose
}: {
  eventId: string;
  projectId: string;
  assetId: string;
  name: string;
  url: string;
  onClose: (() => void) | undefined;
}) {
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      assetName: name,
      assetUrl: url
    }
  });
  const hasErrors: boolean = Boolean(Object.keys(errors).length);
  const onSubmit = ({
    assetName: name,
    assetUrl: url
  }: {
    [x: string]: any;
  }) => {
    if (!hasErrors) {
      updateAsset({
        name,
        url,
        assetId,
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
      <ButtonGroup display='flex' spacing={0} flexDirection='row-reverse'>
        <Button type='submit' variantColor='teal' ml={4}>
          Update
        </Button>
        <Link
          as='button'
          color='system.alert'
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            if (window.confirm('Are you user you want to delete this link?')) {
              removeAsset({ assetId, projectId, eventId });
            }
            onClose && onClose();
          }}
        >
          Delete
        </Link>
      </ButtonGroup>
    </form>
  );
}

export default function EditLinkDropdown({
  eventId,
  projectId,
  assetId,
  name,
  url
}: {
  [x: string]: any;
}) {
  return (
    <Popover placement='bottom-start'>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Link as='button' color='gray.500' ml={4}>
              Edit
            </Link>
          </PopoverTrigger>
          <PopoverContent fontSize='md' zIndex={4} width='275px' px={2} py={3}>
            <PopoverCloseButton />
            <PopoverBody px={4}>
              <Heading size='sm' mb={4}>
                Edit Link
              </Heading>
              <UpdateAssetForm
                eventId={eventId}
                projectId={projectId}
                assetId={assetId}
                onClose={onClose}
                name={name}
                url={url}
              />
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
