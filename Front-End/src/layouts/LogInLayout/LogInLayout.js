import React from 'react';
import { Icon } from '../../assets'
import { AuthMenu } from '../../components/Authentication/LogInLayout';
import './LogInLayout.scss';

export function LogInLayout(props) {
  const { children } = props;
  return (
    <div className='auth-layout'>
      <div className='auth-layout__left'>
        <Icon.LogoBlack className='logo'/>
        <AuthMenu />
      </div>

      <div className='auth-layout__right'>
        <div className='auth-layout__right-body'>
          <span>LOGOUT</span>
        </div>
        <div className='auth-layout__right-content'>
          {children}
        </div>
      </div>
    </div>
  )
};
