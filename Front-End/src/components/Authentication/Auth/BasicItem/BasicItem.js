import React from 'react'
import { Image, Button } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom';
import { ENV } from '../../../../utils'
import './BasicItem.scss'

//TODO - hacer que el elemento sea clickeable para ir a la pagina del item

export function BasicItem(props) {
  const { item, type} = props
  const navigate = useNavigate()

  if (!item) {
    return <h2>No hay nada que mostrar</h2>
  }

  let imagepath
  if (item.cover) {
    imagepath = `${ENV.BASE_PATH}/${item.cover}`
  } else if (item.image) {
    imagepath = `${ENV.BASE_PATH}/${item.image}`
  } else if (item.concertPoster) {
    imagepath = `${ENV.BASE_PATH}/${item.concertPoster}`
  }

  let property
  if (item.musicalGenre) {
    property = item.musicalGenre
  } else if (item.size) {
    property = item.size
  }

  const handleOnClick = () => {
    if (type === 'artist') {
      navigate(`/artist/${item._id}`)
    } else if (type === 'disc') {
      navigate(`/disc/${item._id}`)
    } else if (type === 'concert') {
      navigate(`/concert/${item._id}`)
    } else if (type === 'merchandise') {
      navigate(`/merchandise/${item._id}`)
    }
  }

  return (
    <div className="basic-item" onClick={handleOnClick}>
      <Image src={`${imagepath}`} size="small" />
      <div className="basic-item__info">
        <h2>{item.name}</h2>
        <span>{property.join(', ')}</span>
      </div>
    </div>
  )
}
