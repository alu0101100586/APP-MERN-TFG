import React, { useState } from 'react';
import { Tab } from 'semantic-ui-react'
import { Icon } from "../../../assets";
import { RegisterForm, LoginForm } from "../../../components/Admin/Auth";
import './authentication.scss';

export function Auth() {
  const [activeIndex, setActiveIndex] = useState(0);

  const openLogin = () => setActiveIndex(0);

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
      <Icon.LogoBlack className='logo'/>
      <Tab 
        panes={panes} 
        className= "auth__form" 
        activeIndex={ activeIndex } 
        onTabChange={(_, data) => setActiveIndex(data.activeIndex)} 
      />
    </div>
  )
}
