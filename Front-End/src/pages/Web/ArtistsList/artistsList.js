import React, { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { SearchBar } from '../../../components/Web';
import { ArtistService } from '../../../service';
import './artistsList.scss';

//TODO - Grid de dos rows en el primero un buscador y en el segundo la paginación con los artistas
// Los artistas por default, vendrán ordenados por mongoDB por fecha de creación, de tal manera que muestre los mas recientes primero
// El buscador, buscará por nombre de artista, fecha de inicio y por géneros musicales

const artistService = new ArtistService();

export function ArtistsList() {
  const [items, setItems] = useState(null);

  return (
    <div className='artist-list'>
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            <SearchBar />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {/* <ItemPagination /> */}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}
