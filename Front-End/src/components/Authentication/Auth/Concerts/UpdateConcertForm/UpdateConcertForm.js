import React, { useCallback, useState, useEffect } from 'react'
import { Form, Image } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import { useDropzone } from 'react-dropzone'
import { useFormik } from 'formik'
import { map } from 'lodash'
import { initialValues, validationSchema } from './UpdateConcertForm.form'
import { ENV } from '../../../../../utils'
import { useAuth } from '../../../../../hooks'
import { ConcertService } from '../../../../../service'
import './UpdateConcertForm.scss'

const concertService = new ConcertService()

export function UpdateConcertForm(props) {
  const { close, onReload } = props
  const { accessToken } = useAuth()
  const [releaseDate, setReleaseDate] = useState('')
  const [concerts, setConcerts] = useState(null)
  const [item, setItem] = useState('')

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (formData) => {
      try {
        formData.participants = formData.participants.split(',')
        await concertService.updateConcertApi(
          accessToken,
          formData,
          formData.item
        )
        onReload()
        close()
      } catch (error) {
        console.log(error)
      }
    },
    validateOnChange: false,
  })

  useEffect(() => {
    ;(async () => {
      console.log(formik.values.musicalGenre)
      try {
        const response = await concertService.getConcertsUserApi(
          accessToken,
          1,
          1000
        )
        setConcerts(response.docs)
      } catch (error) {
        throw error
      }
    })()
  }, [formik.values.musicalGenre])

  const itemOptions = map(concerts, (concert) => ({
    key: concert._id,
    text: concert.name,
    value: concert._id,
  }))

  const handleItemOptionChange = (event, { value }) => {
    setItem(value)
    formik.setFieldValue('item', value)

    const concert = concerts.find((concert) => concert._id === value)
    const concertReleaseDate = concert?.date
      ? new Date(concert.date).toISOString()
      : ''
    const concertParticipants = concert?.participants
      ? concert.participants.join(', ')
      : ''
    formik.setFieldValue('name', concert?.name)
    formik.setFieldValue('date', concertReleaseDate)
    formik.setFieldValue('location', concert?.location)
    formik.setFieldValue('moneyLimit', concert?.moneyLimit)
    formik.setFieldValue('price', concert?.price)
    formik.setFieldValue('raisedMoney', concert?.raisedMoney)
    formik.setFieldValue('concertPoster', concert?.concertPoster)
    formik.setFieldValue('musicalGenre', concert?.musicalGenre)
    formik.setFieldValue('participants', concertParticipants)
  }

  const handleDateChange = (date) => {
    setReleaseDate(date)
    formik.setFieldValue('date', date)
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    formik.setFieldValue('concertPoster', URL.createObjectURL(file))
    formik.setFieldValue('fileConcertPoster', file)
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop,
  })

  const getConcertPoster = () => {
    if (formik.values.fileConcertPoster) {
      return formik.values.concertPoster
    } else if (formik.values.concertPoster) {
      return `${ENV.BASE_PATH}/${formik.values.concertPoster}`
    }
    return null
  }

  const musicGenre = [
    { key: 'Rock', text: 'Rock', value: 'Rock' },
    { key: 'Pop', text: 'Pop', value: 'Pop' },
    { key: 'Metal', text: 'Metal', value: 'Metal' },
    { Key: 'Punk', text: 'Punk', value: 'Punk' },
    { key: 'Indie', text: 'Indie', value: 'Indie' },
    { key: 'Electronica', text: 'Electronica', value: 'Electronica' },
    { key: 'Hip-Hop', text: 'Hip-Hop', value: 'Hip-Hop' },
    { key: 'Rap', text: 'Rap', value: 'Rap' },
    { key: 'Soul', text: 'Soul', value: 'Soul' },
    { key: 'Reggae', text: 'Reggae', value: 'Reggae' },
    { key: 'Blues', text: 'Blues', value: 'Blues' },
    { key: 'Jazz', text: 'Jazz', value: 'Jazz' },
    { key: 'Folk', text: 'Folk', value: 'Folk' },
    { key: 'Country', text: 'Country', value: 'Country' },
    { key: 'Latin', text: 'Latin', value: 'Latin' },
    { key: 'Clasica', text: 'Clasica', value: 'Clasica' },
    { key: 'Phonk', text: 'Phonk', value: 'Phonk' },
    { key: 'House', text: 'House', value: 'House' },
    { key: 'Techno', text: 'Techno', value: 'Techno' },
    { key: 'Trance', text: 'Trance', value: 'Trance' },
    { key: 'Drum & Bass', text: 'Drum & Bass', value: 'Drum & Bass' },
    { key: 'Trap', text: 'Trap', value: 'Trap' },
    { key: 'Dubstep', text: 'Dubstep', value: 'Dubstep' },
    { key: 'Funk', text: 'Funk', value: 'Funk' },
    { key: 'Disco', text: 'Disco', value: 'Disco' },
    { key: 'R&B', text: 'R&B', value: 'R&B' },
    { key: 'Ska', text: 'Ska', value: 'Ska' },
    { hey: 'Reggaeton', text: 'Reggaeton', value: 'Reggaeton' },
    { key: 'Salsa', text: 'Salsa', value: 'Salsa' },
    { key: 'Bachata', text: 'Bachata', value: 'Bachata' },
    { key: 'Merengue', text: 'Merengue', value: 'Merengue' },
    { key: 'Cumbia', text: 'Cumbia', value: 'Cumbia' },
    { key: 'Vallenato', text: 'Vallenato', value: 'Vallenato' },
    { key: 'Otros', text: 'Otros', value: 'Otros' },
  ]

  const handleGenreSelected = (event, data) => {
    const selectedGenres = data.value
    formik.setFieldValue('musicalGenre', selectedGenres)
  }

  const options = musicGenre.map((genre) => {
    return { key: genre.key, text: genre.text, value: genre.value }
  })

  return (
    <Form className="update-concert-form" onSubmit={formik.handleSubmit}>
      <Form.Select
        label="Concierto"
        name="item"
        placeholder="Selecciona un concierto"
        options={itemOptions}
        onChange={handleItemOptionChange}
        value={item}
        error={formik.errors.item}
      />

      <div className="update-concert-form__avatar" {...getRootProps()}>
        <input {...getInputProps()} />
        <span className="title"> Cartel del concierto: </span>
        <Image size="small" src={getConcertPoster()} />
        {formik.errors.concertPoster && formik.touched.concertPoster ? (
          <div className="update-concert-form__error">
            {formik.errors.concertPoster}
          </div>
        ) : null}
      </div>

      <Form.Input
        name="name"
        placeholder="Nombre del concierto"
        onChange={formik.handleChange}
        value={formik.values.name}
        error={formik.errors.name}
      />

      <Form.Input
        name="location"
        placeholder="Lugar del concierto (Calle, número, ciudad, país)"
        onChange={formik.handleChange}
        value={formik.values.location}
        error={formik.errors.location}
      />

      <Form.Field>
        <DatePicker
          selected={
            formik.values.date ? new Date(formik.values.date) : releaseDate
          }
          onChange={handleDateChange}
          dateFormat={'dd/MM/yyyy'}
          placeholderText="Fecha Salida Estimada"
        />
        {formik.touched.date && formik.errors.date ? (
          <div className="update-disc-form__error">Ingresa una fecha</div>
        ) : null}
      </Form.Field>

      <Form.Group widths="three">
        <Form.Input
          name="moneyLimit"
          placeholder="Meta de Dinero"
          onChange={formik.handleChange}
          value={formik.values.moneyLimit}
          error={formik.errors.moneyLimit}
        />

        <Form.Input
          name="price"
          placeholder="Precio de venta"
          onChange={formik.handleChange}
          value={formik.values.price}
          error={formik.errors.price}
        />

        <Form.Input
          name="raisedMoney"
          placeholder="Dinero Recaudado"
          onChange={formik.handleChange}
          value={formik.values.raisedMoney}
          error={formik.errors.raisedMoney}
        />
      </Form.Group>

      <Form.Dropdown
        name="musicalGenre"
        placeholder="Selecciona los géneros musicales"
        fluid
        multiple
        selection
        search
        options={options}
        onChange={handleGenreSelected}
        value={formik.values.musicalGenre}
        error={formik.errors.musicalGenre}
      />

      <Form.Input
        label="Separe los participantes con comas (,)"
        name="participants"
        placeholder="Participantes"
        value={formik.values.participants}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.participants && formik.errors.participants}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Actualizar Concierto
      </Form.Button>
    </Form>
  )
}
