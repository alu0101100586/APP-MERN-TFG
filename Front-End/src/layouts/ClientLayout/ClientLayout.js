import React from 'react'

export function ClientLayout(props) {
  const { children } = props
  return (
    <div>
      <h2>ClientLayout en uso</h2>
      {children}
    </div>
  )
}
