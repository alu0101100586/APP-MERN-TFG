import { ENV } from "../utils";

export class ConcertService {
  api = ENV.API_PATH;

  async getConcertsApi() {
    try {
      const url = `${this.api}${ENV.API_ROUTES.CONCERT.GET_CONCERTS}`;
      const params = {
        method: "GET",
      };
      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) {
        throw new Error("UnExpected Error");
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getConcertApi(concertId) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.CONCERT.GET_CONCERT}/${concertId}`;
      const params = {
        method: "GET",
      };
      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) {
        throw new Error("UnExpected Error");
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getConcertsUserApi(accessToken, page = 1, limit = 3) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.CONCERT.GET_CONCERTS_USER}?page=${page}&limit=${limit}`;
      const params = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) {
        throw new Error("UnExpected Error");
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async createConcertApi(accessToken, concertData) {
    try {
      const data = concertData;
      const genres = data.musicalGenre;
      const participants = data.participants;
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      if (data.fileConcertPoster) {
        formData.append("concertPoster", data.fileConcertPoster);
      }

      if (genres) {
        formData.delete('musicalGenre')
        genres.forEach((genre) => formData.append('musicalGenre', genre))
      }

      if (participants) {
        formData.delete("participants");
        participants.forEach((participant) =>
          formData.append("participants", participant)
        );
      }

      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.CONCERT.CREATE_CONCERT}`;
      const params = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };
      
      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 201) {
        throw new Error('UnExpected Error')
      }
      return result;
    } catch (error) {
     throw error; 
    }
  }

  async updateConcertApi(accessToken, concertId, concertData) {
    try {
      const data = concertData;
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      if (data.filePoster) {
        formData.append("poster", data.filePoster);
      }

      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.CONCERT.UPDATE_CONCERT}/${concertId}`;
      const params = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteConcertApi(accessToken, concertId) {
    try {
      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.CONCERT.DELETE_CONCERT}/${concertId}`;
      const params = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async addParticipantApi(accessToken, concertId, participantName) {
    try {
      const data = concertData;
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.CONCERT.ADD_PARTICIPANT}/${concertId}`;
      const params = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteParticipantApi(accessToken, concertId, participantName) {
    try {
      const data = concertData;
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.CONCERT.DELETE_PARTICIPANT}/${concertId}`;
      const params = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async buyTicketApi(accessToken, concertId) {
    try {
      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.CONCERT.BUY_TICKET}/${concertId}`;
      const params = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();
      
      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async returnTicketApi(accessToken, concertId) {
    try {
      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.CONCERT.RETURN_TICKET}/${concertId}`;
      const params = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
