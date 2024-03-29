import { get } from 'lodash'
import { ENV } from '../utils'

export class DiscService {
  api = ENV.API_PATH

  async getDiscsApi() {
    try {
      const url = `${this.api}${ENV.API_ROUTES.DISC.GET_DISCS}`
      const params = {
        method: 'GET',
      }
      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async getDiscApi(discId) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.DISC.GET_DISC}/${discId}`
      const params = {
        method: 'GET',
      }
      const response = await fetch(url, params)

      const result = await response.json()

      if (response.status !== 200) {
        return { status: response.status }
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async getDiscsUserApi(accessToken, page = 1, limit = 3) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.DISC.GET_DISCS_USER}?page=${page}&limit=${limit}`
      const params = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async getDiscsArtistApi(artistId) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.DISC.GET_DISCS_ARTIST}/${artistId}`
      const params = {
        method: 'GET',
      }
      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async createDiscApi(accessToken, discData) {
    try {
      const data = discData
      const genres = data.musicalGenre
      const songs = data.songs
      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))

      if (data.fileCover) {
        formData.append('cover', data.fileCover)
      }

      if (genres) {
        formData.delete('musicalGenre')
        genres.forEach((genre) => formData.append('musicalGenre', genre))
      }

      if (songs) {
        formData.delete('songs')
        songs.forEach((song) => formData.append('songs', song))
      }

      const url = `${this.api}${ENV.API_ROUTES.DISC.CREATE_DISC}`
      const params = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }

      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 201) {
        throw new Error('UnExpected Error')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async updateDiscApi(accessToken, discData, discId) {
    try {
      const data = discData
      const genres = data.musicalGenre
      const songs = data.songs
      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))

      if (data.item) {
        formData.delete('item')
      }

      if (data.fileCover) {
        formData.append('cover', data.fileCover)
      }

      if (genres) {
        formData.delete('musicalGenre')
        genres.forEach((genre) => formData.append('musicalGenre', genre))
      }

      if (songs) {
        formData.delete('songs')
        songs.forEach((song) => formData.append('songs', song))
      }

      const url = `${this.api}${ENV.API_ROUTES.DISC.UPDATE_DISC}/${discId}`
      const params = {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }

      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async deleteDiscApi(accessToken, discId) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.DISC.DELETE_DISC}/${discId}`
      const params = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }

      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async addSongApi(accessToken, discData, discId) {
    try {
      const data = discData
      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))

      const url = `${this.api}${ENV.API_ROUTES.DISC.ADD_SONG}/${discId}`
      const params = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }

      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 201) {
        throw new Error('UnExpected Error')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async deleteSongApi(accessToken, discData, discId) {
    try {
      const data = discData
      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))

      const url = `${this.api}${ENV.API_ROUTES.DISC.DELETE_SONG}/${discId}`
      const params = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }

      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async buyDiscApi(accessToken, discId) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.DISC.BUY_DISC}/${discId}`
      const params = {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }

      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) {
        response.msg =
          'El disco ya fue comprado anteriormente o no puedes comprarlo'
        return { status: response.status, msg: response.msg }
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async returnDiscApi(accessToken, discId) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.DISC.RETURN_DISC}/${discId}`
      const params = {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }

      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) {
        throw new Error('UnExpected Error')
      }
      return result
    } catch (error) {
      throw error
    }
  }
}
