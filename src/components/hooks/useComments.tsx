import { useEffect, useState } from 'react';
import { getCommentsByEvent } from '../../services/data';

export const useComments = ({
  eventId,
  projectId
}: {
  eventId: string;
  projectId: string;
}) => {
  const [state, setState] = useState<{
    loading: boolean;
    comments: Array<any>;
  }>(() => {
    return { loading: true, comments: [] };
  });

  useEffect(() => {
    // listen for auth state changes
    if (!eventId) return;
    const unsubscribe = getCommentsByEvent(
      { eventId, projectId },
      (comments: any[]) => {
        setState({ loading: false, comments });
      }
    );
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [eventId, projectId]);

  return state;
};
