import * as Yup from "yup";

export function initialValues() {
  return {
    email: "",
    nickName: "",
    firstName: "",
    lastName: "",
    role: "",
    birthDate: "",
    password: "",
    repeatPassword: "",
    conditionsAccepted: false,
  };
}

export function validationSchema() {
  return Yup.object({
    email: Yup.string()
      .email("Email no válido")
      .required("Email requerido"),

    nickName: Yup.string()
      .required("Nombre de usuario requerido"),

    firstName: Yup.string()
      .required("Nombre requerido"),

    lastName: Yup.string()
      .required("Apellidos requeridos"),

    role: Yup.string()
      .required("Rol requerido"),

    birthDate: Yup.date()
      .required("Fecha de nacimiento requerida"),

    password: Yup.string()
      .required("Contraseña requerida")
      .oneOf([Yup.ref("repeatPassword")], "Las contraseñas no coinciden"),

    repeatPassword: Yup.string()
      .required("Repetir contraseña requerida")
      .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),

    conditionsAccepted: Yup.boolean()
      .oneOf([true], "Debes aceptar las condiciones")
      .required("Debes aceptar las condiciones"),
  });
}