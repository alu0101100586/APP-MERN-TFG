import React, { useState, useEffect } from 'react'
import { Form, Icon } from 'semantic-ui-react'
import { useFormik } from 'formik'
import {
  ArtistService,
  DiscService,
  ConcertService,
  MerchandiseService,
} from '../../../service'
import { initialValues, validationSchema } from './SearchBar.form'
import { ItemPagination } from '../ItemPagination'
import { formatDate } from '../../../utils'
import './SearchBar.scss'

const artistService = new ArtistService()
const discService = new DiscService()
const concertService = new ConcertService()
const merchandiseService = new MerchandiseService()

export function SearchBar(props) {
  const { type } = props
  const [items, setItems] = useState([])
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    ;(async () => {
      switch (type) {
        case 'artist':
          const responseArtist = await artistService.getArtistsApi()
          const sortedArtist = responseArtist.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
          })
          setItems(sortedArtist)
          break
        case 'disc':
          const responseDisc = await discService.getDiscsApi()
          const sortedDiscs = responseDisc.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
          })
          setItems(sortedDiscs)
          break
        case 'concert':
          const responseConcert = await concertService.getConcertsApi()
          const sortedConcerts = responseConcert.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
          })
          setItems(sortedConcerts)
          break
        case 'merchandise':
          const responseMerchandise =
            await merchandiseService.getMerchandisesApi()
          const sortedMerchandising = responseMerchandise.sort((a, b) => {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
          })
          setItems(sortedMerchandising)
          break
        default:
          break
      }
    })()
  }, [])

  const discOptions = [
    { key: '1', value: 'name', text: 'Nombre' },
    { key: '2', value: 'releaseDate', text: 'Fecha (dd-mm-yyyy)' },
    { key: '3', value: 'musicalGenre', text: 'Géneros Musicales' },
  ]

  const concertOptions = [
    { key: '1', value: 'name', text: 'Nombre' },
    { key: '2', value: 'date', text: 'Fecha (dd-mm-yyyy)' },
    { key: '3', value: 'musicalGenre', text: 'Géneros Musicales' },
  ]

  const merchOptions = [
    { key: '1', value: 'name', text: 'Nombre' },
    { key: '2', value: 'releaseDate', text: 'Fecha (dd-mm-yyyy)' },
    { key: '3', value: 'size', text: 'Tallas' },
  ]

  const artistOptions = [
    { key: '1', value: 'name', text: 'Nombre' },
    { key: '2', value: 'musicalGenre', text: 'Géneros Musicales' },
  ]

  const options =
    type === 'disc'
      ? discOptions
      : type === 'concert'
      ? concertOptions
      : type === 'merchandise'
      ? merchOptions
      : artistOptions

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: (values) => {
      handleSearch(values.searchTerm, values.filter)
    },
    validateOnChange: false,
  })

  const handleSearch = (searchTerm, selectedFilter) => {
    if (items.length === 0) setItems([items])
    if (searchTerm === '') return setSearchResults(items)
    const filteredResults = items.filter((item) => {
      const searchField =
        options.find((option) => option.value === selectedFilter)?.value || ''
      switch (searchField) {
        case 'name': {
          const fieldValue = item[searchField] || ''
          return fieldValue.toLowerCase().includes(searchTerm.toLowerCase())
        }

        case 'date':
        case 'releaseDate': {
          const fieldValue = new Date(item[searchField]) || ''
          return searchTerm === formatDate(fieldValue)
        }

        case 'musicalGenre': {
          const fieldValue = item[searchField] || ''
          const lowerCaseGenres = fieldValue.map((genre) => genre.toLowerCase())
          return lowerCaseGenres.includes(searchTerm.toLowerCase())
        }

        case 'size': {
          const fieldValue = item[searchField] || ''
          const lowerCaseSizes = fieldValue.map((size) => size.toLowerCase())
          return lowerCaseSizes.includes(searchTerm.toLowerCase())
        }
      }
    })

    setSearchResults(filteredResults)
  }

  return (
    <div className="search-bar">
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Input
            width={16}
            type="text"
            placeholder="Ingrese su búsqueda..."
            icon={<Icon name="search" link />}
            name="searchTerm"
            value={formik.values.searchTerm}
            onChange={formik.handleChange}
            error={formik.errors.searchTerm}
          />

          <Form.Select
            width={4}
            placeholder="Filtrar por..."
            options={options}
            name="filter"
            value={formik.values.filter}
            onChange={(e, { value }) => formik.setFieldValue('filter', value)}
            error={formik.errors.filter}
          />

          <Form.Button
            width={3}
            content="Buscar"
            type="submit"
            onSubmit={formik.onSubmit}
          />
        </Form.Group>
      </Form>

      <div className="search-results">
        {searchResults.length === 0 ? (
          <ItemPagination items={items} type={type} />
        ) : (
          <ItemPagination items={searchResults} type={type} />
        )}
      </div>
    </div>
  )
}
