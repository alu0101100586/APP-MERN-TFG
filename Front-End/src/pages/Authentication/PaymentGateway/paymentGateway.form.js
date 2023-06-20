import * as yup from 'yup'

export function initialValues() {
  return {
    number: '',
    name: '',
    date: '',
    cvv: '',
  }
}

export function validationSchema() {
  return yup.object({
    number: yup.number().required('Número de tarjeta requerido'),
    name: yup.string().required('Nombre requerido'),
    date: yup.string().required('Fecha requerida'),
    cvv: yup.number().required('CVV requerido'),
  })
}
