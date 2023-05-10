import React, { useState, useCallback } from 'react';
import { Form, Image } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import { initialValues, validationSchema } from './CreateArtistForm.form';
import { ArtistService } from '../../../../../service';
import { ENV } from '../../../../../utils';
import { useAuth } from '../../../../../hooks';
import './CreateArtistForm.scss';

const artistService = new ArtistService();

export function CreateArtistForm(props) {
  const { close, onReload } = props;
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState('');
  const { accessToken } = useAuth();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (formData) => {
      try {
        setError('')
        await artistService.createArtistApi(accessToken, formData)
        onReload();
        close();
      } catch (error) {
        setError('Error en el registro, revise si ha subido un avatar a su artista')
      }
    },
    validateOnChange: false,
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    formik.setFieldValue('avatar', URL.createObjectURL(file))
    formik.setFieldValue('fileAvatar', file)
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/jpg, image/png',
    onDrop,
  })

  const getAvatar = () => {
    if (formik.values.fileAvatar) {
      return formik.values.avatar
    } else if (formik.values.avatar) {
      return `${ENV.BASE_PATH}/${formik.values.avatar}`
    }
    return null;
  }

  const handleDateChange = (date) => {
    setStartDate(date)
    formik.setFieldValue('startDate', date)
  }

  return (
    <Form className="create-artist-form" onSubmit={formik.handleSubmit}>

      <div className="create-artist-form__avatar" {...getRootProps()}>
        <input {...getInputProps()} />
        <span className="title"> Avatar Artista: </span>
        <Image avatar size="small" src={getAvatar()} />
      </div>
      {formik.errors.avatar && formik.touched.avatar ? (
        <div className="create-artist-form__error">{formik.errors.avatar}</div>
      ) : null}

      <Form.Input
        name="name"
        placeholder="Nombre de Artista"
        onChange={formik.handleChange}
        value={formik.values.name}
        error={formik.errors.name}
      />

      <Form.Field>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          dateFormat={'dd/MM/yyyy'}
          placeholderText="Fecha de Inicio"
        />
        {formik.touched.startDate && formik.errors.startDate ? (
          <div className="create-artist-form__error">Ingresa una fecha</div>
        ) : null}
      </Form.Field>

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Crear tu artista
      </Form.Button>

      <p className="create-artist-form__error">{error}</p>
    </Form>
  )
}
