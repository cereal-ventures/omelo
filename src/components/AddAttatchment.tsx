import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Popover,
  PopoverTrigger,
  Icon,
  PopoverContent,
  PopoverBody,
  FormControl,
  ButtonGroup,
  Button,
  Heading,
  Input,
  Tooltip,
  PopoverFooter,
  Flex,
  Select,
  FormLabel
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
  const onSubmit = (
    {
      assetName: name,
      assetUrl: url
    }: {
      [x: string]: any;
    },
    e: any
  ) => {
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
      <PopoverBody px={4} pt={4}>
        <Flex align='center' justify='space-between' mb={6}>
          <Heading size='sm' flex={1} width='100%'>
            Attachment:
          </Heading>
          <Select size='sm' width='auto'>
            <option>Link</option>
          </Select>
        </Flex>
        <FormControl mb={4} isInvalid={Boolean(errors.assetName)}>
          <FormLabel fontSize='12px' htmlFor='assetUrl'>
            Title:
          </FormLabel>
          <Input
            size='sm'
            ref={register({
              required: 'Please enter a name'
            })}
            type='text'
            name='assetName'
            variant='outline'
            placeholder='Enter a name'
          />
        </FormControl>
        <FormControl mb={4} isInvalid={Boolean(errors.assetUrl)}>
          <FormLabel fontSize='12px' htmlFor='assetUrl'>
            Url:
          </FormLabel>
          <Input
            id='assetUrl'
            size='sm'
            ref={register({
              required: 'Please enter a valid url',
              pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/
            })}
            name='assetUrl'
            type='text'
            variant='outline'
            placeholder='Enter a url'
          />
        </FormControl>
      </PopoverBody>
      <PopoverFooter py={4}>
        <Flex align='center' justify='space-between'>
          <Flex align='center' fontWeight='semibold' fontSize='14px'>
            <Flex
              align='center'
              justify='center'
              borderRadius='full'
              width='26px'
              height='26px'
              border='1px solid'
              borderColor='gray.200'
              mr={2}
            >
              <Icon name='attachment' size='.85em' />
            </Flex>
          </Flex>
          <ButtonGroup display='flex' justifyContent='flex-end' spacing={4}>
            <Button size='xs' variant='link' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' variantColor='teal' size='xs'>
              Save
            </Button>
          </ButtonGroup>
        </Flex>
      </PopoverFooter>
    </form>
  );
}

export default function AddAttachment({
  eventId,
  projectId
}: {
  [x: string]: any;
}) {
  return (
    <Popover usePortal>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Button
              type='button'
              variant='unstyled'
              border='1px solid'
              borderColor='purple.100'
              width='26px'
              height='26px'
              minWidth='auto'
              borderRadius='full'
              display='flex'
              justifyContent='center'
              alignItems='center'
            >
              <Tooltip
                hasArrow
                zIndex={8}
                placement='top'
                label='Add attachment'
                aria-label='Add attachment'
              >
                <Icon name='attachment' size='.75em' />
              </Tooltip>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            position='relative'
            left='6px !important'
            top='52px !important'
            fontSize='md'
            borderRadius={0}
            zIndex={8}
            maxWidth='375px'
            width='85vw'
            _focus={{ outline: 'none' }}
          >
            <AddAssetForm
              eventId={eventId}
              projectId={projectId}
              onClose={onClose}
            />
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
