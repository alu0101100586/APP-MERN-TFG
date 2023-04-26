import React from 'react'
import { Icon } from '../../assets'
import { Logout } from '../../components/Authentication/Session';
import './LogInLayout.scss'

export function LogInLayout(props) {
  const { children } = props
  return (
    <div className="login-layout">
      <div className="login-layout__left">
        <Icon.LogoBlack className="logo" />
      </div>
      <div className="login-layout__content">
        <div className="login-layout__content__header">
          <Logout />
        </div>
        {children}
      </div>
      <div className="login-layout__right"></div>
    </div>
  )
}
