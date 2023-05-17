import { ENV } from '../utils'

export class ArtistService {
  api = ENV.API_PATH

  async getArtistsApi() {
    try {
      const url = `${this.api}${ENV.API_ROUTES.ARTIST.GET_ARTISTS}`
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

  async getArtistApi(artistId) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.ARTIST.GET_ARTIST}/${artistId}`
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

  async getArtistUserApi(accessToken) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.ARTIST.GET_ARTISTS_USER}`
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

  async createArtistApi(accessToken, artistData) {
    try {
      const data = artistData
      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))

      if (data.fileAvatar) {
        formData.append('avatar', data.fileAvatar)
      }

      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.ARTIST.CREATE_ARTIST}`
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

  async updateArtistApi(accessToken, artistData) {
    try {
      const data = artistData
      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))
      formData.delete('avatar')
      formData.delete('fileAvatar')

      if (data.fileAvatar) {
        formData.append('avatar', data.fileAvatar)
      }

      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.ARTIST.UPDATE_ARTIST}`
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

  async deleteArtistApi(accessToken) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.ARTIST.DELETE_ARTIST}`
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
}
