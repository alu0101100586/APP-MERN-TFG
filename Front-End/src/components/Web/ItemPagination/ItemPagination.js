import React, { useState } from 'react'
import { Pagination } from 'semantic-ui-react'
import { ItemRender } from '../ItemRender'
import './ItemPagination.scss'

export function ItemPagination(props) {
  const { items, type } = props
  const [currentPage, setCurrentPage] = useState(1)

  const handlePageChange = (event, { activePage }) => {
    setCurrentPage(activePage)
  }

  const itemsPerPage = 3
  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem)

  if (items.length === 0) return null

  return (
    <div className="item-pagination">
      <div className="item-pagination__items">
        {currentItems.map((item, index) => (
          <ItemRender key={index} item={item} type={type} />
        ))}
      </div>

      <div className="item-pagination__pagination">
        <Pagination
          activePage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          secondary
          pointing
          size="massive"
        />
      </div>
    </div>
  )
}
