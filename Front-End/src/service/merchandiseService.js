import { ENV } from '../utils'

export class MerchandiseService {
  api = ENV.API_PATH

  async getMerchandisesApi() {
    try {
      const url = `${this.api}${ENV.API_ROUTES.MERCHANDISE.GET_MERCHANDISES}`
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

  async getMerchandiseApi(merchandiseId) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.MERCHANDISE.GET_MERCHANDISE}/${merchandiseId}`
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

  async getMerchandiseUserApi(accessToken, page = 1, limit = 3) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.MERCHANDISE.GET_MERCHANDISES_USER}?page=${page}&limit=${limit}`
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

  async createMerchandiseApi(accessToken, merchandiseData) {
    try {
      const data = merchandiseData
      const sizes = data.size
      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))

      if (data.fileImage) {
        formData.append('image', data.fileImage)
      }

      if (sizes) {
        formData.delete('size')
        sizes.forEach((size) => formData.append('size', size))
      }

      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.MERCHANDISE.CREATE_MERCHANDISE}`
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
      return 0
    } catch (error) {
      throw error
    }
  }

  async updateMerchandiseApi(accessToken, merchandiseData, merchandiseId) {
    try {
      const data = merchandiseData
      const sizes = data.size
      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))

      if (data.fileImage) {
        formData.append('image', data.fileImage)
      }

      if (sizes) {
        formData.delete('size')
        sizes.forEach((size) => formData.append('size', size))
      }

      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.MERCHANDISE.UPDATE_MERCHANDISE}/${merchandiseId}`
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

  async deleteMerchandiseApi(accessToken, merchandiseId) {
    try {
      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.MERCHANDISE.DELETE_MERCHANDISE}/${merchandiseId}`
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

  async addSizeApi(accessToken, merchandiseId, sizeData) {
    try {
      const data = sizeData
      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))

      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.MERCHANDISE.ADD_SIZE}/${merchandiseId}`
      const params = {
        method: 'POST',
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

  async deleteSizeApi(accessToken, merchandiseId, sizeData) {
    try {
      const data = sizeData
      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))

      const url = `${ENV.API_PATH}/${ENV.API_ROUTES.MERCHANDISE.DELETE_SIZE}/${merchandiseId}`
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

  async buyMerchandiseApi(accessToken, merchandiseId) {
    try {
      const url = `${ENV.API_PATH}${ENV.API_ROUTES.MERCHANDISE.BUY_MERCHANDISE}/${merchandiseId}`
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

  async returnMerchandiseApi(accessToken, merchandiseId) {
    try {
      const url = `${ENV.API_PATH}${ENV.API_ROUTES.MERCHANDISE.RETURN_MERCHANDISE}/${merchandiseId}`
      console.log(url)
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
