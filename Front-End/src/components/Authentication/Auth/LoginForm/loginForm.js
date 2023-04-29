import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'
import { useFormik } from 'formik'
import { initialValues, validationSchema } from './loginForm.form'
import { useAuth } from '../../../../hooks'
import { Auth } from '../../../../service'
import './loginForm.scss'

const authController = new Auth()

export function LoginForm() {
  const { login } = useAuth()
  const [error, setError] = useState('')

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (formData) => {
      try {
        setError('')
        const response = await authController.signInApi(formData)
        authController.setAccessToken(response.accessToken)
        authController.setRefreshToken(response.refreshToken)
        login(response.accessToken)
      } catch (error) {
        setError('Contraseña o correo inválidos')
      }
    },
    validateOnChange: false,
  })

  return (
    <Form className="login-form" onSubmit={formik.handleSubmit}>
      <Form.Input
        name="email"
        placeholder="Correo Electrónico"
        onChange={formik.handleChange}
        value={formik.values.email}
        error={formik.errors.email}
      />

      <Form.Input
        type="password"
        name="password"
        placeholder="Contraseña"
        onChange={formik.handleChange}
        value={formik.values.password}
        error={formik.errors.password}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Iniciar sesión
      </Form.Button>

      <p className="login-form__error">{error}</p>
    </Form>
  )
}
