import * as Yup from 'yup';

export function initialValues(user) {
  return {
    avatar: user?.avatar || '',
    fileAvatar: null,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    nickName: user?.nickName || '',
    email: user?.email || '',
  };
}

export function validationSchema(user) {
  return Yup.object({
    firstName: Yup.string().required(true),
    lastName: Yup.string().required(true),
    nickName: Yup.string().required(true),
    email: Yup.string().email(true).required(true),
  });
}
