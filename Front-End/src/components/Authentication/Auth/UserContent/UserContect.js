import React, { useState, useEffect } from 'react';
import { Image, Button, Icon, Confirm } from 'semantic-ui-react';
import { ENV } from '../../../../utils'; 
import { image } from '../../../../assets';
import './UserContent.scss';
import { UserService } from '../../../../service';
import { useAuth } from '../../../../hooks';

export function UserContect(props) {
  const { user, reload } = props;
  const role = user.role;
  const { accessToken } = useAuth();
  const userService = new UserService()

  let DiscHeader;
  let ConcertHeader;
  let MerchHeader;

  if (role === 'artist') {
    DiscHeader = 'Discos que has subido';
    ConcertHeader = 'Conciertos que has subido';
    MerchHeader = 'Merchandise que has subido';
  } else {
    DiscHeader = 'Discos en los que has participado';
    ConcertHeader = 'Conciertos en los que has participado';
    MerchHeader = 'Merchandise en los que has participado';
  }

  const [profile, setProfile] = useState(user);

  useEffect(() => {
    (async () => {
      try {
        const response = await userService.getMeApi(accessToken);
        setProfile(response);
      } catch (error) {
        console.error(error);
      }
    })()
  }, [reload]);

  //TODO - hacer todos los componentes de los discos, conciertos y merchandise para poder paginarlos y mostrarlos en el perfil del usuario
  return (
    <div className='user-content'>
      <div className='user-content__info'>
        <Image 
          src={profile.avatar ? `${ENV.BASE_PATH}/${profile.avatar}` : image.Default_Avatar} 
          avatar
        />
        <div className='user-content__info__data'>
          <div className='user-content__info__data__email'>
            <h3>Correo Electrónico</h3>
            <span>{profile.email}</span>
          </div>
          <div className='user-content__info__data__nickname'>
            <h3>Nombre de Usuario</h3>
            <span>{profile.nickName}</span>
          </div>
          <div className='user-content__info__data__name'>
            <h3>Nombre</h3>
            <span>{profile.firstName} {profile.lastName}</span>
          </div>
          <div className='user-content__info__data__date'>
            <h3>Fecha Inicio</h3>
            <span>Fecha de Inicio: {profile.birthDate}</span>
          </div>
        </div>
      </div>
      <div className='user-content__discs'>
        <h1>{DiscHeader}</h1>
        <span> Discos </span>
      </div>
      <div className='user-content__concerts'>
        <h1>{ConcertHeader}</h1>
        <span> Conciertos </span>
      </div>
      <div className='user-content__merhandise'>
        <h1>{MerchHeader}</h1>
        <span> Merchandise </span>
      </div>
    </div>
  )
}
