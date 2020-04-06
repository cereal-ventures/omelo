import React from 'react';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger,
  PopoverContent,
  Icon,
  Button,
  Link,
  Text,
  PopoverHeader,
  Avatar
} from '@chakra-ui/core';

import { signOut } from '../services';

import { User } from 'firebase';

export default function UserDropdown({ user }: { user: User | null }) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          color='brand.secondary'
          variant='unstyled'
          display='inline-flex'
          height='auto'
        >
          <Avatar size='xs' src={user?.photoURL || ''} mr={2} />
          <Text
            as='span'
            display='inline-block'
            fontSize='sm'
            overflow='hidden'
            maxWidth='200px'
          >
            {user && (user.displayName || user.email)}
          </Text>
          <Icon name='chevron-down' />
        </Button>
      </PopoverTrigger>
      <PopoverContent zIndex={4} width='240px'>
        <PopoverArrow />
        <PopoverHeader>User Settings</PopoverHeader>
        <PopoverBody>
          <Link color='brand.secondary' as='button' onClick={() => signOut()}>
            Log out
          </Link>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
