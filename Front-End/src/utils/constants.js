const SERVER_IP = 'localhost:3977';

export const ENV = {
  BASE_PATH: `http://${SERVER_IP}`,
  API_PATH: `http://${SERVER_IP}/api/v1`,
  API_ROUTES: {
    AUTH: {
      SING_IN: '/auth/sign-in',
      SING_UP: '/auth/sign-up',
      REFRESH_TOKEN: '/auth/refresh-access-token',
    },
  },
};