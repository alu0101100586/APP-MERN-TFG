import React, { useState } from 'react'
import { Button, Image, Grid, Menu, Icon } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { image } from '../../../assets'
import { useAuth } from '../../../hooks'
import { ENV } from '../../../utils'
import { WebIcon } from '../../../assets'
import './HeaderBar.scss'

//TODO - arreglar el menu de tal manera que cuando estemos en pantallas pequeñas sea un menu desplegable burger
export function HeaderBar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [state, setState] = useState({ activeItem: '' })

  const handleOnClick = (e, { name }) => {
    setState({ activeItem: name })
    if (name === 'home') {
      return navigate('/')
    }
    navigate(`/${name}`)
  }

  const getAvatar = () => {
    if (user.avatar) {
      return `${ENV.BASE_PATH}/${user.avatar}`
    }
    return image.Default_Avatar
  }

  return (
    <div className="header-bar">
      <Grid columns='equal' padded stackable className='header-bar__content'>
        <Grid.Column>
          <WebIcon.LogoBlack />
        </Grid.Column>

        <Grid.Column>
          <Menu secondary pointing stackable widths={6}>
            <Menu.Item
              name='home'
              active={state.activeItem === 'home'}
              onClick={handleOnClick}
            >
              Inicio
            </Menu.Item>
            <Menu.Item
              name='artists'
              active={state.activeItem === 'artists'}
              onClick={handleOnClick}
            >
              Artistas
            </Menu.Item>

            <Menu.Item
              name='discs'
              active={state.activeItem === 'discs'}
              onClick={handleOnClick}
            >
              Discos
            </Menu.Item>

            <Menu.Item
              name='concerts'
              active={state.activeItem === 'concerts'}
              onClick={handleOnClick}
            >
              Conciertos
            </Menu.Item>

            <Menu.Item
              name='merchandising'
              active={state.activeItem === 'merchandising'}
              onClick={handleOnClick}
            >
              Merchandising
            </Menu.Item>

            <Menu.Item
              name='web-data'
              active={state.activeItem === 'web-data'}
              onClick={handleOnClick}
            >
              Datos
            </Menu.Item>
          </Menu>
        </Grid.Column>

        <Grid.Column>
          <Button basic color="black" onClick={() => navigate('/auth')}>
            {user ? <Image src={getAvatar()} avatar /> : <span>Registro / </span>}
            {user ? <span>Tu perfil</span> : <span>Iniciar sesión</span>}
          </Button>
        </Grid.Column>
      </Grid>
    </div>
  )
}
