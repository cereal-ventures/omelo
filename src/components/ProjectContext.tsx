import React, { useState, useEffect, ReactElement } from 'react';
import { useEvents } from './hooks/useEvents';
import { getProjectPermissions } from '../services/data';
import { loadingScreen } from './loadingScreen';

export const ProjectContext = React.createContext<{
  events: Array<any>;
  permission: string;
}>({
  events: [],
  permission: ''
});

export const ProjectProvider = ({
  projectId,
  children
}: {
  projectId: string;
  children: ReactElement;
}) => {
  const [permission, setPermission] = useState('');
  const { loading, events } = useEvents(projectId);

  const isLoading = loading && Boolean(permission);

  useEffect(() => {
    const getPermissions = async () => {
      const permission = await getProjectPermissions(projectId);
      setPermission(permission);
    };
    getPermissions();
  }, [projectId]);

  return (
    <ProjectContext.Provider value={{ events, permission }}>
      {isLoading ? loadingScreen : children}
    </ProjectContext.Provider>
  );
};
