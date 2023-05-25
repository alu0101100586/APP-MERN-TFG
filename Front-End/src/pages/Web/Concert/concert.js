import React, { useState, useEffect} from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import { ConcertService, ArtistService } from '../../../service';
import { useNavigate } from 'react-router-dom';
import { ENV, formatDate } from '../../../utils';
import { ProgressBar } from '../../../components/Web';
import { image } from '../../../assets';
import './concert.scss';

const concertService = new ConcertService();
const artistService = new ArtistService();

export function Concert() {
  const url = window.location.href;
  const urlParts = url.split('/');
  const concertId = urlParts[urlParts.length - 1];

  const [concert, setConcert] = useState({});
  const [artist, setArtist] = useState({});
  const [ isHovered, setIsHovered ] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const concertResponse = await concertService.getConcertApi(concertId);
      const artistResponse = await artistService.getArtistApi(concertResponse.ownerId);
      setConcert(concertResponse);
      setArtist(artistResponse);
    })();
  }, []);

  concert.musicalGenre = concert.musicalGenre || [];
  concert.participants = concert.participants || [];

  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  return (
    <div className='specific-concert'>
      <Grid padded columns={3}>
        <Grid.Column>
          <Image 
            src={
              concert.concertPoster 
              ? `${ENV.BASE_PATH}/${concert.concertPoster}` 
              : image.Default_Avatar
            } 
            size='massive'
          />
        </Grid.Column>

        <Grid.Column>
          <div className='concert-info'>
            <h1>{concert.name}</h1>
            <h2>Precio: {concert.price} €</h2>
            <h2>Géneros:</h2>
            <h3>
              {concert.musicalGenre.map((genre, index) => (
                <p key={index}>- {genre}</p>
              ))}
            </h3>
            <h2>Participantes</h2>
            <h3>
              {concert.participants.map((song, index) => (
                <p key={index}>- {song}</p>
              ))}
            </h3>
            <h2>Ubicación:</h2>
            <h3>{concert.location}</h3>
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
            <h2>Fecha de limite: {formatDate(concert.date)}</h2>
            <h2>Financiación a alcanzar: {(concert.moneyLimit)} €</h2>
            <h2>Financiación actual:</h2>
            <ProgressBar total={concert.moneyLimit} current={concert.raisedMoney} />
            <Button primary onClick={() => navigate(`/auth/payment/concert-${concertId}`)}>
              Apoyar la campaña
            </Button>
          </div>
        </Grid.Column>
      </Grid>
    </div>
  )
}
