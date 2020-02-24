import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {
  Grid,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from '@chakra-ui/core';

// Components
import Timeline from './Timeline';
import ProjectsPanel from './ProjectsPanel';
import ZeroState from './ZeroState';
import { useProjects } from './useProjects';
import { loadingScreen } from './loadingScreen';
// Types
import { User } from 'firebase';

interface Props {
  user: User | null;
}

type UseProjects = { loading: boolean; projects: any };

export default function Main({ user }: Props) {
  const { loading, projects }: UseProjects = useProjects(user?.email);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const hasProjects = Boolean(projects.length);
  return (
    <>
      <Grid
        justifyItems='center'
        alignItems='center'
        gridTemplateColumns={{ xs: '1fr', md: 'auto 1fr' }}
      >
        <Box display={{ xs: 'none', md: 'block' }}>
          <ProjectsPanel projects={projects} user={user} />
        </Box>

        <Route exact path='/'>
          {loading ? (
            loadingScreen
          ) : hasProjects ? (
            <Redirect to={`/${projects[0].id}`} />
          ) : (
            <ZeroState userEmail={user?.email} />
          )}
        </Route>
        <Route path='/:id'>
          {({ match }) => {
            const projectId = match?.params?.id || projects[0]?.id;
            const name = projects.find(({ id }: any) => id === projectId)?.name;
            return (
              <Timeline
                setIsPanelOpen={() => setIsPanelOpen(true)}
                projectName={name}
                projectId={projectId}
              />
            );
          }}
        </Route>
      </Grid>
      <Drawer
        placement='left'
        onClose={() => setIsPanelOpen(false)}
        isOpen={isPanelOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <ProjectsPanel projects={projects} user={user} />
        </DrawerContent>
      </Drawer>
    </>
  );
}
