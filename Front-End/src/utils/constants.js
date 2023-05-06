const SERVER_IP = 'localhost:3977'

export const ENV = {
  BASE_PATH: `http://${SERVER_IP}`,
  API_PATH: `http://${SERVER_IP}/api/v1`,
  API_ROUTES: {
    AUTH: {
      SING_IN: '/auth/sign-in',
      SING_UP: '/auth/sign-up',
      REFRESH_TOKEN: '/auth/refresh-access-token',
      CHANGE_PASSWD: '/auth/change-password',
    },
    USER: {
      GET_USERS: '/users',
      GET_USER: '/user/me',
      UPDATE_USER: '/user/me',
      DELETE_USER: '/user/me',
    },
    DISC: {
      GET_DISCS: '/discs',
      GET_DISC: '/disc',
      GET_DISCS_USER: '/discs/user',
      CREATE_DISC: '/disc',
      UPDATE_DISC: '/disc',
      DELETE_DISC: '/disc',
      ADD_SONG: '/disc/song',
      DELETE_SONG: '/disc/song',
      BUY_DISC: '/buy/disc',
      RETURN_DISC: '/return/disc',
    },
    CONCERT: {
      GET_CONCERTS: '/concerts',
      GET_CONCERT: '/concert',
      GET_CONCERTS_USER: '/concerts/user',
      CREATE_CONCERT: '/concert',
      UPDATE_CONCERT: '/concert',
      DELETE_CONCERT: '/concert',
      ADD_PARTICIPANT: '/concert/participant',
      DELETE_PARTICIPANT: '/concert/participant',
      BUY_TICKET: '/buy/concert-ticket',
      RETURN_TICKET: '/return/concert-ticket',
    },
    MERCHANDISE: {
      GET_MERCHANDISES: '/merchandises',
      GET_MERCHANDISE: '/merchandise',
      GET_MERCHANDISES_USER: '/merchandises/user',
      CREATE_MERCHANDISE: '/merchandise',
      UPDATE_MERCHANDISE: '/merchandise',
      DELETE_MERCHANDISE: '/merchandise',
      ADD_SIZE: '/merchandise/size',
      DELETE_SIZE: '/merchandise/size',
      BUY_MERCHANDISE: '/buy/merchandise',
      RETURN_MERCHANDISE: '/return/merchandise',
    },
  },
  JWT: {
    ACCESS: 'accessToken',
    REFRESH: 'refreshToken',
  },
}
