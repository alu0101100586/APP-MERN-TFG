import * as yup from 'yup'

export function initialValues() {
  return {
    name: '',
    startDate: '',
    avatar: '',
    fileAvatar: null,
  }
}

export function validationSchema() {
  return yup.object({
    name: yup.string().required(true),
    startDate: yup.date().required(true),
  })
}
