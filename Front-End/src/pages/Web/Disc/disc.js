import React, { useState, useEffect } from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import { DiscService, ArtistService } from '../../../service';
import { useNavigate } from 'react-router-dom';
import { ENV, formatDate } from '../../../utils';
import { ProgressBar } from '../../../components/Web';
import { image } from '../../../assets';
import { useAuth } from '../../../hooks';
import './disc.scss';

const discService = new DiscService();
const artistService = new ArtistService();

export function Disc() {
  const { user } = useAuth();
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

  let genre = '';
  if (disc.musicalGenre.length >= 2) {
    const lastGenre = disc.musicalGenre[disc.musicalGenre.length - 1];
    genre = disc.musicalGenre.slice(0, disc.musicalGenre.length - 1).join(', ') + ' y ' + lastGenre;
  } else {
    genre = disc.musicalGenre.join(', ');
  }

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
            <p>
              Este disco es un proyecto de crowdfunding del artista{" "}
              <span style={{ fontWeight: "bold" }}>{artist.name}</span>. Tiene un precio
              de <span style={{ fontWeight: "bold" }}>{disc.price}€</span> y se puede
              participar en la campaña hasta{" "}
              <span style={{ fontWeight: "bold" }}>{formatDate(disc.releaseDate)}</span>.
              El disco está pensado para los amantes de la música{" "}
              <span style={{ fontWeight: "bold" }}>{genre}</span>.
              Tendrá disponibles las siguientes canciones:
            </p>
            <p>
              {disc.songs.map((song, index) => (
                <p key={index}>- {song}</p>
              ))}
            </p>
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
            <h1>Información del proyecto:</h1>
            <p>
              Para poder llevar a cabo este proyecto, el artista necesita recaudar{" "}
              <span style={{ fontWeight: "bold" }}>{disc.moneyLimit}€</span> antes de{" "}
              <span style={{ fontWeight: "bold" }}>{formatDate(disc.releaseDate)}</span>.
              Hasta el momento, ha recaudado{" "}
              <span style={{ fontWeight: "bold" }}>{disc.raisedMoney}€</span> {" "}
              quedando un total de{" "}
              <span style={{ fontWeight: "bold" }}>{disc.moneyLimit - disc.raisedMoney}€</span> 
              {" "} por recaudar.
              El progreso de la campaña se puede ver en la siguiente barra de progreso:
            </p>
            <ProgressBar total={disc.moneyLimit} current={disc.raisedMoney} />
            {user && user.role === 'common' && new Date(disc.releaseDate) >= new Date() && (
              <Button primary onClick={() => navigate(`/auth/payment/disc-${discId}`)}>
                Apoyar la campaña
              </Button>
            )}
          </div>
        </Grid.Column>
      </Grid>
    </div>
  )
}
