import React from 'react'
import { Link } from 'react-router-dom'
import { WebIcon } from '../../assets'
import { Logout } from '../../components/Authentication/Session'
import './LogInLayout.scss'

export function LogInLayout(props) {
  const { children } = props

  return (
    <div className="login-layout">
      <div className="login-layout__left">
        <Link to="/">
          <WebIcon.LogoBlack className="logo" />
        </Link>
      </div>
      <div className="login-layout__content">
        <div className="login-layout__content__header">
          <Logout />
        </div>
        {children}
      </div>
      <div className="login-layout__right" />
    </div>
  )
}
