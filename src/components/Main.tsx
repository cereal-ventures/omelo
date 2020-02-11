import React from "react";
import uuid from "uuid";
import { Route, Redirect } from "react-router-dom";
import { Grid } from "@chakra-ui/core";

// Components
import Timeline from "./Timeline";
import AddEventPanel from "./AddEventPanel";
import EventDetailPanel from "./EventDetailPanel";
import ProjectsPanel from "./ProjectsPanel";
import AddButton from "./AddButton";
import { useProjects } from "./useProjects";
// Types
import { User } from "firebase";

interface Props {
  user: User | null;
}

type Event = {
  id: string;
  date: Date;
  title: string;
  completed: boolean;
  isDisabled: boolean;
};

type Events = Array<Event>;

type Project = {
  id: string;
  name: string;
  events: Events;
};

type Projects = Array<Project>;

const initialEvent = {
  id: uuid(),
  date: new Date(),
  isDisabled: true,
  completed: false,
  title: ""
};

export default function Main({ user }: Props) {
  const {
    loading,
    projects
  }: { loading: boolean; projects: any } = useProjects();

  if (loading) return null;

  const events = [initialEvent];

  const updateEvent = () => {};

  const main = projects.length ? (
    <>
      <Route exact path="/">
        <Redirect to={`/{${projects[0].id}}`} />
      </Route>
      <Route path="/:id">
        {({ match }) => {
          const projectId = match?.params?.id || projects[0].id;
          const name = projects.find(({ id }: any) => id === projectId)?.name;
          return <Timeline projectName={name} projectId={projectId} />;
        }}
      </Route>
      <Route path="/:id/add-event">
        {({ match }) => {
          return (
            <AddEventPanel
              isOpen={Boolean(match)}
              projectId={match?.params?.id}
            />
          );
        }}
      </Route>
      <Route path="/:id/event/:id">
        {({ match }) => {
          if (!match) return null;
          const event = events.find(({ id }) => id === match.params.id);
          return event ? (
            <EventDetailPanel
              updateEvent={updateEvent}
              isOpen={Boolean(match)}
              {...event}
            />
          ) : null;
        }}
      </Route>
    </>
  ) : null;

  return (
    <Grid
      justifyItems="center"
      alignItems="center"
      gridTemplateColumns="auto 1fr"
    >
      <ProjectsPanel projects={projects} user={user} />
      {main}
    </Grid>
  );
}
