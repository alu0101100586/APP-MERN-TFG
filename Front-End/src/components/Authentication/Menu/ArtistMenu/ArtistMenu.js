import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './ArtistMenu.scss';

//TODO - Add the links to the menu items
export function ArtistMenu() {
  return (
    <Menu vertical tabular className='artist-menu'>
      <Menu.Item>
        <Menu.Header>
        <Icon name="home" />
          Inicio
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item as={Link} to="/">
            <Icon name="arrow left" />
            Volver atras
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
      <Menu.Item>
        <Menu.Header>
          <Icon name="user" />
          Perfil
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item>
            <Icon name="edit " />
            Modificar perfil
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>
          <Icon name="user outline" />
          Artistas
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item>
            <Icon name="add" />
            Crear artista
          </Menu.Item>
          <Menu.Item>
            <Icon name="edit" />
            Editar artista
          </Menu.Item>
          <Menu.Item>
            <Icon name="delete" />
            Eliminar artista
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>
          <Icon name="music" />
          Discos
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item>
            <Icon name="add" />
            Crear disco
          </Menu.Item>
          <Menu.Item>
            <Icon name="edit" />
            Editar disco
          </Menu.Item>
          <Menu.Item>
            <Icon name="delete" />
            Eliminar disco
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>
          <Icon name="calendar alternate outline" />
          Conciertos
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item>
            <Icon name="add" />
            Crear concierto
          </Menu.Item>
          <Menu.Item>
            <Icon name="edit" />
            Editar concierto
          </Menu.Item>
          <Menu.Item>
            <Icon name="delete" />
            Eliminar concierto
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>
          <Icon name="ticket" />
          Merchandise
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item>
            <Icon name="add" />
            Crear merchandise
          </Menu.Item>
          <Menu.Item>
            <Icon name="edit" />
            Editar merchandise
          </Menu.Item>
          <Menu.Item>
            <Icon name="delete" />
            Eliminar merchandise
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>
          <Icon name="at" />
          Cuenta
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item>
            <Icon name="user delete" />
            Eliminar cuenta
          </Menu.Item>
          <Menu.Item>
            <Icon name="mail" />
            Newsletter
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    </Menu>
  )
}
