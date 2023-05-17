import React, { useState, useCallback } from 'react'
import { Form, Image } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import { useFormik } from 'formik'
import { useDropzone } from 'react-dropzone'
import { ENV } from '../../../../../utils'
import { initialValues, validationSchema } from './UpdateArtistForm.form'
import { ArtistService } from '../../../../../service'
import { useAuth } from '../../../../../hooks'
import './UpdateArtistForm.scss'

const artistService = new ArtistService()

export function UpdateArtistForm(props) {
  const { close, onReload, artist } = props
  const [startDate, setStartDate] = useState('')
  const { accessToken } = useAuth()

  const handleDateChange = (date) => {
    setStartDate(date)
    formik.setFieldValue('startDate', date)
  }

  const formik = useFormik({
    initialValues: initialValues(artist),
    validationSchema: validationSchema(artist),
    onSubmit: async (formData) => {
      try {
        await artistService.updateArtistApi(accessToken, formData)
        onReload()
        close()
      } catch (error) {
        console.error(error)
      }
    },
    validateOnChange: false,
  })

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    formik.setFieldValue('avatar', URL.createObjectURL(file))
    formik.setFieldValue('fileAvatar', file)
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop,
  })

  const getAvatar = () => {
    if (formik.values.fileAvatar) {
      return formik.values.avatar
    } else if (formik.values.avatar) {
      return `${ENV.BASE_PATH}/${formik.values.avatar}`
    }
    return null
  }

  return (
    <Form className="update-artist-form" onSubmit={formik.handleSubmit}>
      <div className="update-artist-form__avatar" {...getRootProps()}>
        <input {...getInputProps()} />
        <span className="title"> Avatar: </span>
        <Image avatar size="small" src={getAvatar()} />
      </div>

      <Form.Input
        name="name"
        placeholder="Nombre Artista"
        onChange={formik.handleChange}
        value={formik.values.name}
        error={formik.errors.name}
      />

      <Form.Field>
        <DatePicker
          selected={
            formik.values.startDate
              ? new Date(formik.values.startDate)
              : startDate
          }
          onChange={handleDateChange}
          dateFormat={'dd/MM/yyyy'}
          placeholderText="Fecha de Inicio"
        />
        {formik.touched.startDate && formik.errors.startDate ? (
          <div className="update-artist-form__error">Ingresa una fecha</div>
        ) : null}
      </Form.Field>

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Actualizar Artista
      </Form.Button>
    </Form>
  )
}
