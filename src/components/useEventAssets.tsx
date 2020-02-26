import { useEffect, useState } from 'react';
import { getAssetsByEvent } from '../services/data';

export const useEventAssets = (eventId: string) => {
  const [state, setState] = useState<{
    loading: boolean;
    assets: Array<any>;
  }>(() => {
    return { loading: true, assets: [] };
  });

  useEffect(() => {
    // listen for auth state changes
    if (!eventId) return;
    const unsubscribe = getAssetsByEvent(eventId, (assets: any[]) => {
      setState({ loading: false, assets });
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [eventId]);

  return state;
};
