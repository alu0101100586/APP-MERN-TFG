import * as Yup from 'yup'

export function initialValues() {
  return {
    email: '',
    password: '',
  }
}

export function validationSchema() {
  return Yup.object({
    email: Yup.string().email('Email no válido').required('Email requerido'),

    password: Yup.string().required('Contraseña requerida'),
  })
}
