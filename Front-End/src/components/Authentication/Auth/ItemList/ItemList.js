import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader, Pagination } from 'semantic-ui-react'
import { map } from 'lodash'
import { DiscService } from '../../../../service'
import { useAuth } from '../../../../hooks'
import { BasicItem } from '../BasicItem'
import './ItemList.scss'

const discController = new DiscService()
// const concertController = new ConcertService();
// const merchandiseController = new MerchandiseService();

export function ItemList(props) {
  const { accessToken } = useAuth()
  const { reload, type } = props
  const [items, setItems] = useState(null)
  const [pagination, setPagination] = useState()
  const [page, setPage] = useState(1)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate(searchParams.get('page') || 1)

  useEffect(() => {
    ;(async () => {
      try {
        if (type === 'disc') {
          const response = await discController.getDiscsUserApi(
            accessToken,
            page,
            3
          )
          setItems(response.docs)
          setPagination({
            page: response.page,
            limit: response.limit,
            pages: response.pages,
            total: response.total,
          })
        } else if (type === 'concert') {
          console.log('concert')
          // const response = await concertController.getConcertsUserApi(accessToken, page, 3);
          // setItems(response.docs);
          // setPagination({
          //   page: response.page,
          //   limit: response.limit,
          //   pages: response.pages,
          //   total: response.total,
          // })
        } else if (type === 'merchandise') {
          console.log('merchandise')
          // const response = await merchController.getMerchandisesUserApi(accessToken, page, 3);
          // setItems(response.docs);
          // setPagination({
          //   page: response.page,
          //   limit: response.limit,
          //   pages: response.pages,
          //   total: response.total,
          // })
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload, page])

  const changePage = (_, data) => {
    const newPage = data.activePage
    setPage(newPage)
    navigate(`?page=${newPage}`)
  }

  if (!items) return <Loader active inline="centered" />

  return (
    <div className="item-list">
      <div className="item-list__list">
        {map(items, (item) => (
          <BasicItem item={item} />
        ))}
      </div>
      <div className="item-list__pagination">
        <Pagination
          totalPages={pagination.pages}
          defaultActivePage={pagination.page}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          secondary
          pointing
          onPageChange={changePage}
        />
      </div>
    </div>
  )
}
