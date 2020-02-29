import { useEffect, useState } from 'react';
import { getAssetsByEvent } from '../../services/data';

export const useEventAssets = ({
  projectId,
  eventId
}: {
  projectId: string;
  eventId: string;
}) => {
  const [state, setState] = useState<{
    loading: boolean;
    assets: Array<any>;
  }>(() => {
    return { loading: true, assets: [] };
  });

  useEffect(() => {
    // listen for auth state changes
    if (!eventId && !projectId) return;
    const unsubscribe = getAssetsByEvent(
      { eventId, projectId },
      (assets: any[]) => {
        setState({ loading: false, assets });
      }
    );
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [eventId, projectId]);

  return state;
};
