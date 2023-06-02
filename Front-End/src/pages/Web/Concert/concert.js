import React, { useState, useEffect} from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import { ConcertService, ArtistService } from '../../../service';
import { useNavigate } from 'react-router-dom';
import { ENV, formatDate } from '../../../utils';
import { ProgressBar, Map } from '../../../components/Web';
import { image } from '../../../assets';
import { useAuth } from '../../../hooks';
import './concert.scss';

const concertService = new ConcertService();
const artistService = new ArtistService();

export function Concert() {
  const { user } = useAuth();
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

  let genre = '';
  if (concert.musicalGenre.length >= 2) {
    const lastGenre = concert.musicalGenre[concert.musicalGenre.length - 1];
    genre = concert.musicalGenre.slice(0, concert.musicalGenre.length - 1).join(', ') + ' y ' + lastGenre;
  } else {
    genre = concert.musicalGenre.join(', ');
  }

  let participants = '';
  if (concert.participants.length >= 2) {
    const lastParticipant = concert.participants[concert.participants.length - 1];
    participants = concert.participants.slice(0, concert.participants.length - 1).join(', ') + ' y ' + lastParticipant;
  } else {
    participants = concert.participants.join(', ');
  }

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
            <p>
              Este concierto es un proyecto de crowdfunding para poder llevar a 
              cabo el concierto de{' '}
              <span style={{ fontWeight: "bold" }}>{artist.name}</span>. y se
              puede apoyar  pagando una entrada anticipada cuyo precio es de{' '}
              <span style={{ fontWeight: "bold" }}>{concert.price}€</span>.
              y se puede participar en el proyecto hasta el{' '}
              <span style={{ fontWeight: "bold" }}>{formatDate(concert.date)}</span>.
              Tendrá una temática basada en {' '}
              <span style={{ fontWeight: "bold" }}>{genre}</span>, y contará con la
              participación de {' '}
              <span style={{ fontWeight: "bold" }}>{participants}</span>.
            </p>
            <h1>Ubicación:</h1>
            <Map location={concert.location} />
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
              Este proyecto de crowdfunding tiene como objetivo recaudar fondos para
              poder llevar a cabo el concierto de{' '}
              <span style={{ fontWeight: "bold" }}>{artist.name}</span>. El dinero
              recaudado se destinará a pagar los gastos de la sala, el equipo de sonido
              y la publicidad del evento. Se necesita recaudar un mínimo de{' '}
              <span style={{ fontWeight: "bold" }}>{concert.moneyLimit}€</span> para
              poder llevar a cabo el concierto, y se puede participar en el proyecto
              hasta el{' '}
              <span style={{ fontWeight: "bold" }}>{formatDate(concert.date)}</span>.
              Se ha recaudado un total de{' '}
              <span style={{ fontWeight: "bold" }}>{concert.raisedMoney}€</span> de
              y quedan un total de{' '}
              <span style={{ fontWeight: "bold" }}>{concert.moneyLimit - concert.raisedMoney}€</span>
              para llegar al objetivo.
              El progreso de la campaña se puede ver en la siguiente barra de progreso:
            </p>
            <ProgressBar total={concert.moneyLimit} current={concert.raisedMoney} />
            {user && user.role === 'common' && new Date(concert.releaseDate) >= new Date() && (
              <Button primary onClick={() => navigate(`/auth/payment/concert-${concertId}`)}>
                Apoyar la campaña
              </Button>
            )}
          </div>
        </Grid.Column>
      </Grid>
    </div>
  )
}
