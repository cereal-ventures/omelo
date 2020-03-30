import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Box } from '@chakra-ui/core';

import { googleSignIn } from '../services';
import { updateUser, addProject } from '../services/data';

export default function GoogleAuthButton({
  label = 'Sign in with Google'
}: {
  label?: string;
}) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      isLoading={isLoading}
      variant='outline'
      position='relative'
      width='100%'
      onClick={e => {
        e.preventDefault();
        setIsLoading(true);
        googleSignIn()
          .then(
            async ({ user }) => {
              const creationTime = user?.metadata.creationTime;
              if (creationTime) {
                const diff = Math.abs(
                  new Date(Date.now()).getTime() -
                    new Date(creationTime).getTime()
                );
                if (diff < 5000) {
                  await updateUser().then(() =>
                    addProject({ name: 'My First Project' })
                  );
                }
              }
              history.push(`/${history.location.search}`);
            },
            e => Promise.reject(e)
          )
          .catch(() => {
            setIsLoading(false);
          });
      }}
    >
      <Box
        left='10px'
        position='absolute'
        top='50%'
        transform='translateY(-50%)'
      >
        <svg width='18px' height='18px' viewBox='0 0 18 18'>
          <g
            transform='translate(-15 -15) translate(15 15)'
            stroke='none'
            strokeWidth={1}
            fill='none'
            fillRule='evenodd'
          >
            <path
              d='M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z'
              fill='#4285F4'
            />
            <path
              d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z'
              fill='#34A853'
            />
            <path
              d='M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z'
              fill='#FBBC05'
            />
            <path
              d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z'
              fill='#EA4335'
            />
            <path d='M0 0L18 0 18 18 0 18z' />
          </g>
        </svg>
      </Box>
      {label}
    </Button>
  );
}
