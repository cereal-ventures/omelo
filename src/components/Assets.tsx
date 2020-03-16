import React from 'react';
import { Link, Icon, Flex } from '@chakra-ui/core';
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
      {!loading
        ? assets.map(asset => {
            return (
              <Flex
                key={asset.id}
                alignItems='center'
                justifyContent='flex-end'
                px={2}
                py={1}
                borderRadius='4px'
                backgroundColor='neutral.5'
                borderColor='brand.secondary'
                border='1px solid'
                color='brand.secondary'
                mb={2}
              >
                <Link
                  display='flex'
                  alignItems='center'
                  width='100%'
                  href={asset.url}
                  target='_blank'
                >
                  <Icon
                    size='.75em'
                    color='brand.secondary'
                    name='link'
                    mr={2}
                  />
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
    </>
  );
}
