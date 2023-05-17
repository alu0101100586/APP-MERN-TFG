import React, { useState, useEffect } from 'react'
import { Image } from 'semantic-ui-react'
import { ENV } from '../../../../utils'
import { image } from '../../../../assets'
import { UserService } from '../../../../service'
import { useAuth } from '../../../../hooks'
import { ItemList } from '../ItemList'
import { formatDate } from '../../../../utils'
import './UserContent.scss'

// TODO- corregir reload de las listas

export function UserContect(props) {
  const { user, reload } = props
  const role = user.role
  const { accessToken } = useAuth()
  const userService = new UserService()

  let DiscHeader
  let ConcertHeader
  let MerchHeader
  let GenresHeader

  if (role === 'artist') {
    DiscHeader = 'Discos que has subido'
    ConcertHeader = 'Conciertos que has subido'
    MerchHeader = 'Merchandise que has subido'
    GenresHeader = 'Géneros musicales que tocas'
  } else {
    DiscHeader = 'Discos en los que has participado'
    ConcertHeader = 'Conciertos en los que has participado'
    MerchHeader = 'Merchandise en los que has participado'
    GenresHeader = 'Géneros musicales que te gustan'
  }

  const [profile, setProfile] = useState(user)
  const [date, setDate] = useState(formatDate(profile.birthDate))

  useEffect(() => {
    ;(async () => {
      try {
        const user_response = await userService.getMeApi(accessToken)
        setProfile(user_response)
        setDate(formatDate(user_response.birthDate))
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  return (
    <div className="user-content">
      <div className="user-content__info">
        <Image
          src={
            profile.avatar
              ? `${ENV.BASE_PATH}/${profile.avatar}`
              : image.Default_Avatar
          }
          avatar
        />
        <div className="user-content__info__data">
          <div className="user-content__info__data__email">
            <h3>Correo Electrónico</h3>
            <span>{profile.email}</span>
          </div>
          <div className="user-content__info__data__nickname">
            <h3>Nombre de Usuario</h3>
            <span>{profile.nickName}</span>
          </div>
          <div className="user-content__info__data__name">
            <h3>Nombre</h3>
            <span>
              {profile.firstName} {profile.lastName}
            </span>
          </div>
          <div className="user-content__info__data__date">
            <h3>Fecha Inicio</h3>
            <span>{date}</span>
          </div>
        </div>
      </div>
      <div className="user-content__genres">
        <h1>{GenresHeader}</h1>
        <span>
          {profile.musicalGenre.length > 0
            ? profile.musicalGenre.join(', ')
            : 'No te has decantado por ningún género'}
        </span>
      </div>
      {profile.discs.length > 0 ? (
        <div className="user-content__list">
          <h1>{DiscHeader}</h1>
          <ItemList reload={reload} type="disc" />
        </div>
      ) : null}
      {profile.concerts.length > 0 ? (
        <div className="user-content__list">
          <h1>{ConcertHeader}</h1>
          <ItemList reload={reload} type="concert" />
        </div>
      ) : null}
      {profile.merchandise.length > 0 ? (
        <div className="user-content__list">
          <h1>{MerchHeader}</h1>
          <ItemList reload={reload} type="merchandise" />
        </div>
      ) : null}
    </div>
  )
}
