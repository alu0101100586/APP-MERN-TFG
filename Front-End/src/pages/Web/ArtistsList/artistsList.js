import React from 'react'
import { SearchBar } from '../../../components/Web'
import './artistsList.scss'

export function ArtistsList() {
  return (
    <div className="artist-list">
      <SearchBar type="artist" />
    </div>
  )
}
