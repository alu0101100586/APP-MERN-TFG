import React, { useCallback, useState, useEffect } from 'react'
import { Form, Image } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import { useDropzone } from 'react-dropzone'
import { useFormik } from 'formik'
import { map } from 'lodash'
import { initialValues, validationSchema } from './UpdateMerchandiseForm.form'
import { ENV } from '../../../../../utils'
import { useAuth } from '../../../../../hooks'
import { MerchandiseService } from '../../../../../service'
import './UpdateMerchandiseForm.scss'

const merchService = new MerchandiseService()

export function UpdateMerchandiseForm(props) {
  const { close, onReload } = props
  const { accessToken } = useAuth()
  const [releaseDate, setReleaseDate] = useState('')
  const [merchandises, setMerchandises] = useState(null)
  const [item, setItem] = useState('')

  const formik = useFormik({
    initialValues: initialValues(item),
    validationSchema: validationSchema(item),
    onSubmit: async (formData) => {
      try {
        await merchService.updateMerchandiseApi(
          accessToken,
          formData,
          formData.item
        )
        onReload()
        close()
      } catch (error) {
        console.log(error)
      }
    },
    validateOnChange: false,
  })

  useEffect(() => {
    ;(async () => {
      console.log(formik.values.size)
      try {
        const response = await merchService.getMerchandiseUserApi(
          accessToken,
          1,
          1000
        )
        setMerchandises(response.docs)
      } catch (error) {
        throw error
      }
    })()
  }, [formik.values.size])

  const itemOptions = map(merchandises, (merchandise) => ({
    key: merchandise._id,
    text: merchandise.name,
    value: merchandise._id,
  }))

  const handleItemOptionChange = (event, { value }) => {
    setItem(value)
    formik.setFieldValue('item', value)

    const merchandise = merchandises.find(
      (merchandise) => merchandise._id === value
    )
    const merchReleaseDate = merchandise?.releaseDate
      ? new Date(merchandise.releaseDate).toISOString()
      : ''

    formik.setFieldValue('name', merchandise.name)
    formik.setFieldValue('releaseDate', merchReleaseDate)
    formik.setFieldValue('moneyLimit', merchandise.moneyLimit)
    formik.setFieldValue('price', merchandise.price)
    formik.setFieldValue('raisedMoney', merchandise.raisedMoney)
    formik.setFieldValue('image', merchandise.image)
    formik.setFieldValue('size', merchandise.size)
    formik.setFieldValue('description', merchandise.description)
  }

  const handleDateChange = (date) => {
    setReleaseDate(date)
    formik.setFieldValue('releaseDate', date)
  }

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    formik.setFieldValue('image', URL.createObjectURL(file))
    formik.setFieldValue('fileImage', file)
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop,
  })

  const getImage = () => {
    if (formik.values.fileImage) {
      return formik.values.image
    } else if (formik.values.image) {
      return `${ENV.BASE_PATH}/${formik.values.image}`
    }
    return null
  }

  const sizes = [
    { key: 'XS', text: 'XS', value: 'XS' },
    { key: 'S', text: 'S', value: 'S' },
    { key: 'M', text: 'M', value: 'M' },
    { key: 'L', text: 'L', value: 'L' },
    { key: 'XL', text: 'XL', value: 'XL' },
  ]

  const handleSizeSelected = (event, data) => {
    const selectedSize = data.value
    formik.setFieldValue('size', selectedSize)
  }

  const options = sizes.map((size) => {
    return { key: size.key, text: size.text, value: size.value }
  })

  return (
    <Form className="update-merch-form" onSubmit={formik.handleSubmit}>
      <Form.Select
        label="Merchandise"
        name="item"
        placeholder="Selecciona un merchandise"
        options={itemOptions}
        onChange={handleItemOptionChange}
        value={item}
        error={formik.errors.item}
      />

      <div className="update-merch-form__avatar" {...getRootProps()}>
        <input {...getInputProps()} />
        <span className="title"> Foto Merchandise: </span>
        <Image size="small" src={getImage()} />
        {formik.errors.image && formik.touched.image ? (
          <div className="update-merch-form__error">{formik.errors.image}</div>
        ) : null}
      </div>

      <Form.Input
        name="name"
        placeholder="Nombre del Merchandise"
        onChange={formik.handleChange}
        value={formik.values.name}
        error={formik.errors.name}
      />

      <Form.Field>
        <DatePicker
          selected={
            formik.values.releaseDate
              ? new Date(formik.values.releaseDate)
              : releaseDate
          }
          onChange={handleDateChange}
          dateFormat={'dd/MM/yyyy'}
          placeholderText="Fecha Salida Estimada"
        />
        {formik.touched.releaseDate && formik.errors.releaseDate ? (
          <div className="update-merch-form__error">Ingresa una fecha</div>
        ) : null}
      </Form.Field>

      <Form.Group widths="three">
        <Form.Input
          name="moneyLimit"
          placeholder="Meta de Dinero"
          onChange={formik.handleChange}
          value={formik.values.moneyLimit}
          error={formik.errors.moneyLimit}
        />

        <Form.Input
          name="price"
          placeholder="Precio de venta"
          onChange={formik.handleChange}
          value={formik.values.price}
          error={formik.errors.price}
        />

        <Form.Input
          name="raisedMoney"
          placeholder="Dinero Recaudado"
          onChange={formik.handleChange}
          value={formik.values.raisedMoney}
          error={formik.errors.raisedMoney}
        />
      </Form.Group>

      <Form.Dropdown
        name="size"
        placeholder="Seleccione las tallas disponibles"
        fluid
        multiple
        search
        selection
        options={options}
        onChange={handleSizeSelected}
        value={formik.values.size}
        error={formik.touched.size && formik.errors.size}
      />

      <Form.TextArea
        label="Descripción del Merchandise"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && formik.errors.description}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Actualizar Merchandise
      </Form.Button>
    </Form>
  )
}
