import React, { useEffect, useState } from 'react'
import { Loader } from 'semantic-ui-react'
import { map } from 'lodash'
import {
  DiscService,
  ConcertService,
  MerchandiseService,
} from '../../../../service'
import { ArtistItem } from '../ArtistItem'
import './ArtistItemList.scss'

const discController = new DiscService()
const concertController = new ConcertService()
const merchController = new MerchandiseService()

export function ArtistItemList(props) {
  const { id, type } = props
  const [items, setItems] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        if (type === 'disc') {
          const response = await discController.getDiscsArtistApi(id)
          setItems(response)
        } else if (type === 'concert') {
          const response = await concertController.getConcertsArtistApi(id)
          setItems(response)
        } else if (type === 'merchandise') {
          const response = await merchController.getMerchandiseArtistApi(id)
          setItems(response)
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  if (!items) return <Loader active inline="centered" />

  return (
    <div className="artist-item-list">
      <div className="artist-item-list__items">
        {map(items, (item) => (
          <ArtistItem item={item} type={type} />
        ))}
      </div>
    </div>
  )
}
