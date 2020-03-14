import React from 'react';
import { User } from 'firebase';

import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  Box,
  Button,
  Link,
  Heading,
  Grid,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Switch,
  FormLabel,
  PopoverFooter,
  Tooltip
} from '@chakra-ui/core';

import { addProject, removeProject, updateProject } from '../services/data';
import UserDropdown from './UserDropdown';

import { logo } from './icons';

interface Props {
  user: User | null;
  projects: any[];
}

const logoEl = (
  <Flex width='100%' justifyContent='center' alignItems='center' p={4}>
    {logo}
  </Flex>
);

export default function ProjectsPanel({ user, projects = [] }: Props) {
  const history = useHistory();
  const projectId = useRouteMatch<{ id: string }>('/:id')?.params?.id;

  return (
    <Grid
      width={{ xs: '100%', md: '275px' }}
      gridTemplateRows='auto 1fr auto'
      gridTemplateColumns='100%'
      justifyItems='left'
      padding={8}
      pt={10}
      borderRight={{ md: '1px solid lightgrey' }}
      height='100vh'
    >
      <UserDropdown user={user} />
      <Box mt={8} width='100%'>
        <Flex justifyContent='space-between' alignItems='center' mb={4}>
          <Heading
            color='brand.secondary'
            as='h4'
            size='xs'
            textTransform='uppercase'
          >
            Projects:
          </Heading>
          <Button
            size='xs'
            variant='outline'
            color='brand.secondary'
            textTransform='uppercase'
            onClick={() => {
              addProject({ name: 'My Project' });
            }}
          >
            Add
          </Button>
        </Flex>

        <Box mt={8}>
          {projects.map(({ name, id, isPublic, eventCount, owner }: any) => {
            const countLabel = `${eventCount || 0} ${
              eventCount === 1 ? 'Event' : 'Events'
            }`;
            const isActive = id === projectId;
            return (
              <Flex
                key={id}
                mb={4}
                alignItems='center'
                justifyContent='space-between'
              >
                <Link
                  color='brand.secondary'
                  as='button'
                  display='flex'
                  alignItems='center'
                  fontSize='sm'
                  minHeight='auto'
                  onClick={() => history.push(`/${id}`)}
                >
                  <Tooltip
                    hasArrow
                    placement='top'
                    aria-label={countLabel}
                    label={countLabel}
                  >
                    <Box
                      display='inline-flex'
                      alignItems='center'
                      justifyContent='center'
                      width='24px'
                      height='24px'
                      borderRadius='50%'
                      backgroundColor='brand.secondary'
                      color='white'
                      opacity={isActive ? 1 : 0.4}
                      marginRight={2}
                    >
                      <Box
                        as='span'
                        position='relative'
                        top='-1px'
                        fontSize='10px'
                        fontWeight='bold'
                      >
                        {eventCount || 0}
                      </Box>
                    </Box>
                  </Tooltip>
                  {name}
                </Link>

                {owner === user?.uid && (
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        position='relative'
                        top='-4px'
                        height='auto'
                        minWidth='auto'
                        variant='unstyled'
                      >
                        &#8230;
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent zIndex={4} width='200px'>
                      <PopoverArrow />
                      <PopoverHeader>
                        <Heading as='h6' size='sm' fontWeight='semibold'>
                          Project Settings
                        </Heading>
                      </PopoverHeader>
                      <PopoverBody>
                        <Flex align='center' justify='space-between'>
                          <FormLabel
                            p={0}
                            fontWeight='normal'
                            textAlign='right'
                            htmlFor='set-visibility'
                          >
                            {isPublic ? 'Shared' : 'Private'}
                          </FormLabel>
                          <Switch
                            id='set-visibility'
                            defaultIsChecked={isPublic}
                            value={isPublic}
                            color='purple'
                            onChange={() => {
                              updateProject({
                                projectId: id,
                                payload: { isPublic: !isPublic }
                              });
                            }}
                          />
                        </Flex>
                      </PopoverBody>
                      <PopoverFooter>
                        <Link
                          as='button'
                          color='red.400'
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete this project?'
                              )
                            ) {
                              removeProject(id)?.then(() => {
                                history.push('/');
                              });
                            }
                          }}
                        >
                          Delete Project
                        </Link>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                )}
              </Flex>
            );
          })}
        </Box>
      </Box>
      {logoEl}
    </Grid>
  );
}
