import React from 'react'
import { HashRouter } from 'react-router-dom'
import { AuthRouter, WebRouter } from './router'
import { AuthProvider } from './context'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <WebRouter />
        <AuthRouter />
      </HashRouter>
    </AuthProvider>
  )
}
