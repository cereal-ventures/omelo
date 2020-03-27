import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Image } from '@chakra-ui/core';

import { googleSignIn } from '../services';
import { updateUser, addProject } from '../services/data';
import googleIcon from '../images/google-icon.svg';

export default function GoogleAuthButton({
  label = 'Sign in with Google'
}: {
  label?: string;
}) {
  const history = useHistory();
  return (
    <Button
      variant='outline'
      position='relative'
      width='100%'
      onClick={e => {
        e.preventDefault();
        googleSignIn().then(async ({ user }) => {
          const creationTime = user?.metadata.creationTime;
          if (creationTime) {
            const diff = Math.abs(
              new Date(Date.now()).getTime() - new Date(creationTime).getTime()
            );
            if (diff < 5000) {
              await updateUser().then(() =>
                addProject({ name: 'My First Project' })
              );
            }
          }
          history.push(`/${history.location.search}`);
        });
      }}
    >
      <Image
        src={googleIcon}
        alt='Google Logo'
        left='10px'
        position='absolute'
        top='50%'
        transform='translateY(-50%)'
      />
      {label}
    </Button>
  );
}
