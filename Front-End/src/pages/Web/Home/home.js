import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Button, Image, Grid } from 'semantic-ui-react';
import { Carousel } from '../../../components/Web';
import { image } from '../../../assets';
import { useAuth } from '../../../hooks';
import './home.scss';


export function Home() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className='home-page'>
      <Carousel />

      <div className='home-page__who-we-are'>
        <h1>¿Quiénes somos?</h1>
        <p>
          Somos una plataforma que busca apoyar a los artistas emergentes a
          través de campañas de crowdfunding, para que puedan financiar sus
          proyectos con el fin de que se puedan hacer un hueco en el mundo de la
          música. Además, también queremos que los usuarios puedan descubrir
          nuevos artistas, géneros y canciones. ¡Únete a nosotros!
        </p>
      </div>

      <div className='home-page__recommendation'>
        <h1>
          <Icon name='angle double down' /> 
          Proyectos en CrowdSound 
          <Icon name='angle double down' />
        </h1>
        <Grid padded columns={3}>
          <Grid.Column>
            <div className='item'>
              <Image src={image.Disc} size='large' onClick={() => navigate('/discs')} />
              <p>Discos</p>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className='item'>
              <Image src={image.Concert} size='large' onClick={() => navigate('/concerts')} />
              <p>Conciertos</p>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className='item'>
              <Image src={image.Merchandising}  size='large' onClick={() => navigate('/merchandising')} />
              <p>Merchandising</p>
            </div>
          </Grid.Column>
        </Grid>
      </div>

      <div className='home-page__artist'>
        <h1>¿Eres artista?</h1>
        <p>
          Si eres artista y quieres dar a conocer tu trabajo, con CrowdSound
          podrás crear una campaña de crowdfunding para financiar tus proyectos
          de una forma sencilla y rápida. Tenemos una facilidad para dar a conocer
          tu trabajo y que los usuarios puedan apoyarte. ¡Registrate en CrowdSound!
        </p>
        <Button
          size='large'
          primary
          onClick={handleButtonClick}
        >
          { accessToken ? 'Accede a tu usuario' : 'Registrate' }
        </Button>
      </div>

      <div className='home-page__contact'>
        <h1>¿Tienes alguna duda?</h1>
        <p>
          Si tienes alguna duda o sugerencia, no dudes en ponerte en contacto
          con nosotros a través de nuestras redes sociales. ¡Te responderemos
          lo antes posible!
        </p>
        <Grid padded columns={4}>
          <Grid.Column>
            <Button
              size='large'
              color='facebook'
              icon='facebook'
              onClick={() =>
                window.open('https://www.facebook.com/', '_blank')
              }
            />
          </Grid.Column>
          <Grid.Column>
            <Button
              size='large'
              color='twitter'
              icon='twitter'
              onClick={() =>
                window.open('https://twitter.com/', '_blank')
              }
            />
          </Grid.Column>

          <Grid.Column>
            <Button
              size='large'
              color='instagram'
              icon='instagram'
              onClick={() =>
                window.open('https://www.instagram.com/', '_blank')
              }
            />
          </Grid.Column>

          <Grid.Column>
            <Button
              size='large'
              color='youtube'
              icon='youtube'
              onClick={() =>
                window.open('https://www.youtube.com/', '_blank')
              } 
            />
          </Grid.Column>
        </Grid>
      </div>
    </div>
  )
}
