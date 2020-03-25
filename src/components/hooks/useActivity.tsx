import { useEffect, useState } from 'react';
import { getEventActivity } from '../../services/data';

export const useActivity = ({
  eventId,
  projectId
}: {
  eventId: string;
  projectId: string;
}) => {
  const [state, setState] = useState<{
    loading: boolean;
    activity: Array<any>;
  }>(() => {
    return { loading: true, activity: [] };
  });

  useEffect(() => {
    // listen for auth state changes
    if (!eventId) return;
    const unsubscribe = getEventActivity(
      { eventId, projectId },
      (activity: any[]) => {
        setState({ loading: false, activity });
      }
    );
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [eventId, projectId]);

  return state;
};
