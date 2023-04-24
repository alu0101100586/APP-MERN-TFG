import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Auth, User, Newsletters, PaymentGateway } from '../pages/Authentication';
import { LogInLayout } from '../layouts';
import { useAuth } from '../hooks';

export function AuthRouter() {
  const { user } = useAuth();

  const loadLayout = (Layout, Page) => {
    return (
      <Layout>
        <Page />
      </Layout> 
    )
  }

  return (
    <Routes>
      {!user ? (
        <Route path="/auth/*" element={<Auth />} />
      ): (
        <>
          {["/auth/my-profile", "/auth", "/auth/me"].map((path) => (
            <Route 
              key={path}
              path={path} 
              element={loadLayout(LogInLayout, User)} 
            />
          ))}
          <Route 
            path="/auth/newsletters" 
            element={loadLayout(LogInLayout, Newsletters)} />
          <Route
            path="/auth/payment"
            element={loadLayout(LogInLayout, PaymentGateway)} />
        </>
      )}
    </Routes>
  )
}