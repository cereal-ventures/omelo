import { useEffect, useState } from 'react';
import { getProjects, UserEmail } from '../../services/data';

export const useProjects = (userEmail: UserEmail) => {
  const [state, setState] = useState<{
    loading: boolean;
    projects: Array<any>;
  }>(() => {
    return { loading: true, projects: [] };
  });

  useEffect(() => {
    // listen for auth state changes
    if (!userEmail) return;
    const unsubscribe = getProjects(userEmail, (projects: any[]) => {
      setState({ loading: false, projects });
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [userEmail]);

  return state;
};
