import React, { useState } from 'react';
import {
  Link,
  Icon,
  Flex,
  Box,
  Divider,
  Stack,
  Heading,
  Button
} from '@chakra-ui/core';
import { useEventAssets } from './hooks/useEventAssets';
import EditLinkDropdown from './EditLinkDropdown';

export default function Assets({
  isViewOnly,
  eventId,
  projectId,
  assetCount
}: {
  isViewOnly: boolean;
  eventId: string;
  projectId: string;
  assetCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, assets } = useEventAssets({ eventId, projectId });
  return (
    <Box mb={4} border='1px solid' borderColor='gray.200' borderRadius={4}>
      <Flex p={4} justify='space-between' align='center'>
        <Flex align='center'>
          <Stack mr={2}>
            <Icon name='attachment' size='.65em' />
          </Stack>
          <Heading as='h5' fontSize='14px'>
            Attachments
          </Heading>
        </Flex>
        <Button
          variant='link'
          variantColor='purple'
          size='sm'
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isOpen ? (
            <Box as='span'>
              {assetCount} {assetCount === 1 ? 'Attachment' : 'Attachments'}
            </Box>
          ) : (
            'Collapse'
          )}
        </Button>
      </Flex>
      {isOpen && (
        <>
          <Divider m={0} />
          <Box p={2}>
            {!loading
              ? assets.map(asset => {
                  return (
                    <Flex
                      key={asset.id}
                      alignItems='center'
                      justifyContent='flex-end'
                      py={1}
                    >
                      <Link
                        display='flex'
                        alignItems='center'
                        width='100%'
                        fontWeight='semibold'
                        fontSize='14px'
                        href={asset.url}
                        target='_blank'
                      >
                        <Stack
                          align='center'
                          justify='center'
                          width='24px'
                          height='24px'
                          border='1px solid'
                          borderColor='gray.200'
                          borderRadius='full'
                          mr={2}
                        >
                          <Icon name='link' size='.65em' />
                        </Stack>
                        {asset.name}
                      </Link>
                      {!isViewOnly && (
                        <EditLinkDropdown
                          eventId={eventId}
                          projectId={projectId}
                          assetId={asset.id}
                          name={asset.name}
                          url={asset.url}
                        />
                      )}
                    </Flex>
                  );
                })
              : null}
          </Box>
        </>
      )}
    </Box>
  );
}
