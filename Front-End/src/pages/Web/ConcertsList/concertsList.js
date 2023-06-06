import React from 'react'
import { SearchBar } from '../../../components/Web'
import './concertsList.scss'

export function ConcertsList() {
  return (
    <div className="concert-list">
      <SearchBar type="concert" />
    </div>
  )
}
