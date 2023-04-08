import jwtDecode from 'jwt-decode';

export const isExpiredToken = (token) => {
  const { exp } = jwtDecode(token);
  const now = new Date().getTime();
  return exp < now;
}