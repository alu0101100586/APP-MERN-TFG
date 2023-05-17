import React from 'react';
import { Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { WebIcon } from '../../../assets'
import './HeaderBar.scss';

export function HeaderBar() {
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
        <Link to="/auth" className="text">
          Acceso
        </Link>
      </div>
    </div>
  )
}
