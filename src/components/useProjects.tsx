import { useEffect, useState } from "react";
import { getProjects } from "../services/data";

export const useProjects = () => {
  const [state, setState] = useState<{
    loading: boolean;
    projects: Array<any>;
  }>(() => {
    return { loading: true, projects: [] };
  });

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = getProjects((projects: any[]) => {
      setState({ loading: false, projects });
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return state;
};
