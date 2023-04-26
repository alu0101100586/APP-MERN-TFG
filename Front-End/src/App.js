import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthRouter, WebRouter } from './router'
import { AuthProvider } from './context'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <WebRouter />
        <AuthRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}
