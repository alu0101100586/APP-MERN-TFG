import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { BasicModal } from '../../../Shared/BasicModal';
import { 
  UpdateUserForm, 
  PasswordForm, 
  DeleteUserTransaction 
} from '../../Auth';
import { UserService } from '../../../../service';
import { useAuth } from '../../../../hooks';
import './CommonMenu.scss';

export function CommonMenu(props) {
  const { onReload, user, reload } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);
  const { accessToken } = useAuth();
  const userService = new UserService();

  const openModal = (modal) => {
    setSelectedModal(modal);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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

  return (
    <Menu vertical tabular className='common-menu'>
      <Menu.Item>
        <Menu.Header>
        <Icon name="home" />
          Inicio
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item as={Link} to="/">
            <Icon name="arrow left" />
            Volver al inicio
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>
          <Icon name="user" />
          Perfil
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item onClick={() => openModal('editProfile')}>
            <Icon name="edit " />
            Modificar perfil
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>
          <Icon name="exchange" />
          Devoluciones
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item onClick={() => openModal('exchangeDisc')}>
            <Icon name="music" />
            Discos
          </Menu.Item>
          <Menu.Item onClick={() => openModal('exchangeConcert')}>
            <Icon name="ticket" />
            Conciertos
          </Menu.Item>
          <Menu.Item onClick={() => openModal('exchangeMerch')}>
            <Icon name="cart" />
            Merchandise
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>

      <Menu.Item>
        <Menu.Header>
          <Icon name="at" />
          Cuenta
        </Menu.Header>
        <Menu.Menu>
          <Menu.Item onClick={() => openModal('changePasswd')}>
            <Icon name="edit" />
            Cambiar Contraseña
          </Menu.Item>
          <Menu.Item as={Link} to="/auth/newsletters">
            <Icon name="mail" />
            Newsletter
          </Menu.Item>
          <Menu.Item onClick={() => openModal('deleteAccount')}>
            <Icon name="user delete" />
            Eliminar cuenta
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>

      {selectedModal === 'editProfile' && (
        <BasicModal show={showModal} close={closeModal} title="Editar perfil">
          <UpdateUserForm 
            close={closeModal} 
            onReload={onReload} 
            user={profile} 
          />
        </BasicModal>
      )}
      {selectedModal === 'exchangeDisc' && (
        <BasicModal show={showModal} close={closeModal} title="Devolver Disco">
          <h1>Formulario devolución de discos</h1>
        </BasicModal>
      )}
      {selectedModal === 'exchangeConcert' && (
        <BasicModal show={showModal} close={closeModal} title="Devolver Concierto">
          <h1>Formulario devolución de concierto</h1>
        </BasicModal>
      )}
      {selectedModal === 'exchangeMerch' && (
        <BasicModal show={showModal} close={closeModal} title="Devolver Merchandise">
          <h1>Formulario devolución de merchandise</h1>
        </BasicModal>
      )}
      {selectedModal === 'changePasswd' && (
        <BasicModal show={showModal} close={closeModal} title="Cambiar contraseña">
          <PasswordForm close={closeModal} />
        </BasicModal>
      )}
      {selectedModal === 'newsletter' && (
        <BasicModal show={showModal} close={closeModal} title="Newsletter">
          <h1>Formulario de newsletter</h1>
        </BasicModal>
      )}
      {selectedModal === 'deleteAccount' && (
        <BasicModal show={showModal} close={closeModal} title="Eliminar cuenta">
          <DeleteUserTransaction close={closeModal} />
        </BasicModal>
      )}
    </Menu>
  );
}
