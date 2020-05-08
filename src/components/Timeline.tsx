import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useHistory, Route } from 'react-router-dom';
import { Grid, useDisclosure, Box } from '@chakra-ui/core';
import Event from './Event';
import AddButton from './AddButton';
import AddEventPanel from './AddEventPanel';
import EventDetailPanel from './EventDetailPanel';
import ProjectTitle from './ProjectTitle';
import AcceptInviteModal from './AcceptInviteModal';
import { getIsOverdue } from '../utils';
import { validateInvite } from '../services/data';
import { ProjectContext } from './ProjectContext';

type TimelineProps = {
  invite?: string | null;
  inviteName?: string | null;
  projectId: string;
  projectName: string;
  setIsPanelOpen: () => void;
  users?: Array<any>;
};

const HEIGHT_OFFSET = 200;

export default function Timeline({
  users = [],
  invite,
  inviteName,
  projectId,
  projectName,
  setIsPanelOpen
}: TimelineProps) {
  const history = useHistory();
  const { events, permission } = useContext(ProjectContext);
  const [height, setHeight] = useState<string | number>('100vh');
  const { isOpen, onClose, onOpen } = useDisclosure(false);

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
    if (invite) {
      (async () => {
        const isValid = await validateInvite(invite);
        if (isValid) {
          onOpen();
        }
      })();
    }
  }, [invite, onOpen]);

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
      <AcceptInviteModal
        isOpen={isOpen}
        onClose={onClose}
        invite={invite}
        projectName={inviteName}
      />
      <Grid
        position='relative'
        width='100%'
        justifyItems='center'
        height='100vh'
        overflow='auto'
      >
        {projectName && (
          <ProjectTitle
            users={users}
            setIsPanelOpen={setIsPanelOpen}
            projectId={projectId}
            projectName={projectName}
          />
        )}
        <Box
          style={{ cursor: 'pointer' }}
          className='timeline'
          position='absolute'
          onClick={() => history.push(`/${projectId}/add-event`)}
          backgroundColor='#F5F6FC'
          width='20px'
          borderRadius='10px'
          height={height}
        />
        <Box
          style={{ transition: 'height .2s ease-in-out' }}
          position='absolute'
          borderRadius='10px'
          top={HEIGHT_OFFSET}
          backgroundColor='#9CBD3B'
          width='20px'
          height={fillHeight}
        />
        <Grid
          gridTemplateRows='repeat(auto-fit, minmax(min-content, 100px))'
          position='relative'
          width='100%'
          top={HEIGHT_OFFSET}
        >
          {events.map(
            ({ date, title, id, completed, commentCount, assetCount }, i) => {
              return (
                <Event
                  key={id}
                  date={date}
                  title={title}
                  completed={completed}
                  commentCount={commentCount}
                  assetCount={assetCount}
                  isOverdue={getIsOverdue(date) && !completed}
                  handleClick={() => history.push(`/${projectId}/event/${id}`)}
                />
              );
            }
          )}
        </Grid>
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
              isViewOnly={['viewer', 'commenter'].includes(permission)}
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
