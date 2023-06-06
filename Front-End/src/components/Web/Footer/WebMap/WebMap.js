import React from 'react'
import { Grid, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './WebMap.scss'

export function WebMap() {
  return (
    <div className="footer-web-map">
      <h4>Mapa Web</h4>
      <Link to="/">Inicio</Link>

      <Link to="/artists">Artistas/Grupos</Link>

      <Link to="/discs">Discos</Link>

      <Link to="/concerts">Conciertos</Link>

      <Link to="/merchandising">Merchandising</Link>

      <Link to="/web-data">Datos</Link>
    </div>
  )
}
