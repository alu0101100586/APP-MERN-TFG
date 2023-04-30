import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { useFormik } from 'formik';
import { useAuth } from '../../../../hooks';
import { Auth } from '../../../../service';
import { initialValues, validationSchema } from './PasswordForm.form';
import './PasswordForm.scss';

const authController = new Auth();

export function PasswordForm(props) {
  const { close } = props;
  const { accessToken } = useAuth();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
     onSubmit: async (formData) => {
      try {
        setError('');
        await authController.changePasswordApi(accessToken, formData);
        close();
      } catch (error) {
        setError('Comprueba los datos ingresados');
      }
    },
    validateOnChange: false,
  });

  return (
    <Form className='password-form' onSubmit={formik.handleSubmit}>
      <Form.Input
        name='currentPassword'
        type='password'
        placeholder='Contraseña actual'
        onChange={formik.handleChange}
        value={formik.values.currentPassword}
        error={formik.errors.currentPassword}
      />

      <Form.Input
        name='newPassword'
        type='password'
        placeholder='Nueva contraseña'
        onChange={formik.handleChange}
        value={formik.values.newPassword}
        error={formik.errors.newPassword}
      />

      <Form.Input
        name='repeatNewPassword'
        type='password'
        placeholder='Repetir nueva contraseña'
        onChange={formik.handleChange}
        value={formik.values.repeatNewPassword}
        error={formik.errors.repeatNewPassword}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Actualizar Contraseña
      </Form.Button>

      <p className="password-form__error">{error}</p>
    </Form>
  )
}
