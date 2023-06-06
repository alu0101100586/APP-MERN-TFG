import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader, Pagination } from 'semantic-ui-react'
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
  const [pagination, setPagination] = useState()
  const [page, setPage] = useState(1)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate(searchParams.get('page') || 1)

  useEffect(() => {
    ;(async () => {
      try {
        if (type === 'disc') {
          const response = await discController.getDiscsArtistApi(id)
          setItems(response.docs)
          setPagination({
            page: response.page,
            limit: response.limit,
            pages: response.pages,
            total: response.total,
          })
        } else if (type === 'concert') {
          const response = await concertController.getConcertsArtistApi(id)
          setItems(response.docs)
          setPagination({
            page: response.page,
            limit: response.limit,
            pages: response.pages,
            total: response.total,
          })
        } else if (type === 'merchandise') {
          const response = await merchController.getMerchandiseArtistApi(id)
          setItems(response.docs)
          setPagination({
            page: response.page,
            limit: response.limit,
            pages: response.pages,
            total: response.total,
          })
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [page])

  const handleChangePage = (_, data) => {
    const newPage = data.activePage
    setPage(newPage)
    navigate(`?page=${newPage}`)
  }

  if (!items) return <Loader active inline="centered" />

  return (
    <div className="artist-item-list">
      <div className="artist-item-list__items">
        {map(items, (item) => (
          <ArtistItem item={item} type={type} />
        ))}
      </div>

      <div className="artist-item-list__pagination">
        <Pagination
          totalPages={pagination.pages}
          defaultActivePage={pagination.page}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          secondary
          pointing
          onPageChange={handleChangePage}
        />
      </div>
    </div>
  )
}
