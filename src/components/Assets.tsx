import React from 'react';
import { Box, Link, Spinner, Icon } from '@chakra-ui/core';
import { useEventAssets } from './useEventAssets';
import AddLinkDropdown from './AddLinkDropdown';

export default function Assets({
  eventId,
  projectId
}: {
  eventId: string;
  projectId: string;
}) {
  const { loading, assets } = useEventAssets(eventId);
  return (
    <>
      <AddLinkDropdown eventId={eventId} projectId={projectId} />
      <Box pl='40px'>
        {!loading ? (
          assets.map(asset => {
            return (
              <Link
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                width='100%'
                px={2}
                py={1}
                mb={2}
                borderRadius='4px'
                backgroundColor='neutral.5'
                borderColor='brand.secondary'
                border='1px solid'
                color='brand.secondary'
                key={asset.id}
                href={asset.url}
                target='_blank'
              >
                {asset.name}
                <Icon color='brand.secondary' name='external-link' />
              </Link>
            );
          })
        ) : (
          <Spinner />
        )}
      </Box>
    </>
  );
}
