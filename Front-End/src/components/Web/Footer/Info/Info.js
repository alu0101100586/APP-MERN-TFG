import React from 'react';
import { Button } from 'semantic-ui-react';
import { map } from 'lodash';
import { WebIcon } from '../../../../assets';
import './Info.scss';

export function Info() {
  return (
    <div className='footer-info'>
      <WebIcon.LogoWhite className='logo' />
      <p>
        Entra en el mundo de la musica a través de la plataforma de crowdfunding
        llamada CrowdSound. Descubre nuevos artistas y apoya a los que ya conoces.
        Participa en proyectos para que tus artistas favoritos puedan sacar su
        nuevo disco o puedan ir de gira por tu ciudad.
      </p>
    </div>
  )
}
