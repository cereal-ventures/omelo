import React, { useContext } from 'react';
import { Icon, Box, Button } from '@chakra-ui/core';
import { ProjectContext } from './ProjectContext';

export default function AddButton({ onClick }: { onClick: () => void }) {
  const { permission } = useContext(ProjectContext);
  return permission === 'owner' ? (
    <Box position='fixed' bottom='40px' right='40px'>
      <Button
        variantColor='purple'
        height='40px'
        width={{ xs: '40px', md: 'auto' }}
        borderRadius='full'
        onClick={onClick}
      >
        <Icon name='add' size='.85em' />
        <Box as='span' ml={2} display={{ xs: 'none', md: 'block' }}>
          Add to timeline
        </Box>
      </Button>
    </Box>
  ) : null;
}
