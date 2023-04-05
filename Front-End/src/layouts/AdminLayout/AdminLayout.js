import React from 'react'

export function AdminLayout(props) {
  const { children } = props;
  return (
    <div>
      <h2>Admin Layout en uso</h2>
      {children}
    </div>
  )
}
