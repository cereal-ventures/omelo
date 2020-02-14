import { useEffect, useState } from 'react';
import { getAuthState, getCurrentUser } from '../services';

export const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = getCurrentUser();
    return { loading: !user, user };
  });

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = getAuthState((user: any) => {
      setState({ loading: false, user });
    });
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return state;
};
