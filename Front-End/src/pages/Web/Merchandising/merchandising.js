import React, { useState, useEffect } from 'react';
import { Grid, Image, Button } from 'semantic-ui-react';
import { MerchandiseService, ArtistService } from '../../../service';
import { useNavigate } from 'react-router-dom';
import { ENV, formatDate } from '../../../utils';
import { ProgressBar } from '../../../components/Web';
import { image } from '../../../assets';
import './merchandising.scss';

const merchService = new MerchandiseService();
const artistService = new ArtistService();

export function Merchandising() {
  const url = window.location.href;
  const urlParts = url.split('/');
  const merchId = urlParts[urlParts.length - 1];

  const [merch, setMerch] = useState({});
  const [artist, setArtist] = useState({});
  const [ isHovered, setIsHovered ] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const merchResponse = await merchService.getMerchandiseApi(merchId);
      const artistResponse = await artistService.getArtistApi(merchResponse.ownerId);
      setMerch(merchResponse);
      setArtist(artistResponse);
    })();
  }, []);

  merch.size = merch.size || [];

  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  return (
    <div className='specific-merch'>
      <Grid padded columns={3}>
        <Grid.Column>
          <Image
            src={
              merch.image
              ? `${ENV.BASE_PATH}/${merch.image}`
              : image.Default_Avatar
            }
            size='massive'
          />
        </Grid.Column>

        <Grid.Column>
          <div className='merch-info'>
            <h1>{merch.name}</h1>
            <h2>Precio: {merch.price} €</h2>
            <h2>Tallas: {merch.size.join(', ')}</h2>
            <h2>Descripción:</h2>
            <p>{merch.description}</p>
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
            <h2>Fecha de limite: {formatDate(merch.releaseDate)}</h2>
            <h2>Financiación a alcanzar: {(merch.moneyLimit)} €</h2>
            <h2>Financiación actual:</h2>
            <ProgressBar total={merch.moneyLimit} current={merch.raisedMoney} />
            <Button primary onClick={() => navigate(`/auth/payment/merch-${merchId}`)}>
              Apoyar la campaña
            </Button>
          </div>
        </Grid.Column>
      </Grid>
    </div>
  )
}
