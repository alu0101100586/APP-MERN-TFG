import { ENV } from '../utils'

export class NewslettersService {
  api = ENV.API_PATH

  async getEmailsApi(accessToken) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.NEWSLETTERS.GET_EMAILS}`
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

  async newSubscriptionApi(accessToken, email) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.NEWSLETTERS.NEW_SUBSCRIPTION}`
      const params = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
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

  async cancelSubscriptionApi(accessToken, email) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.NEWSLETTERS.CANCEL_SUBSCRIPTION}`
      const params = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
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
