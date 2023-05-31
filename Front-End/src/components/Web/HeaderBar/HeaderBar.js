import React from 'react';
import { Button, Image } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { image } from '../../../assets';
import { useAuth } from '../../../hooks';
import { ENV } from '../../../utils';
import { WebIcon } from '../../../assets'
import './HeaderBar.scss';

export function HeaderBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getAvatar = () => {
    if (user.avatar) {
      return `${ENV.BASE_PATH}/${user.avatar}`;
    }
    return image.Default_Avatar;
  }

  return (
    <div className="header-bar">
      <div className="header-bar__left">
        <Link to="/" className="logo" name="icono">
          <WebIcon.LogoBlack />
        </Link>
        <Link to="/artists" className="text" name="artists">
          Artistas/Grupos
        </Link>
        <Link to="/discs" className="text" name="discs">
          Discos
        </Link>
        <Link to="/concerts" className="text" name="concerts">
          Conciertos
        </Link>
        <Link to="/merchandising" className="text" name="merchandising">
          Merchandising
        </Link>
        <Link to="/web-data" className="text" name="data">
          Datos
        </Link>
      </div>
      <div className="header-bar__right">
      <Button basic color='black' onClick={() => navigate('/auth')}>
          {user ? (
            <Image src={getAvatar()} avatar />
          ) : (
            <span>Registro / </span>
          )}
          {user ? (
            <span>Tu perfil</span>
          ) : (
            <span>Iniciar sesión</span>
          )}
        </Button>
      </div>
    </div>
  )
}
