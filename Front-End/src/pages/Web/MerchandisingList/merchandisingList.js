import React from 'react'
import { SearchBar } from '../../../components/Web'
import './merchandisingList.scss'

//TODO - hacer el scss
export function MerchandisingList() {
  return (
    <div className='merchandise-list'>
      <SearchBar type='merchandise' />
    </div>
  )
}
