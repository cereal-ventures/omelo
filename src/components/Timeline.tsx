import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, Route } from 'react-router-dom';
import { Grid } from '@chakra-ui/core';
import Event from './Event';
import AddButton from './AddButton';
import { useEvents } from './hooks/useEvents';
import AddEventPanel from './AddEventPanel';
import EventDetailPanel from './EventDetailPanel';
import ProjectTitle from './ProjectTitle';

type TimelineProps = {
  projectId: string;
  projectName: string;
  setIsPanelOpen: () => void;
};

function getIsOverdue(date: Date) {
  return new Date(date) < new Date(Date.now());
}

const HEIGHT_OFFSET = 200;

export default function Timeline({
  projectId,
  projectName,
  setIsPanelOpen
}: TimelineProps) {
  const history = useHistory();
  const { events } = useEvents(projectId);
  const [height, setHeight] = useState<string | number>('100vh');

  const lastCompletedIndex = events
    .map(({ completed }) => completed)
    .lastIndexOf(true);

  const fillHeight =
    lastCompletedIndex >= 0 ? 20 + 100 * lastCompletedIndex : 0;

  const { length } = events;

  const handleResize = useCallback(() => {
    if (length * 100 + HEIGHT_OFFSET > window.innerHeight) {
      setHeight(length * 100 + HEIGHT_OFFSET);
    }
  }, [length]);

  useEffect(() => {
    handleResize();
  }, [length, handleResize]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <>
      <Grid
        cursor='pointer'
        position='relative'
        width='100%'
        justifyItems='center'
        height='100vh'
        overflow='auto'
      >
        <ProjectTitle
          setIsPanelOpen={setIsPanelOpen}
          projectId={projectId}
          projectName={projectName}
        />
        <svg overflow='visible' width={20} height={height}>
          <rect
            className='timeline'
            onClick={() => history.push(`/${projectId}/add-event`)}
            fill='#F5F6FC'
            width='100%'
            rx='10'
            height={height}
          />
          <rect
            rx='10'
            y={190}
            fill='#9CBD3B'
            width='100%'
            height={fillHeight}
          />
          {events.map(({ date, title, id, completed }, i) => {
            return (
              <Event
                key={id}
                y={HEIGHT_OFFSET + 100 * i}
                date={date}
                title={title}
                isOverdue={getIsOverdue(date) && !completed}
                handleClick={() => history.push(`/${projectId}/event/${id}`)}
              />
            );
          })}
        </svg>
        <AddButton onClick={() => history.push(`/${projectId}/add-event`)} />
      </Grid>
      <Route path='/:id/add-event'>
        {({ match }) => {
          return (
            <AddEventPanel
              isOpen={Boolean(match)}
              projectId={match?.params?.id}
            />
          );
        }}
      </Route>
      <Route path='/:id/event/:event'>
        {({ match }) => {
          const event = events.find(({ id }) => id === match?.params?.event);
          return (
            <EventDetailPanel
              projectId={match?.params?.id}
              isOpen={Boolean(match)}
              {...event}
            />
          );
        }}
      </Route>
    </>
  );
}
