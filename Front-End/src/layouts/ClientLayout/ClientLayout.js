import React from 'react'
import { Container } from 'semantic-ui-react'
import { HeaderBar, Footer } from '../../components/Web'
import './ClientLayout.scss'

export function ClientLayout(props) {
  const { children } = props
  return (
    <div className="client-layout">
      <div className="client-layout__header">
        <HeaderBar />
      </div>

      <div className="client-layout__content">{children}</div>

      <div className="client-layout__footer">
        <Container>
          <Footer.Info />
          <Footer.WebMap />
          <Footer.Newsletter />
        </Container>
        <Container>
          <span>TRABAJO FIN DE GRADO</span>
          <span>Grado en Ingeniería Informática</span>
          <span>Jonay Estévez Díaz</span>
        </Container>
      </div>
    </div>
  )
}
