import { ENV } from '../utils'

export class UserService {
  api = ENV.API_PATH

  async getMeApi(accesstoken) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.USER.GET_USER}`
      const params = {
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }
      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) {
        throw new Error('Unauthorized')
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async updateMeApi(accesstoken, userData) {
    try {
      const data = userData
      if (!data.bitrhDate) {
        delete data.birthDate
      }

      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))

      if (data.fileAvatar) {
        formData.append('avatar', data.fileAvatar)
      }

      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.USER.UPDATE_USER}`
      const params = {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
        body: formData,
      }

      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) {
        throw result
      }
      return result
    } catch (error) {
      throw error
    }
  }

  async deleteMeApi(accesstoken) {
    try {
      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.USER.DELETE_USER}`
      const params = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }

      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) {
        throw result
      }
      return result
    } catch (error) {
      throw error
    }
  }
}
