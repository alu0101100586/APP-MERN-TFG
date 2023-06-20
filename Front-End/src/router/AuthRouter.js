import React from 'react'
import { Route, Routes } from 'react-router-dom'
import {
  Auth,
  UserArtist,
  UserCommon,
  Newsletters,
  PaymentGateway,
} from '../pages/Authentication'
import { LogInLayout } from '../layouts'
import { useAuth } from '../hooks'

export function AuthRouter() {
  const { user } = useAuth()

  const loadLayout = (Layout, Page) => {
    return (
      <Layout>
        <Page />
      </Layout>
    )
  }

  const loadUserPage = () => {
    if (user.role === 'artist') return <UserArtist />
    else return <UserCommon />
  }

  return (
    <Routes>
      {!user ? (
        <Route path="/auth/*" element={<Auth />} />
      ) : (
        <>
          {['/auth/my-profile', '/auth/*'].map((path) => (
            <Route
              key={path}
              path={path}
              element={loadLayout(LogInLayout, loadUserPage)}
            />
          ))}
          <Route
            path="/auth/newsletters"
            element={loadLayout(LogInLayout, Newsletters)}
          />
          <Route
            path="/auth/payment/:id"
            element={loadLayout(LogInLayout, PaymentGateway)}
          />
        </>
      )}
    </Routes>
  )
}
