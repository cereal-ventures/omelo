import { useEffect, useState } from 'react';
import { getProjectById, ProjectId } from '../../services/data';

export const useProject = (projectId: ProjectId) => {
  const [state, setState] = useState<{
    loading: boolean;
    project: { [x: string]: any };
  }>(() => {
    return { loading: true, project: {} };
  });

  useEffect(() => {
    // listen for auth state changes
    if (!projectId) return;
    const unsubscribe = getProjectById(
      projectId,
      (project: { [x: string]: any }) => {
        setState({ loading: false, project });
      }
    );
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, [projectId]);

  return state;
};
