import React, { useContext } from 'react';
import { Icon, Box, Button, Tooltip } from '@chakra-ui/core';
import { ProjectContext } from './ProjectContext';

export default function AddButton({ onClick }: { onClick: () => void }) {
  const { permission } = useContext(ProjectContext);
  return permission === 'owner' ? (
    <Box position='fixed' bottom='40px' right='40px'>
      <Tooltip
        hasArrow
        aria-label='Add to timeline'
        label='Add to timeline'
        placement='left'
      >
        <Button
          variantColor='purple'
          width='40px'
          height='40px'
          borderRadius='full'
          onClick={onClick}
        >
          <Icon name='add' />
        </Button>
      </Tooltip>
    </Box>
  ) : null;
}
