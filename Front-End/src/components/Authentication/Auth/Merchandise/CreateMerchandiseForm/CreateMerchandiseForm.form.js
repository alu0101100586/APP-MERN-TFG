import * as Yup from 'yup';

export function initialValues() {
  return {
    name: '',
    releaseDate: '',
    moneyLimit: '',
    price: '',
    raisedMoney: '',
    image: '',
    fileImage: null,
    size: [],
    description: '',
  }
}

export function validationSchema() {
  return Yup.object({
    name: Yup.string().required(true),
    releaseDate: Yup.date().required(true),
    moneyLimit: Yup.number().required(true),
    price: Yup.number().required(true),
    raisedMoney: Yup.number().required(true),
    size: Yup.array().of(Yup.string()).required(true),
    description: Yup.string().required(true),
  })
}