import * as Yup from 'yup'

export function initialValues() {
  return {
    name: '',
    date: '',
    location: '',
    moneyLimit: '',
    price: '',
    raisedMoney: '',
    concertPoster: '',
    fileConcertPoster: null,
    musicalGenre: [],
    participants: '',
  }
}

export function validationSchema() {
  return Yup.object({
    name: Yup.string().required(true),
    date: Yup.date().required(true),
    location: Yup.string().required(true),
    moneyLimit: Yup.number().required(true),
    price: Yup.number().required(true),
    raisedMoney: Yup.number().required(true),
    musicalGenre: Yup.array().of(Yup.string()).required(true),
    participants: Yup.string().required(true),
  })
}
