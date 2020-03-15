import React from 'react';
import { Box, Link, Icon, Flex } from '@chakra-ui/core';
import { useEventAssets } from './hooks/useEventAssets';
import AddLinkDropdown from './AddLinkDropdown';
import EditLinkDropdown from './EditLinkDropdown';

export default function Assets({
  isViewOnly,
  eventId,
  projectId
}: {
  isViewOnly: boolean;
  eventId: string;
  projectId: string;
}) {
  const { loading, assets } = useEventAssets({ eventId, projectId });
  return (
    <>
      <AddLinkDropdown
        eventId={eventId}
        projectId={projectId}
        isViewOnly={isViewOnly}
      />
      <Box pl='40px'>
        {!loading
          ? assets.map(asset => {
              return (
                <Flex
                  key={asset.id}
                  alignItems='center'
                  justifyContent='flex-end'
                  mb={2}
                >
                  <Link
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    width='100%'
                    px={2}
                    py={1}
                    borderRadius='4px'
                    backgroundColor='neutral.5'
                    borderColor='brand.secondary'
                    border='1px solid'
                    color='brand.secondary'
                    href={asset.url}
                    target='_blank'
                  >
                    {asset.name}
                    <Icon color='brand.secondary' name='external-link' />
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
  );
}
