import React, { useState } from 'react';
import { Button, Tab, Icon } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { WebIcon } from '../../../assets';
import {
  RegisterForm,
  LoginForm,
} from '../../../components/Authentication/Auth';
import './authentication.scss';

export function Auth() {
  const [activeIndex, setActiveIndex] = useState(0)
  const openLogin = () => setActiveIndex(0)
  const navigate = useNavigate();

  const panes = [
    {
      menuItem: 'Iniciar sesión',
      render: () => (
        <Tab.Pane>
          <LoginForm openLogin={openLogin} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Registrarse',
      render: () => (
        <Tab.Pane>
          <RegisterForm openLogin={openLogin} />
        </Tab.Pane>
      ),
    },
  ]

  return (
    <div className="auth">
      <div className="auth__header">
        <Button
          icon
          color='black'
          onClick={() => navigate('/')}
        >
          <Icon name="arrow left" />
        </Button>
      </div>
      <div className="auth__content">
        <WebIcon.LogoBlack className="logo" />
        <Tab
          panes={panes}
          className="auth__content__form"
          activeIndex={activeIndex}
          onTabChange={(_, data) => setActiveIndex(data.activeIndex)}
        />
      </div>
    </div>
  )
}
