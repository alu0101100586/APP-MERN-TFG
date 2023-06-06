import React from 'react'
import { Image } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import { ENV } from '../../../../utils'
import './ArtistItem.scss'

export function ArtistItem(props) {
  const { item, type } = props
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
    if (type === 'disc') {
      navigate(`/disc/${item._id}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (type === 'concert') {
      navigate(`/concert/${item._id}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (type === 'merchandise') {
      navigate(`/merchandise/${item._id}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="artist-item" onClick={handleOnClick}>
      <div className="artist-item__image">
        <Image src={`${imagepath}`} size="small" />
      </div>

      <div className="artist-item__info">
        <h1>{item.name}</h1>
        <h3>{property.join(', ')}</h3>
      </div>
    </div>
  )
}
