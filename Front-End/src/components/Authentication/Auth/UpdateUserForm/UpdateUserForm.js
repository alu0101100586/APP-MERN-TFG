import React, { useCallback } from 'react'
import { Form, Image } from 'semantic-ui-react'
import { useFormik } from 'formik'
import { useDropzone } from 'react-dropzone'
import { image } from '../../../../assets'
import { ENV } from '../../../../utils'
import { UserService } from '../../../../service'
import { initialValues, validationSchema } from './UpdateUserForm.form'
import { useAuth } from '../../../../hooks'
import './UpdateUserForm.scss'

const userService = new UserService()

export function UpdateUserForm(props) {
  const { close, onReload, user } = props
  const { accessToken } = useAuth()

  const formik = useFormik({
    initialValues: initialValues(user),
    validationSchema: validationSchema(user),
    onSubmit: async (formData) => {
      try {
        console.log(formData)
        // await userService.updateMeApi(accessToken, formData)
        onReload()
        close()
      } catch (error) {
        console.log(error)
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
    accept: 'image/jpeg, image/jpg, image/png',
    onDrop,
  })

  const getAvatar = () => {
    if (formik.values.fileAvatar) {
      return formik.values.avatar
    } else if (formik.values.avatar) {
      return `${ENV.BASE_PATH}/${formik.values.avatar}`
    }
    return image.Default_Avatar
  }

  return (
    <Form className="update-user-form" onSubmit={formik.handleSubmit}>
      <div className="update-user-form__avatar" {...getRootProps()}>
        <input {...getInputProps()} />
        <span className="title"> Avatar: </span>
        <Image avatar size="small" src={getAvatar()} />
      </div>

      <Form.Group widths="equal">
        <Form.Input
          name="firstName"
          placeholder="Nombre"
          onChange={formik.handleChange}
          value={formik.values.firstName}
          error={formik.errors.firstName}
        />
        <Form.Input
          name="lastName"
          placeholder="Apellidos"
          onChange={formik.handleChange}
          value={formik.values.lastName}
          error={formik.errors.lastName}
        />
      </Form.Group>

      <Form.Input
        name="nickName"
        placeholder="Nombre Usuario"
        onChange={formik.handleChange}
        value={formik.values.nickName}
        error={formik.errors.nickName}
      />

      <Form.Input
        name="email"
        placeholder="Correo Electrónico"
        onChange={formik.handleChange}
        value={formik.values.email}
        error={formik.errors.email}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Actualizar
      </Form.Button>
    </Form>
  )
}
