import { ENV } from '../utils'

export class Auth {
  api = ENV.API_PATH

  async signInApi(formData) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.AUTH.SING_IN}`
      const params = {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) throw result

      return result
    } catch (error) {
      throw error
    }
  }

  async signUpApi(formData) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.AUTH.SING_UP}`
      const params = {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          nickName: formData.nickName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate.toISOString().slice(0, 10),
          password: formData.password,
          role: formData.role,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await fetch(url, params)
      const result = await response.json()
      console.log(response)

      if (response.status !== 200) throw result

      return result
    } catch (error) {
      throw error
    }
  }

  async refreshTokenApi(refreshToken) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.AUTH.REFRESH_TOKEN}`
      const params = {
        method: 'POST',
        body: JSON.stringify({ token: refreshToken }),
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await fetch(url, params)
      const result = await response.json()

      if (response.status !== 200) throw result
      return result
    } catch (error) {
      throw error
    }
  }

  setAccessToken(token) {
    localStorage.setItem(ENV.JWT.ACCESS, token)
  }

  getAccessToken() {
    return localStorage.getItem(ENV.JWT.ACCESS)
  }

  removeAccessToken() {
    localStorage.removeItem(ENV.JWT.ACCESS)
  }

  setRefreshToken(token) {
    localStorage.setItem(ENV.JWT.REFRESH, token)
  }

  getRefreshToken() {
    return localStorage.getItem(ENV.JWT.REFRESH)
  }

  removeRefreshToken() {
    localStorage.removeItem(ENV.JWT.REFRESH)
  }

  removeTokens() {
    this.removeAccessToken()
    this.removeRefreshToken()
  }
}
