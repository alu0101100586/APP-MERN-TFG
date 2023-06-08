import React, { useState, useEffect } from 'react'
import { Grid, Image, Button } from 'semantic-ui-react'
import { MerchandiseService, ArtistService } from '../../../service'
import { useNavigate } from 'react-router-dom'
import { ENV, formatDate } from '../../../utils'
import { ProgressBar, NotFound } from '../../../components/Web'
import { image } from '../../../assets'
import { useAuth } from '../../../hooks'
import './merchandising.scss'

const merchService = new MerchandiseService()
const artistService = new ArtistService()

export function Merchandising() {
  const { user } = useAuth()
  const url = window.location.href
  const urlParts = url.split('/')
  const merchId = urlParts[urlParts.length - 1]

  const [merch, setMerch] = useState({})
  const [artist, setArtist] = useState({})
  const [isHovered, setIsHovered] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      const merchResponse = await merchService.getMerchandiseApi(merchId)
      const artistResponse = await artistService.getArtistApi(
        merchResponse.ownerId
      )
      setMerch(merchResponse)
      setArtist(artistResponse)
    })()
  }, [])

  merch.size = merch.size || []

  let size = ''
  if (merch.size.length >= 2) {
    const lastSize = merch.size[merch.size.length - 1]
    size =
      merch.size.slice(0, merch.size.length - 1).join(', ') + ' y ' + lastSize
  } else {
    size = merch.size.join(', ')
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  if (merch.status === 404) {
    return <NotFound />
  }

  return (
    <div className="specific-merch">
      <Grid padded columns={3} stackable>
        <Grid.Column>
          <Image
            src={
              merch.image
                ? `${ENV.BASE_PATH}/${merch.image}`
                : image.Default_Avatar
            }
            size="massive"
          />
        </Grid.Column>

        <Grid.Column>
          <div className="merch-info">
            <h1>{merch.name}</h1>
            <p>
              Esta campaña de crowdfunding tiene como objetivo recaudar fondos
              para la producción del merchandising de{' '}
              <span style={{ fontWeight: 'bold' }}>{artist.name}</span>.
              dispondrá de un precio para los que apoyen la campaña de{' '}
              <span style={{ fontWeight: 'bold' }}> {merch.price}€</span> hasta
              el dia{' '}
              <span style={{ fontWeight: 'bold' }}>
                {formatDate(merch.releaseDate)}
              </span>
              . Dispondrá de las tallas{' '}
              <span style={{ fontWeight: 'bold' }}>{size}</span>.
            </p>
            <h1>Descripción:</h1>
            <p>{merch.description}</p>
            <p>Hacer más bonita la descripción</p>
          </div>
        </Grid.Column>

        <Grid.Column>
          <div className="crowdfunding-info">
            <div
              className={`artist-info ${isHovered ? 'hovered' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate(`/artist/${artist._id}`)}
            >
              <Image
                src={
                  artist.avatar
                    ? `${ENV.BASE_PATH}/${artist.avatar}`
                    : image.Default_Avatar
                }
                size="medium"
              />

              <div className="overlay">
                <div className="name" style={{ textTransform: 'capitalize' }}>
                  {artist.name}
                </div>
              </div>
            </div>
            <h1>Información del proyecto:</h1>
            <p>
              Para llevar a cabo la producción del merchandise se necesita un
              mínimo de{' '}
              <span style={{ fontWeight: 'bold' }}>{merch.moneyLimit}€</span>.{' '}
              La campaña de crowdfunding estará activa hasta el dia{' '}
              <span style={{ fontWeight: 'bold' }}>
                {formatDate(merch.releaseDate)}
              </span>
              . Se ha recaudado un total de{' '}
              <span style={{ fontWeight: 'bold' }}>{merch.raisedMoney}€</span>{' '}
              de a falta de{' '}
              <span style={{ fontWeight: 'bold' }}>
                {merch.moneyLimit - merch.raisedMoney}€
              </span>{' '}
              para llegar al objetivo. El progreso de la campaña se puede ver en
              la siguiente barra de progreso:
            </p>
            <ProgressBar total={merch.moneyLimit} current={merch.raisedMoney} />
            {user &&
              user.role === 'common' &&
              new Date(merch.releaseDate) >= new Date() && (
                <Button
                  primary
                  onClick={() =>
                    navigate(`/auth/payment/merchandise-${merchId}`)
                  }
                >
                  Apoyar la campaña
                </Button>
              )}
          </div>
        </Grid.Column>
      </Grid>
    </div>
  )
}
