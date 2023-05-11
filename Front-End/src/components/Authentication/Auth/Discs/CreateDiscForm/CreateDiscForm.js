import React, { useCallback, useState, useEffect } from 'react';
import { Form, Image } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import { initialValues, validationSchema } from './CreateDiscForm.form';
import { ENV } from '../../../../../utils';
import { useAuth } from '../../../../../hooks';
import { DiscService } from '../../../../../service';
import './CreateDiscForm.scss';

const discService = new DiscService();

export function CreateDiscForm(props) {
  const { close, onReload } = props;
  const [ releaseDate, setReleaseDate ] = useState('');
  const [ error, setError ] = useState('');
  const { accessToken } = useAuth();

  const handleDateChange = (date) => {
    setReleaseDate(date);
    formik.setFieldValue('releaseDate', date);
  }

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (formData) => {
      try {
        setError('');
        formData.songs = formData.songs.split(',');
        await discService.createDiscApi(accessToken, formData)
        onReload()
        close()
      } catch (error) {
        setError('Error al crear el disco, revise los datos ingresados')
      }
    },
    validateOnChange: false,
  })

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    formik.setFieldValue('cover', URL.createObjectURL(file));
    formik.setFieldValue('fileCover', file);
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop,
  })

  const getCover = () => {
    if (formik.values.fileCover) {
      return formik.values.cover
    } else if (formik.values.cover) {
      return `${ENV.BASE_PATH}/${formik.values.cover}`
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
    const selectedGenres = data.value;
    formik.setFieldValue('musicalGenre', selectedGenres);
  };
  
  const options = musicGenre.map(genre => {
    return { key: genre.key, text: genre.text, value: genre.value }
  })

  useEffect(() => {
    console.log(formik.values.musicalGenre)
  }, [formik.values.musicalGenre])

  return (
    <Form className='create-disc-form' onSubmit={formik.handleSubmit}>

      <div className='create-disc-form__avatar' {...getRootProps()}>
        <input {...getInputProps()} />
        <span className='title'> Portada: </span>
        <Image size='small' src={getCover()} />
        {formik.errors.cover && formik.touched.cover ? (
        <div className="create-disc-form__error">{formik.errors.cover}</div>
      ) : null}
      </div>

      <Form.Input
        name='name'
        placeholder='Nombre del Disco'
        onChange={formik.handleChange}
        value={formik.values.name}
        error={formik.errors.name}
      />

      <Form.Field>
        <DatePicker
          selected={releaseDate}
          onChange={handleDateChange}
          dateFormat={'dd/MM/yyyy'}
          placeholderText="Fecha Salida Estimada"
        />
        {formik.touched.releaseDate && formik.errors.releaseDate ? (
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
        label='Separe las canciones con comas (,)'
        name='songs'
        placeholder='Canciones'
        value={formik.values.songs}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.songs && formik.errors.songs}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Crear Disco
      </Form.Button>

      <p className="create-disc-form__error">{error}</p>
    </Form>
  )
}
