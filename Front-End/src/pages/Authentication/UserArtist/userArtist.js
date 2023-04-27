import React from 'react';
import { ArtistMenu } from '../../../components/Authentication/Menu';
import './userArtist.scss';

export function UserArtist() {
  return (
    <div className='user-artist'>
      <div className='user-artist__menu'>
        <ArtistMenu />
      </div>
      <div className='user-artist__content'>
        <h1>Contenido</h1>
        <div className='user-artist__content-info'>
          <div className='user-artist__content-info-avatar'>
              <h1>Avatar</h1>
            </div>
          <div className='user-artist__content-info-data'>
            <div className='user-artist__content-info-data-nickname'>
                <h1>NickName</h1>
              </div>
              <div className='user-artist__content-info-data-name'>
                <h1>Name</h1>
              </div>
              <div className='user-artist__content-info-data-date'>
                <h1>Fecha Inicio</h1>
              </div>
          </div>
        </div>
        <div className='user-artist__content-discs'>
          <h1>Discos que has creado</h1>
        </div>
        <div className='user-artist__content-concerts'>
          <h1>Conciertos que has creado</h1>
        </div>
        <div className='user-artist__content-merchandise'>
          <h1>Merchandise que has creado</h1>
        </div>
      </div>
    </div>
  )
}
