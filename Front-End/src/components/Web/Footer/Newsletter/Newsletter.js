import React from 'react'
import './Newsletter.scss'
import { Link } from 'react-router-dom'

export function Newsletter() {
  return (
    <div className="footer-newsletter">
      <Link to="/auth/newsletters">
        <h4>Newsletter</h4>
      </Link>
    </div>
  )
}
