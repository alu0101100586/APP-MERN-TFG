import React, { useState, useEffect } from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import { DiscService, ArtistService } from '../../../service';
import { useNavigate } from 'react-router-dom';
import { ENV, formatDate } from '../../../utils';
import { ProgressBar } from '../../../components/Web';
import { image } from '../../../assets';
import './disc.scss';

const discService = new DiscService();
const artistService = new ArtistService();

export function Disc() {
  const url = window.location.href;
  const urlParts = url.split('/');
  const discId = urlParts[urlParts.length - 1];

  const [disc, setDisc] = useState({});
  const [artist, setArtist] = useState({});
  const [ isHovered, setIsHovered ] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const discResponse = await discService.getDiscApi(discId);
      const artistResponse = await artistService.getArtistApi(discResponse.ownerId);
      setDisc(discResponse);
      setArtist(artistResponse);
    })();
  }, []);

  disc.musicalGenre = disc.musicalGenre || [];
  disc.songs = disc.songs || [];

  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  return (
    <div className='specific-disc'>
      <Grid padded columns={3}>
        <Grid.Column>
          <Image 
            src={
              disc.cover 
              ? `${ENV.BASE_PATH}/${disc.cover}` 
              : image.Default_Avatar
            } 
            size='massive'
          />
        </Grid.Column>

        <Grid.Column>
          <div className='disc-info'>
            <h1>{disc.name}</h1>
            <h2>Precio: {disc.price} €</h2>
            <h2>Géneros:</h2>
            <h3>
              {disc.musicalGenre.map((genre, index) => (
                <p key={index}>- {genre}</p>
              ))}
            </h3>
            <h2>Canciones</h2>
            <h3>
              {disc.songs.map((song, index) => (
                <p key={index}>- {song}</p>
              ))}
            </h3>
          </div>
        </Grid.Column>

        <Grid.Column>
          <div className='crowdfunding-info'>
            <div 
              className={`artist-info ${isHovered ? 'hovered' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate(`/artist/${artist._id}`)}
            >
              <Image src={
                artist.avatar
                ? `${ENV.BASE_PATH}/${artist.avatar}`
                : image.Default_Avatar
              } size="medium" />

              <div className='overlay'>
                <div 
                  className='name'
                  style={{ textTransform: 'capitalize' }}
                >
                  {artist.name}
                </div>
              </div>
            </div>
            <h2>Fecha de limite: {formatDate(disc.releaseDate)}</h2>
            <h2>Financiación a alcanzar: {(disc.moneyLimit)} €</h2>
            <h2>Financiación actual:</h2>
            <ProgressBar total={disc.moneyLimit} current={disc.raisedMoney} />
            <Button primary onClick={() => navigate(`/auth/payment/disc-${discId}`)}>
              Apoyar la campaña
            </Button>
          </div>
        </Grid.Column>
      </Grid>
    </div>
  )
}
