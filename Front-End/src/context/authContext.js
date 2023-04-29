import { useState, useEffect, createContext } from 'react'
import { UserService, Auth } from '../service'
import { isExpiredToken } from '../utils'

const userService = new UserService()
const authService = new Auth()

export const AuthContext = createContext()

export function AuthProvider(props) {
  const { children } = props
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)

  useEffect(() => {
    ;(async () => {
      const accessToken = authService.getAccessToken()
      const refreshToken = authService.getRefreshToken()

      if (!accessToken || !refreshToken) {
        logout()
        setLoading(false)
        return
      }

      if (isExpiredToken(accessToken)) {
        if (isExpiredToken(refreshToken)) {
          logout()
        } else {
          await reLogin(refreshToken)
        }
      } else {
        await login(accessToken)
      }

      setLoading(false)
    })()
  }, [])

  const login = async (accessToken) => {
    try {
      const response = await userService.getMeApi(accessToken)
      delete response.password

      setUser(response)
      setToken(accessToken)
    } catch (error) {
      console.error(error)
    }
  }

  const reLogin = async (refreshToken) => {
    try {
      const response = await authService.refreshTokenApi(refreshToken)
      const { accessToken } = response
      authService.setAccessToken(accessToken)
      await login(accessToken)
    } catch (error) {
      console.error(error)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    authService.removeTokens()
  }

  const data = {
    accessToken: token,
    user,
    login,
    logout,
  }

  if (loading) return null

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>
}
