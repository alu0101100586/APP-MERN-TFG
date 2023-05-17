import * as Yup from 'yup'

export function initialValues() {
  return {
    item: '',
  }
}

export function validationSchema() {
  return Yup.object({
    item: Yup.string().required('Item requerido'),
  })
}
