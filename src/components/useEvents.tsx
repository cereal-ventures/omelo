import { useEffect, useState } from "react";
import { getEventsById } from "../services/data";

export const useEvents = (id: string='') => {
  const [state, setState] = useState<{
    loading: boolean;
    events: Array<any>;
  }>(() => {
    return { loading: true, events: [] };
  });

  useEffect(() => {
    // listen for auth state changes
    if(!id) return;
    const unsubscribe = getEventsById(id, (events: any[]) => {
      setState({ loading: false, events });
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [id]);

  return state;
};
