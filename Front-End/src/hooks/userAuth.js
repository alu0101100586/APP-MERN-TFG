import { useContext } from 'react';
import { AuthContext } from '../context';

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};