import React, { useContext } from 'react';
import { Icon, Box, Button, Stack } from '@chakra-ui/core';
import { ProjectContext } from './ProjectContext';

export default function AddButton({ onClick }: { onClick: () => void }) {
  const { permission } = useContext(ProjectContext);
  return permission === 'owner' ? (
    <Box position='fixed' bottom='48px' right='40px'>
      <Button
        variant='outline'
        variantColor='purple'
        height='40px'
        width={{ xs: '40px', md: 'auto' }}
        borderRadius={{ xs: 'full', md: '4px' }}
        backgroundColor='#F3F5FF'
        onClick={onClick}
      >
        <Box
          as='span'
          mr={2}
          color='black'
          display={{ xs: 'none', md: 'block' }}
        >
          Add to Timeline
        </Box>
        <Stack
          flexShrink={0}
          width={{ xs: '40px', md: '16px' }}
          height={{ xs: '40px', md: '16px' }}
          borderRadius='full'
          backgroundColor='brand.secondary'
          color='white'
          align='center'
          justify='center'
          fontSize={{ xs: '24px', md: '16px' }}
        >
          <Icon name='add' size='.5em' />
        </Stack>
      </Button>
    </Box>
  ) : null;
}
