import React, { useState, useEffect } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { BasicModal } from '../../../Shared/BasicModal'
import { 
  UpdateUserForm, 
  PasswordForm, 
  DeleteUserTransaction,
  CreateArtistForm,
  DeleteArtist,
  UpdateArtistForm,
  CreateDiscForm,
  CreateConcertForm,
  CreateMerchandiseForm,
  UpdateDiscForm,
  DeleteItem,
} from '../../Auth'
import { ArtistService, UserService } from '../../../../service'
import { useAuth } from '../../../../hooks'
import './ArtistMenu.scss'

export function ArtistMenu(props) {
  const { onReload, user, reload } = props
  const [showModal, setShowModal] = useState(false)
  const [selectedModal, setSelectedModal] = useState(null)
  const { accessToken } = useAuth()

  const userService = new UserService();
  const artistService = new ArtistService();

  const openModal = (modal) => {
    setSelectedModal(modal)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const [profile, setProfile] = useState(user)
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    ;(async () => {
      try {
        const userResponse = await userService.getMeApi(accessToken)
        setProfile(userResponse)
        const artistResponse = await artistService.getArtistUserApi(accessToken);
        setArtist(artistResponse);
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  return (
    <Menu vertical tabular className="artist-menu">
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
            <Icon name="edit" />
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
          <Menu.Item onClick={() => openModal('createArtist')}>
            <Icon name="add" />
            Crear artista
          </Menu.Item>
          <Menu.Item onClick={() => openModal('editArtist')}>
            <Icon name="edit" />
            Editar artista
          </Menu.Item>
          <Menu.Item onClick={() => openModal('deleteArtist')}>
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
          <Menu.Item onClick={() => openModal('createDisc')}>
            <Icon name="add" />
            Crear disco
          </Menu.Item>
          <Menu.Item onClick={() => openModal('editDisc')}>
            <Icon name="edit" />
            Editar disco
          </Menu.Item>
          <Menu.Item onClick={() => openModal('deleteDisc')}>
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
          <Menu.Item onClick={() => openModal('createConcert')}>
            <Icon name="add" />
            Crear concierto
          </Menu.Item>
          <Menu.Item onClick={() => openModal('editConcert')}>
            <Icon name="edit" />
            Editar concierto
          </Menu.Item>
          <Menu.Item onClick={() => openModal('deleteConcert')}>
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
          <Menu.Item onClick={() => openModal('createMerch')}>
            <Icon name="add" />
            Crear merchandise
          </Menu.Item>
          <Menu.Item onClick={() => openModal('editMerch')}>
            <Icon name="edit" />
            Editar merchandise
          </Menu.Item>
          <Menu.Item onClick={() => openModal('deleteMerch')}>
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
      {selectedModal === 'createArtist' && (
        <BasicModal show={showModal} close={closeModal} title="Crear artista">
          {artist ? (
            <h3>Ya tienes un usuario asociado a tu cuenta</h3>
          ) : (
            <CreateArtistForm 
              close={closeModal}
              onReload={onReload}
            />
          )}
        </BasicModal>
      )}
      {selectedModal === 'editArtist' && (
        <BasicModal show={showModal} close={closeModal} title="Editar artista">
          {artist ? (
            <UpdateArtistForm 
              close={closeModal} 
              onReload={onReload}
              artist={artist}
            />
          ) : (
            <h3>No tienes ningún artista asociado a tu cuenta</h3>
          )}
        </BasicModal>
      )}
      {selectedModal === 'deleteArtist' && (
        <BasicModal
          show={showModal}
          close={closeModal}
          title="Eliminar artista"
        >
          {artist ? (
            <DeleteArtist 
              close={closeModal}
              onReload={onReload}
            />
          ) : (
            <h3>No tienes ningún artista asociado a tu cuenta</h3>
          )}
        </BasicModal>
      )}
      {selectedModal === 'createDisc' && (
        <BasicModal show={showModal} close={closeModal} title="Crear disco">
          <CreateDiscForm close={closeModal} onReload={onReload} />
        </BasicModal>
      )}
      {selectedModal === 'editDisc' && (
        <BasicModal show={showModal} close={closeModal} title="Editar disco">
          <UpdateDiscForm close={closeModal} onReload={onReload} />
        </BasicModal>
      )}
      {selectedModal === 'deleteDisc' && (
        <BasicModal show={showModal} close={closeModal} title="Eliminar disco">
          <DeleteItem close={closeModal} onReload={onReload} type='disc' />
        </BasicModal>
      )}
      {selectedModal === 'createConcert' && (
        <BasicModal show={showModal} close={closeModal} title="Crear concierto">
          <CreateConcertForm close={closeModal} onReload={onReload} />
        </BasicModal>
      )}
      {selectedModal === 'editConcert' && (
        <BasicModal
          show={showModal}
          close={closeModal}
          title="Editar concierto"
        >
          <h1>Formulario de edición de concierto</h1>
        </BasicModal>
      )}
      {selectedModal === 'deleteConcert' && (
        <BasicModal
          show={showModal}
          close={closeModal}
          title="Eliminar concierto"
        >
          <DeleteItem close={closeModal} onReload={onReload} type='concert' />
        </BasicModal>
      )}
      {selectedModal === 'createMerch' && (
        <BasicModal
          show={showModal}
          close={closeModal}
          title="Crear merchandise"
        >
          <CreateMerchandiseForm close={closeModal} onReload={onReload}/>
        </BasicModal>
      )}
      {selectedModal === 'editMerch' && (
        <BasicModal
          show={showModal}
          close={closeModal}
          title="Editar merchandise"
        >
          <h1>Formulario de edición de merchandise</h1>
        </BasicModal>
      )}
      {selectedModal === 'deleteMerch' && (
        <BasicModal
          show={showModal}
          close={closeModal}
          title="Eliminar merchandise"
        >
          <DeleteItem close={closeModal} onReload={onReload} type='merch' />
        </BasicModal>
      )}
      {selectedModal === 'changePasswd' && (
        <BasicModal
          show={showModal}
          close={closeModal}
          title="Cambiar contraseña"
        >
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
  )
}
