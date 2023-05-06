import * as Yup from 'yup'

export function initialValues() {
  return {
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  }
}

export function validationSchema() {
  return Yup.object({
    currentPassword: Yup.string().required('Contraseña Actual requerida'),

    newPassword: Yup.string()
      .required('Nueva Contraseña requerida')
      .oneOf([Yup.ref('repeatNewPassword')], 'Las contraseñas no coinciden'),

    repeatNewPassword: Yup.string()
      .required('Repetir la nueva Contraseña')
      .oneOf([Yup.ref('newPassword')], 'Las contraseñas no coinciden'),
  })
}
