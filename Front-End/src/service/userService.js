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
}
