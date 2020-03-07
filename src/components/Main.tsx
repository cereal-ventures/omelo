import React, { useState } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
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
import { useProjects } from './hooks/useProjects';
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
  const history = useHistory();

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
            <Redirect to={`/${projects[0].id}${history.location.search}`} />
          ) : (
            <ZeroState />
          )}
        </Route>
        <Route path='/:id'>
          {({ match, location }) => {
            const projectId = match?.params?.id || projects[0]?.id;
            const project = projects.find(({ id }: any) => id === projectId);
            const params = new URLSearchParams(location.search);
            return (
              <Timeline
                invite={params.get('invite')}
                inviteName={params.get('name')}
                setIsPanelOpen={() => setIsPanelOpen(true)}
                projectName={project?.name}
                users={project?.userProfiles}
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
