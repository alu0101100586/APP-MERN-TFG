import * as yup from 'yup';

export function initialValues(artist) {
  return {
    avatar: artist?.avatar || '',
    fileAvatar: null,
    name: artist?.name || '',
    startDate: artist?.startDate ? new Date(artist.startDate) : null,
  }
}

export function validationSchema(artist) {
  return yup.object({
    name: yup.string().required(true),
    startDate: yup.date().required(true),
  })
}