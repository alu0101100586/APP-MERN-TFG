import * as yup from 'yup'

export function initialValues() {
  return {
    searchTerm: '',
    filter: '',
  }
}

export function validationSchema() {
  return yup.object({
    searchTerm: yup.string().required('Ingrese un término de búsqueda'),
    filter: yup.string().required('Seleccione un filtro'),
  })
}