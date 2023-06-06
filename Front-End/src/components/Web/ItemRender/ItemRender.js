import React, { useState, useEffect } from 'react'
import { Image } from 'semantic-ui-react'
import { ENV } from '../../../utils'
import { useNavigate } from 'react-router-dom'
import { image } from '../../../assets'
import './ItemRender.scss'

export function ItemRender(props) {
  const { item, type } = props
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  let imagepath = image.Default_Avatar
  if (item.cover) {
    imagepath = `${ENV.BASE_PATH}/${item.cover}`
  } else if (item.image) {
    imagepath = `${ENV.BASE_PATH}/${item.image}`
  } else if (item.concertPoster) {
    imagepath = `${ENV.BASE_PATH}/${item.concertPoster}`
  } else if (item.avatar) {
    imagepath = `${ENV.BASE_PATH}/${item.avatar}`
  }

  let property = []
  if (item.musicalGenre) {
    property = item.musicalGenre
  } else if (item.size) {
    property = item.size
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
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
    <div
      className={`item-render ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleOnClick}
    >
      <Image src={`${imagepath}`} size="large" />

      <div className="overlay">
        <div className="name" style={{ textTransform: 'capitalize' }}>
          {item.name}
        </div>
        <div className="property">{property.join(' ')}</div>
      </div>
    </div>
  )
}
