import React from 'react'
import { SearchBar } from '../../../components/Web'
import './discsList.scss'

export function DiscList() {
  return (
    <div className="disc-list">
      <SearchBar type="disc" />
    </div>
  )
}
