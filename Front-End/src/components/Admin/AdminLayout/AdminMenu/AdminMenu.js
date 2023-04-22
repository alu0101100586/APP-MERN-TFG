import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './AdminMenu.scss';

export function AdminMenu() {
  return (
    <Menu fluid vertical icon text className='admin-menu'>
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
