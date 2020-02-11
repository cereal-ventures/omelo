import React, { useState } from "react";
import uuid from "uuid";
import { Route } from "react-router-dom";
import { Grid } from "@chakra-ui/core";
// Components
import Timeline from "./Timeline";
import AddEventPanel from "./AddEventPanel";
import EventDetailPanel from "./EventDetailPanel";
import ProjectsPanel from "./ProjectsPanel";
import AddButton from "./AddButton";
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

const initialEvent = {
  id: uuid(),
  date: new Date(),
  isDisabled: true,
  completed: false,
  title: ""
}

export default function Main({ user }: Props) {
  const [events, updateEvents] = useState<Events>([ initialEvent]);

  return (
    <Grid
      justifyItems="center"
      alignItems="center"
      gridTemplateColumns="auto 1fr"
    >
      <ProjectsPanel user={user} />
      <Timeline events={events} />
      <Route path="/add-event">
        {({ match }) => {
          return (
            <AddEventPanel isOpen={Boolean(match)} addEvent={updateEvents} />
          );
        }}
      </Route>
      <Route path="/event/:id">
        {({ match }) => {
          if (!match) return null;
          const event = events.find(({ id }) => id === match.params.id);
          return event ? (
            <EventDetailPanel
              updateEvents={updateEvents}
              isOpen={Boolean(match)}
              {...event}
            />
          ) : null;
        }}
      </Route>
      <AddButton />
    </Grid>
  );
}
