import React from 'react'
import { Route, Routes } from 'react-router-dom'
import {
  Home,
  Artist,
  ArtistsList,
  Concert,
  ConcertsList,
  Disc,
  DiscList,
  Merchandising,
  MerchandisingList,
  WebData,
} from '../pages/Web'
import { ClientLayout } from '../layouts'

export function WebRouter() {
  const loadLayout = (Layout, Page) => {
    return (
      <Layout>
        <Page />
      </Layout>
    )
  }

  return (
    <Routes>
      <Route path="/" element={loadLayout(ClientLayout, Home)} />
      <Route path="/artist/:id" element={loadLayout(ClientLayout, Artist)} />
      <Route path="/artists" element={loadLayout(ClientLayout, ArtistsList)} />
      <Route path="/concert/:id" element={loadLayout(ClientLayout, Concert)} />
      <Route
        path="/concerts"
        element={loadLayout(ClientLayout, ConcertsList)}
      />
      <Route path="/disc/:id" element={loadLayout(ClientLayout, Disc)} />
      <Route path="/discs" element={loadLayout(ClientLayout, DiscList)} />
      <Route
        path="/merchandise/:id"
        element={loadLayout(ClientLayout, Merchandising)}
      />
      <Route
        path="/merchandising"
        element={loadLayout(ClientLayout, MerchandisingList)}
      />
      <Route path="/web-data" element={loadLayout(ClientLayout, WebData)} />
    </Routes>
  )
}
