import { ENV } from '../utils';

export class Auth {
  api = ENV.API_PATH;

  async signInApi(formData) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.AUTH.SING_IN}`;
      const params = {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(url, params);
      const result = await response.json();

      if(response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async signUpApi(formData) {
    try {
      const url = `${this.api}${ENV.API_ROUTES.AUTH.SING_UP}`;
      const params = {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          nickName: formData.nickName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate.toISOString().slice(0, 10),
          password: formData.password,
          role: formData.role,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(url, params);
      const result = await response.json();
      console.log(response);

      if(response.status !== 200) throw result;
    
      return result;
    } catch (error) {
      throw error;
    }
  }
}