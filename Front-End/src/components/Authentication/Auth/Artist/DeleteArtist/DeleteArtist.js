import React from 'react';
import { Button } from 'semantic-ui-react';
import { useAuth } from '../../../../../hooks';
import { ArtistService } from '../../../../../service';
import './DeleteArtist.scss';

//TODO - revisar por que create y updated si hacen el onreload y este no

const artistService = new ArtistService();

export function DeleteArtist(props) {
  const { close, onReload } = props
  const { accessToken } = useAuth()

  const handleDelete = async (accessToken) => {
    try {
      await artistService.deleteArtistApi(accessToken);
      window.location.reload();
      onReload();
      close();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="delete-artist-transaction">
      <h1>¿Seguro de que quieres seguir adelante?</h1>
      <div className="delete-artist-transaction__content">
        <p>
          Una vez se elimine el artista, no tendrás acceso a la página de este, 
          ya que se eliminarán todos los datos asociados. Por otro lado, tus 
          discos, conciertos y merchandise seguirán estando disponibles.

          Si creas un artista nuevos, toda tu información se asociará a este.
        </p>
      </div>

      <div className="delete-artist-transaction__buttons">
        <Button
          className="delete-artist-transaction__buttons-delete"
          secondary
          onReload={onReload}
          onClick={() => handleDelete(accessToken)}
        >
          Eliminar
        </Button>
        <Button
          className="delete-artist-transaction__buttons-cancel"
          primary
          onClick={close}
        >
          Cancelar
        </Button>
      </div>
    </div>
  )
}
