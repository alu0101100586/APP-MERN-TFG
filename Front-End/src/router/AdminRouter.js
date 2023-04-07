import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Auth, User, Menu, Newsletters, PaymentGateway } from '../pages/Admin';
import { AdminLayout } from '../layouts';

const user = null;

export function AdminRouter() {
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
          {["/auth", "/auth/my-profile"].map((path) => (
            <Route 
              key={path}
              path={path} 
              element={loadLayout(AdminLayout, User)} 
            />
          ))}
          <Route path="/auth/menu" element={loadLayout(AdminLayout, Menu)} />
          <Route 
            path="/auth/newsletters" 
            element={loadLayout(AdminLayout, Newsletters)} />
          <Route
            path="/auth/payment"
            element={loadLayout(AdminLayout, PaymentGateway)} />
        </>
      )}
    </Routes>
  )
}
