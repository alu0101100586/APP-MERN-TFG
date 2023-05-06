import React from 'react'
import { Image, Button } from 'semantic-ui-react'
import { ENV } from '../../../../utils'
import './BasicItem.scss'

export function BasicItem(props) {
  const { item } = props

  if (!item) {
    return <h2>No hay discos que mostrar</h2>
  }

  let imagepath
  if (item.cover) {
    imagepath = `${ENV.BASE_PATH}/${item.cover}`
  } else if (item.image) {
    imagepath = `${ENV.BASE_PATH}/${item.image}`
  } else if (item.poster) {
    imagepath = `${ENV.BASE_PATH}/${item.poster}`
  }

  let property
  if (item.musicalGenre) {
    property = item.musicalGenre
  } else if (item.size) {
    property = item.size
  }

  return (
    <div className="basic-item">
      <Image src={`${imagepath}`} size="small" />
      <div className="basic-item__info">
        <h2>{item.name}</h2>
        <span>{property.join(', ')}</span>
      </div>
    </div>
  )
}
