import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Grid } from "@chakra-ui/core";

// Components
import Timeline from "./Timeline";
import ProjectsPanel from "./ProjectsPanel";
import { useProjects } from "./useProjects";
// Types
import { User } from "firebase";

interface Props {
  user: User | null;
}

export default function Main({ user }: Props) {
  const { projects }: { loading: boolean; projects: any } = useProjects(
    user?.uid
  );

  return (
    <Grid
      justifyItems="center"
      alignItems="center"
      gridTemplateColumns="auto 1fr"
    >
      <ProjectsPanel projects={projects} user={user} />
      {projects.length ? (
        <>
          <Route exact path="/">
            <Redirect to={`/${projects[0].id}`} />
          </Route>
          <Route path="/:id">
            {({ match }) => {
              const projectId = match?.params?.id || projects[0].id;
              const { name } = projects.find(({ id }: any) => id === projectId);
              return <Timeline projectName={name} projectId={projectId} />;
            }}
          </Route>
        </>
      ) : null}
    </Grid>
  );
}
