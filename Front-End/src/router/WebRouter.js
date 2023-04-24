import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { 
  Home, 
  Artist, 
  ArtistsList, 
  Concert, 
  ConcertsList, 
  Contact, 
  Disc, 
  DiscList, 
  Merchandising, 
  MerchandisingList, 
  WebData, 
  WebMap 
} from '../pages/Web';
import { ClientLayout } from '../layouts';

export function WebRouter() {

  const loadLayout = (Layout, Page) => {
    return(
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
      <Route path="/concerts" element={loadLayout(ClientLayout, ConcertsList)} />
      <Route path="/contact" element={loadLayout(ClientLayout, Contact)} />
      <Route path="/disc/:id" element={loadLayout(ClientLayout, Disc)} />
      <Route path="/discs" element={loadLayout(ClientLayout, DiscList)} />
      <Route path="/merchandise/:id" element={loadLayout(ClientLayout, Merchandising)} />
      <Route path="/merchandising" element={loadLayout(ClientLayout, MerchandisingList)} />
      <Route path="/web-data" element={loadLayout(ClientLayout, WebData)} />
      <Route path="/web-map" element={loadLayout(ClientLayout, WebMap)} /> 
    </Routes>
  )
}
