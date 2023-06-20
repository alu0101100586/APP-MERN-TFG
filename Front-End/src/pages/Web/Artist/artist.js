import React, { useState, useEffect } from 'react'
import { Grid, Image, Icon, Input } from 'semantic-ui-react'
import { ArtistService } from '../../../service'
import { ENV, formatDate } from '../../../utils'
import { image } from '../../../assets'
import { ArtistItemList, NotFound } from '../../../components/Web'
import './artist.scss'

const artistService = new ArtistService()

export function Artist() {
  const url = window.location.href
  const urlParts = url.split('/')
  const artistId = urlParts[urlParts.length - 1]

  const [artist, setArtist] = useState({})

  useEffect(() => {
    ;(async () => {
      const artistResponse = await artistService.getArtistApi(artistId)
      setArtist(artistResponse)
    })()
  }, [])

  if (artist.status === 404) {
    return <NotFound />
  } else {
    return (
      <div className="artist-page">
        <div className="artist-page__info">
          <Grid padded divided stackable columns={2}>
            <Grid.Column>
              <Image
                src={
                  artist.avatar
                    ? `${ENV.BASE_PATH}/${artist.avatar}`
                    : image.Default_Avatar
                }
                circular
                size="large"
              />
            </Grid.Column>
            <Grid.Column>
              <Input
                label="Nombre del Artista"
                type="text"
                value={artist.name}
                readonly
                tabIndex={-1}
              />
              <Input
                label="Fecha de inicio"
                type="text"
                value={formatDate(artist.startDate)}
                readonly
                tabIndex={-1}
              />
              <Input
                label="Generos Musicales"
                type="text"
                value={
                  artist.musicalGenre ? artist.musicalGenre.join(', ') : ' - '
                }
                readonly
                tabIndex={-1}
              />
            </Grid.Column>
          </Grid>
        </div>

        <div className="artist-page__proyects">
          <h1>
            <Icon name="angle double down" />
            Proyectos de {artist.name}
            <Icon name="angle double down" />
          </h1>
          {artist.discs && artist.discs.length > 0 && (
            <div className="artist-page__proyects__discs">
              <h2>Discos</h2>
              <ArtistItemList id={artistId} type="disc" />
            </div>
          )}
          {artist.concerts && artist.concerts.length > 0 && (
            <div className="artist-page__proyects__concerts">
              <h2>Conciertos</h2>
              <ArtistItemList id={artistId} type="concert" />
            </div>
          )}
          {artist.merchandise && artist.merchandise.length > 0 && (
            <div className="artist-page__proyects__merchandises">
              <h2>Merchandise</h2>
              <ArtistItemList id={artistId} type="merchandise" />
            </div>
          )}
        </div>
      </div>
    )
  }
}
