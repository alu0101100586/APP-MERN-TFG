import React, { useCallback, useState, useEffect } from 'react';
import { Form, Image } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import { initialValues, validationSchema } from './CreateMerchandiseForm.form';
import { ENV } from '../../../../../utils';
import { useAuth } from '../../../../../hooks';
import { MerchandiseService } from '../../../../../service';
import './CreateMerchandiseForm.scss';

const merhService = new MerchandiseService();

export function CreateMerchandiseForm(props) {
  const { close, onReload } = props;
  const [ releaseDate, setReleaseDate ] = useState('');
  const [ error, setError ] = useState('');
  const { accessToken } = useAuth();

  const handleDateChange = (date) => {
    setReleaseDate(date);
    formik.setFieldValue('releaseDate', date);
  }

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (formData) => {
      try {
        setError('');
        await merhService.createMerchandiseApi(accessToken, formData)
        onReload()
        close()
      } catch (error) {
        setError('Error al crear el merchandise, revise los datos ingresados')
      }
    },
    validateOnChange: false,
  })

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    formik.setFieldValue('image', URL.createObjectURL(file));
    formik.setFieldValue('fileImage', file);
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
    return null;
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

  useEffect(() => {
    console.log(formik.values.size)
  }, [formik.values.size])

  return (
    <Form className='create-merch-form' onSubmit={formik.handleSubmit}>
      <div className='create-merch-form__avatar' {...getRootProps()}>
        <input {...getInputProps()} />
        <span className='title'> Foto Merchandise: </span>
        <Image size='small' src={getImage()} />
        {formik.errors.image && formik.touched.image ? (
        <div className="create-merch-form__error">{formik.errors.image}</div>
      ) : null}
      </div>

      <Form.Input
        name='name'
        placeholder='Nombre del Merchandise'
        onChange={formik.handleChange}
        value={formik.values.name}
        error={formik.errors.name}
      />

      <Form.Field>
        <DatePicker
          selected={releaseDate}
          onChange={handleDateChange}
          dateFormat={'dd/MM/yyyy'}
          placeholderText="Fecha Salida Estimada"
        />
        {formik.touched.releaseDate && formik.errors.releaseDate ? (
          <div className="create-disc-form__error">Ingresa una fecha</div>
        ) : null}
      </Form.Field>

      <Form.Group widths='three'>
        <Form.Input 
          name='moneyLimit'
          placeholder='Meta de Dinero'
          onChange={formik.handleChange}
          value={formik.values.moneyLimit}
          error={formik.errors.moneyLimit}
        />

        <Form.Input 
          name='price'
          placeholder='Precio de venta'
          onChange={formik.handleChange}
          value={formik.values.price}
          error={formik.errors.price}
        />

        <Form.Input 
          name='raisedMoney'
          placeholder='Dinero Recaudado'
          onChange={formik.handleChange}
          value={formik.values.raisedMoney}
          error={formik.errors.raisedMoney}
        />
      </Form.Group>

      <Form.Dropdown
        name='size'
        placeholder='Seleccione las tallas disponibles'
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
        label='Descripción del Merchandise'
        name='description'
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && formik.errors.description}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Crear Merchandise
      </Form.Button>

    </Form>
  )
}
