import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, Route, useParams } from 'react-router-dom';
import { Grid, Heading, Box } from '@chakra-ui/core';
import Event from './Event';
import { useEvents } from './hooks/useEvents';
import EventDetailPanel from './EventDetailPanel';
import { useProject } from './hooks/useProject';
import { loadingScreen } from './loadingScreen';
import { getIsOverdue } from '../utils';

const HEIGHT_OFFSET = 200;

export default function PublicTimeline() {
  const history = useHistory();
  const { id: projectId } = useParams();
  const { loading, project } = useProject(projectId);
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

  if (loading) {
    return loadingScreen;
  }

  return (
    <>
      <Grid
        position='relative'
        width='100%'
        justifyItems='center'
        height='100vh'
        overflow='auto'
      >
        <Box
          display='flex'
          alignItems='center'
          p={8}
          position='fixed'
          width='100%'
          top='0px'
        >
          <Heading size='sm'>{project.name}</Heading>
        </Box>

        <svg overflow='visible' width={20} height={height}>
          <rect
            className='timeline'
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
          {events.map(
            ({ date, title, id, completed, assetCount, commentCount }, i) => {
              return (
                <Event
                  key={id}
                  completed={completed}
                  y={HEIGHT_OFFSET + 100 * i}
                  date={date}
                  title={title}
                  assetCount={assetCount}
                  commentCount={commentCount}
                  isOverdue={getIsOverdue(date) && !completed}
                  handleClick={() =>
                    history.push(`/public/${projectId}/event/${id}`)
                  }
                />
              );
            }
          )}
        </svg>
      </Grid>
      <Route path='/public/:id/event/:event'>
        {({ match }) => {
          if (!match) return null;
          const event = events.find(({ id }) => id === match.params.event);
          return (
            <EventDetailPanel
              isViewOnly
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
