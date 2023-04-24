import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Form } from 'semantic-ui-react';
import { useFormik } from 'formik';
import { initialValues, validationSchema } from './registerForm.form';
import { Auth } from '../../../../service';
import 'react-datepicker/dist/react-datepicker.css';
import "./registerForm.scss";

const options = [
  { key: 'common', text: 'Común', value: 'common' },
  { key: 'artist', text: 'Artista/Grupo', value: 'artist'},
];

const authController = new Auth();

export function RegisterForm(props) {
  const { openLogin } = props;
  const [selectedOption, setSelectedOption] = React.useState('');
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState('');

  const formik = useFormik({
    validationSchema: validationSchema(),
    initialValues: initialValues(),
    onSubmit: async (formData) => {
      try {
        setError('');
        await authController.signUpApi(formData);
        openLogin();
      } catch (error) {
        setError('Error al registrar el usuario');
      }
    }, 
    validateOnChange: false,
  });


  const handleOptionChange = (event, { value }) => {
    setSelectedOption(value);
    formik.setFieldValue('role', value);
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    formik.setFieldValue('birthDate', date);
  };

  return (
    <Form className='register-form' onSubmit={formik.handleSubmit}>

      <Form.Input 
        name="email" 
        placeholder="Correo Electrónico" 
        onChange={formik.handleChange}
        value = {formik.values.email}
        error={formik.errors.email}
      />

      <Form.Input 
        name="nickName" 
        placeholder="Nombre de Usuario"
        onChange={formik.handleChange}
        value = {formik.values.nickName}
        error={formik.errors.nickName}
      />

      <Form.Input 
        name="firstName" 
        placeholder="Nombre"
        onChange={formik.handleChange}
        value = {formik.values.firstName}
        error={formik.errors.firstName}
      />

      <Form.Input 
        name="lastName" 
        placeholder=" Apellidos"
        onChange={formik.handleChange}
        value = {formik.values.lastName}
        error={formik.errors.lastName}
      />

      <Form.Select 
        name="role" 
        placeholder="Seleccina tu tipo de usuario"
        options={options}
        value={selectedOption}
        onChange={handleOptionChange}
        error={formik.errors.role}
      />

      <Form.Field>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          dateFormat={"dd/MM/yyyy"}
          placeholderText="Fecha de Nacimiento"
        />
        {formik.touched.birthDate && formik.errors.birthDate ? (
          <div className="register-form__error">{formik.errors.birthDate}</div>
        ) : null}
      </Form.Field>

      <Form.Input 
        type='password'
        name="password" 
        placeholder="Contraseña"
        onChange={formik.handleChange}
        value = {formik.values.password}
        error={formik.errors.password}
      />

      <Form.Input 
        name="repeatPassword" 
        type='password'
        placeholder="Repetir Contraseña"
        onChange={formik.handleChange}
        value = {formik.values.repeatPassword}
        error={formik.errors.repeatPassword}
      />

      <Form.Checkbox 
        name="conditionsAccepted" 
        label=" He leído y acepto las políticas de privacidad"
        onChange={(_, data) => 
          formik.setFieldValue("conditionsAccepted", data.checked)
        }
        checked={formik.values.conditionsAccepted}
        error={formik.errors.conditionsAccepted}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Registrarse
      </Form.Button>

      <p className='register-form__error'>{error}</p>
    </Form>
  )
}
