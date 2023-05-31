import React, { useState, useEffect } from 'react'
import { Image, Grid, Input } from 'semantic-ui-react'
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

  if (role === 'artist') {
    DiscHeader = 'Discos que has subido'
    ConcertHeader = 'Conciertos que has subido'
    MerchHeader = 'Merchandise que has subido'
  } else {
    DiscHeader = 'Discos en los que has participado'
    ConcertHeader = 'Conciertos en los que has participado'
    MerchHeader = 'Merchandise en los que has participado'
  }

  const [profile, setProfile] = useState(user)
  const [date, setDate] = useState(formatDate(profile.birthDate))

  useEffect(() => {
    ;(async () => {
      try {
        await userService.updateMusicalGenresApi(accessToken)
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
        <Grid columns={2} divided padded>
          <Grid.Column>
            <div className="avatar-container">
              <Image
                src={
                  profile.avatar
                    ? `${ENV.BASE_PATH}/${profile.avatar}`
                    : image.Default_Avatar
                }
                avatar
              />
            </div>
          </Grid.Column>
          <Grid.Column>
            <div classname='info-container'>
              <Input
                label='Nombre de Usuario'
                type='text'
                value={profile.nickName}
                readonly='true'
                tabIndex={-1}
              />
              <Input
                label='Nombre'
                type='text'
                value={profile.firstName}
                readonly='true'
                tabIndex={-1}
              />
              <Input
                label='Apellidos'
                type='text'
                value={profile.lastName}
                readonly='true'
                tabIndex={-1}
              />
              <Input
                label='Correo Electrónico'
                type='text'
                value={profile.email}
                readonly='true'
                tabIndex={-1}
              />
              <Input
                label='Fecha de Inicio'
                type='text'
                value={date}
                readonly='true'
                tabIndex={-1}
              />
              <Input
                label='Géneros Musicales'
                type='text'
                value={
                  profile.musicalGenre.length > 0
                    ? profile.musicalGenre.join(', ')
                    : 'No te has decantado por ningún género'
                }
                readonly='true'
                tabIndex={-1}
              />
            </div>
          </Grid.Column>
        </Grid>
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
