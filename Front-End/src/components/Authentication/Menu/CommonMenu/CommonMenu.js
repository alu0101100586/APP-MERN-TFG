import React from 'react';
import { Menu, Icon, MenuItem } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './CommonMenu.scss';

//TODO - Add the links to the menu items
export function CommonMenu() {
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

      <MenuItem>
        <Menu.Header>
          <Icon name="exchange" />
          Devoluciones
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item>
            <Icon name="music " />
            Devolver Disco
          </Menu.Item>
          <Menu.Item>
            <Icon name="calendar alternate outline" />
            Devolver Concierto
          </Menu.Item>
          <Menu.Item>
            <Icon name="ticket" />
            Devolver Merchandise
          </Menu.Item>
        </Menu.Menu>
      </MenuItem>

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
