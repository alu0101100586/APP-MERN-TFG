import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './AuthMenu.scss';

export function AuthMenu() {
  return (
    <Menu fluid vertical icon text className='auth-menu'>
      <Menu.Item as={Link} to='/auth/users'>
        <Icon name='user'/>
        Usuarios
      </Menu.Item>
      <Menu.Item as={Link} to='/auth/menu'>
        <Icon name='bars'/>
        Menu
      </Menu.Item>
      <Menu.Item as={Link} to='/auth/menu'>
        <Icon name='bars'/>
        Menu
      </Menu.Item>
    </Menu>
  );
}
