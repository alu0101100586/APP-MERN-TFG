import React, { useState } from 'react'
import { CommonMenu } from '../../../components/Authentication/Menu'
import { UserContect } from '../../../components/Authentication/Auth'
import { useAuth } from '../../../hooks'
import './userCommon.scss'

export function UserCommon() {
  const { user } = useAuth()
  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  return (
    <div className="user-common">
      <div className="user-common__menu">
        <CommonMenu onReload={onReload} reload={reload} user={user} />
      </div>
      <div className="user-common__content">
        <UserContect reload={reload} user={user} />
      </div>
    </div>
  )
}
