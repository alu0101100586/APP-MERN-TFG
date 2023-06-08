import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { image } from '../../../assets';
import './NotFound.scss';

export function NotFound() {
  return (
    <div className='not-found-page'>
      <div className='not-found-page__content'>
        <h1>404 - Contenido no encontrado</h1>
        <p>Lo sentimos, la página que estás buscando no existe.</p>

        <Button animated='fade' color='black' href='/'>
          <Button.Content visible>Regresar al inicio</Button.Content>
          <Button.Content hidden>
            <Icon name='arrow left' />
          </Button.Content>
        </Button>
      </div>
    </div>
  );
}
