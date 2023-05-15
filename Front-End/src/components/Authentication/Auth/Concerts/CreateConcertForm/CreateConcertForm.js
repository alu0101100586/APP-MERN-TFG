import React, { useCallback, useState, useEffect } from 'react';
import { Form, Image } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import { initialValues, validationSchema } from './CreateConcertForm.form';
import { ENV } from '../../../../../utils';
import { useAuth } from '../../../../../hooks';
import { ConcertService } from '../../../../../service';
import './CreateConcertForm.scss';

const concertService = new ConcertService();;

export function CreateConcertForm(props) {
  const { close, onReload } = props;
  const [releaseDate, setReleaseDate] = useState('');
  const [error, setError] = useState('');
  const { accessToken } = useAuth();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (formData) => {
      try {
        setError('');
        formData.participants = formData.participants.split(',');
        await concertService.createConcertApi(accessToken, formData)
        onReload()
        close()
      } catch (error) {
        setError('Error al crear el concierto, revise los datos ingresados')
      }
    },
    validateOnChange: false,
  });

  const handleDateChange = (date) => {
    setReleaseDate(date);
    formik.setFieldValue('date', date);
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    formik.setFieldValue('concertPoster', URL.createObjectURL(file));
    formik.setFieldValue('fileConcertPoster', file);
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
    return null;
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
    const selected = data.value;
    formik.setFieldValue('musicalGenre', selected);
  }

  const options = musicGenre.map((genre) => {
    return { key: genre.key, text: genre.text, value: genre.value }
  })

  useEffect(() => {
    console.log(formik.values.musicalGenre)
  }, [formik.values.musicalGenre])

  return (
    <Form className='create-concert-form' onSubmit={formik.handleSubmit}>
      <div className='create-concert-form__avatar' {...getRootProps()}>
        <input {...getInputProps()} />
        <span className='title'> Cartel del concierto: </span>
        <Image size='small' src={getConcertPoster()} />
        {formik.errors.concertPoster && formik.touched.concertPoster ? (
          <div className="create-concert-form__error">{formik.errors.concertPoster}</div>
        ) : null}
      </div>

      <Form.Input
        name='name'
        placeholder='Nombre del concierto'
        onChange={formik.handleChange}
        value={formik.values.name}
        error={formik.errors.name}
      />

      <Form.Input
        name='location'
        placeholder='Lugar del concierto (Calle, número, ciudad, país)'
        onChange={formik.handleChange}
        value={formik.values.location}
        error={formik.errors.location}
      />

      <Form.Field>
        <DatePicker
          selected={releaseDate}
          onChange={handleDateChange}
          dateFormat={'dd/MM/yyyy'}
          placeholderText="Fecha Salida Estimada"
        />
        {formik.touched.date && formik.errors.date ? (
          <div className="create-disc-form__error">Ingresa una fecha</div>
        ) : null}
      </Form.Field>

      <Form.Group widths='three'>
        <Form.Input 
          name='moneyLimit'
          placeholder='Meta de Dinero'
          onChange={formik.handleChange}
          value={formik.values.moneyLimit}
          error={formik.errors.moneyLimit}
        />

        <Form.Input 
          name='price'
          placeholder='Precio de venta'
          onChange={formik.handleChange}
          value={formik.values.price}
          error={formik.errors.price}
        />

        <Form.Input 
          name='raisedMoney'
          placeholder='Dinero Recaudado'
          onChange={formik.handleChange}
          value={formik.values.raisedMoney}
          error={formik.errors.raisedMoney}
        />
      </Form.Group>

      <Form.Dropdown
        name='musicalGenre'
        placeholder='Seleccione los géneros musicales'
        fluid
        multiple
        search
        selection
        options={options}
        onChange={handleGenreSelected}
        value={formik.values.musicalGenre}
        error={formik.touched.musicalGenre && formik.errors.musicalGenre}
      />

      <Form.Input 
        label='Separe los participantes con comas (,)'
        name='participants'
        placeholder='Participantes'
        value={formik.values.participants}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.participants && formik.errors.participants}
      />

      <Form.Button type='submit' primary fluid loading={formik.isSubmitting}>
        Crear Concierto
      </Form.Button>

      <p className="create-concert-form__error">{error}</p>
    </Form>
  )
}
