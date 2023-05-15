import * as Yup from 'yup';

export function initialValues(disc) {
  const discReleaseDate = disc?.releaseDate ? new Date(disc.releaseDate).toISOString() : ''
  const discSongs = disc?.songs ? disc.songs.join(', ') : ''

  return {
    item: '',
    name: disc?.name || '',
    releaseDate: discReleaseDate,
    moneyLimit: disc?.moneyLimit || '',
    price: disc?.price || '',
    raisedMoney: disc?.raisedMoney || '',
    cover: disc?.cover || '',
    fileCover: null,
    musicalGenre: disc?.musicalGenre || [],
    songs: discSongs,
  }
}

export function validationSchema(disc) {
  return Yup.object({
    name: Yup.string().required(true),
    releaseDate: Yup.date().required(true),
    moneyLimit: Yup.number().required(true),
    price: Yup.number().required(true),
    raisedMoney: Yup.number().required(true),
    musicalGenre: Yup.array().of(Yup.string()).required(true),
    songs: Yup.string().required(true),
  })
}