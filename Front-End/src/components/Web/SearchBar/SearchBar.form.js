import * as yup from 'yup'

export function initialValues() {
  return {
    searchTerm: '',
    filter: '',
  }
}

export function validationSchema() {
  return yup.object({
    filter: yup.string().required('Seleccione un filtro'),
  })
}