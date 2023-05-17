import * as Yup from 'yup'

export function initialValues(artist) {
  const artistStartDate = artist?.startDate
    ? new Date(artist.startDate).toISOString()
    : ''

  return {
    name: artist?.name || '',
    startDate: artistStartDate,
    avatar: artist?.avatar || '',
    fileAvatar: null,
  }
}

export function validationSchema(artist) {
  return Yup.object({
    name: Yup.string().required(true),
    startDate: artist ? Yup.date() : Yup.date().required(true),
  })
}
