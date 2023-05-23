import React, { useState, useEffect } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { UserService, NewslettersService } from '../../../service';
import './newsletters.scss';
import { set } from 'lodash';

const userService = new UserService();
const newslettersService = new NewslettersService();

export function Newsletters() {
  const { accessToken } = useAuth();
  const [ email, setEmail ] = useState('');
  const [ suscribed, setSuscribed ] = useState('');
  const [ unsuscribed, setUnsuscribed ] = useState('');

  useEffect(() => {
    (async () => {
      const response = await userService.getMeApi(accessToken);
      setEmail(response.email);
    })();
  }, [accessToken]);

  const handleSuscribe = async () => {
    const response = await newslettersService.newSubscriptionApi(accessToken, email);
    setUnsuscribed('');
    setSuscribed(response.msg);
  }

  const handleUnsuscribe = async () => {
    const response = await newslettersService.cancelSubscriptionApi(accessToken, email);
    setSuscribed('');
    setUnsuscribed(response.msg);
  }
  
  return (
    <div className='newsletters-page'>
      <h1>¿En que consiste las Newsletter?</h1>
      <p>
        Una newsletters es un boletín informativo digital que se distribuye a 
        través del correo electronico que has usado para registrarte en esta 
        aplicación y dicho boletín se envia mensualmente a todos los usuarios
        que estén suscritos a nuestras newsletters.
      </p>

      <h1>¿Que encontraras en nuestras newsletters?</h1>
      <p>
        En nuestras newsletters encontraras información sobre los artistas que 
        se hayan registrado el mes anterior, así como las novedades que se han
        añadido a la aplicación, como por ejemplo, los nuevos discos que se han
        añadido, así como los nuevos conciertos y merchandising que se hayan 
        agregado. Por otro lado, también encontraras información sobre los
        cambios que se hayan realizado en la aplicación, como por ejemplo,
        cambios en la interfaz de usuario, cambios en la forma de pago, nuevas
        funcionalidades, etc.
      </p>

      <h1>¿Como suscribirte a nuestras newsletters?</h1>
      <p>
        Para suscribirte a nuestras newsletters y disfrutar de todas las ventajas
        que te ofrece, solo debes hacer click en el botón de "Suscribirse".
      </p>
      <Button icon primary onClick={handleSuscribe}>
        <Icon name='mail' />
        Suscribirse
      </Button>
      <p>{suscribed}</p>

      <h1>¿Como cancelar tu suscripcion a nuestras newsletters?</h1>
      <p>
        Para cancelar tu suscripción a nuestras newsletters, solo debes hacer
        click en el botón de "Cancelar suscripción". Ten en cuenta que si cancelas 
        tu suscripción no recibirás más newsletters a menos que vuelvas a suscribirte.
      </p>
      <Button icon secondary onClick={handleUnsuscribe}>
        <Icon name='window close outline' />
        Cancelar suscripción
      </Button>
      <p>{unsuscribed}</p>

      <h1>¿Como eliminar tu cuenta?</h1>
      <p>
        Para eliminar tu cuenta, solo debes hacer click en el botón de "Eliminar
        cuenta" que encontrarás en la parte inferior del menú de tu perfil. Ten
        en cuenta que si eliminas tu cuenta, no podrás volver a acceder a ella
        a menos que vuelvas a registrarte y que si eliminas tu cuenta, no
        recuperarás los datos que estén asociados a ella.
      </p>
      <Button as={Link} to='/auth'>
        <Icon name='long arrow alternate left' />
        Volver a la página de Usuario
      </Button>
    </div>
  )
}
