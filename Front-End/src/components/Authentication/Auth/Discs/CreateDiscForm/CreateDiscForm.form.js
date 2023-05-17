import * as Yup from 'yup'

export function initialValues() {
  return {
    name: '',
    releaseDate: '',
    moneyLimit: '',
    price: '',
    raisedMoney: '',
    cover: '',
    fileCover: null,
    musicalGenre: [],
    songs: '',
  }
}

export function validationSchema() {
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
