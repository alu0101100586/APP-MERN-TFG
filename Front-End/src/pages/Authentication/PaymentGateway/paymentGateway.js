import React, { useState, useEffect } from 'react'
import {
  Grid,
  Form,
  Input,
  Button,
  Icon,
  Modal,
  Header,
} from 'semantic-ui-react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import {
  DiscService,
  ConcertService,
  MerchandiseService,
} from '../../../service'
import { useAuth } from '../../../hooks'
import { BasicItem } from '../../../components/Authentication/Auth'
import { initialValues, validationSchema } from './paymentGateway.form'
import './paymentGateway.scss'

const discService = new DiscService()
const concertService = new ConcertService()
const merchandiseService = new MerchandiseService()

export function PaymentGateway() {
  const url = window.location.href
  const urlParts = url.split('/')
  const itemInfo = urlParts[urlParts.length - 1]
  const itemInfoParts = itemInfo.split('-')
  const itemType = itemInfoParts[0]
  const itemId = itemInfoParts[1]

  const { user, accessToken } = useAuth()
  const navigate = useNavigate()

  const [item, setItem] = useState({})
  const [paymentResponse, setPaymentResponse] = useState({})
  const [open, setOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (itemType === 'disc') {
        const discResponse = await discService.getDiscApi(itemId)
        setItem(discResponse)
      } else if (itemType === 'concert') {
        const concertResponse = await concertService.getConcertApi(itemId)
        setItem(concertResponse)
      } else if (itemType === 'merchandise') {
        const merchandiseResponse = await merchandiseService.getMerchandiseApi(
          itemId
        )
        setItem(merchandiseResponse)
      }
    })()
  }, [])

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (formData) => {
      if (itemType === 'disc') {
        const response = await discService.buyDiscApi(accessToken, itemId)
        setPaymentResponse(response)
      } else if (itemType === 'concert') {
        const response = await concertService.buyTicketApi(accessToken, itemId)
        setPaymentResponse(response)
      } else if (itemType === 'merchandise') {
        const response = await merchandiseService.buyMerchandiseApi(
          accessToken,
          itemId
        )
        setPaymentResponse(response)
      }
      setShowModal(true)
    },
    validateOnChange: false,
  })

  if (user.role !== 'common' || Object.keys(item).length === 0) {
    return (
      <div className="payment-page-error">
        <h1>Lo sentimos, ha ocurrido un error</h1>
        <p>
          Es posible que no tengas permisos para acceder a esta página o que el
          producto que estás buscando no exista.
        </p>
        <Button animated="fade" color="black" href="/">
          <Button.Content visible>Regresar al inicio</Button.Content>
          <Button.Content hidden>
            <Icon name="arrow left" />
          </Button.Content>
        </Button>
      </div>
    )
  } else {
    return (
      <div className="payment-page">
        <div className="payment-page__proyect">
          <BasicItem item={item} type={itemType} />
        </div>
        <div className="payment-page__transaction">
          <Grid columns={2} divided stackable padded>
            <Grid.Column>
              <Input
                label="Importe"
                labelPosition="left"
                readonly
                value={item.price}
              />

              <Input
                label="Concepto"
                labelPosition="left"
                readonly
                value={item.name}
              />

              <Input
                label="Referencia Pedido"
                labelPosition="left"
                readonly
                value={item._id}
              />

              <Input
                label="Referencia Cliente"
                labelPosition="left"
                readonly
                value={user._id}
              />

              <Input
                label="Fecha de operación"
                labelPosition="left"
                readonly
                value={new Date().toLocaleDateString()}
              />
            </Grid.Column>
            <Grid.Column>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Input
                  name="number"
                  label="Número de tarjeta"
                  labelPosition="left"
                  placeholder="0000 0000 0000 0000"
                  onChange={formik.handleChange}
                  error={formik.errors.number}
                  value={formik.values.number}
                />
                <Form.Input
                  name="name"
                  label="Titular"
                  labelPosition="left"
                  placeholder="Nombre y apellidos"
                  onChange={formik.handleChange}
                  error={formik.errors.name}
                  value={formik.values.name}
                />
                <Form.Input
                  name="date"
                  label="Fecha de caducidad"
                  labelPosition="left"
                  placeholder="MM/AA"
                  onChange={formik.handleChange}
                  error={formik.errors.date}
                  value={formik.values.date}
                />
                <Form.Input
                  name="cvv"
                  label="CVV"
                  labelPosition="left"
                  placeholder="000"
                  onChange={formik.handleChange}
                  error={formik.errors.cvv}
                  value={formik.values.cvv}
                />
                <Modal
                  basic
                  onClose={() => setOpen(false)}
                  onOpen={() => setOpen(true)}
                  open={open}
                  size="small"
                  trigger={
                    <Form.Button
                      type="submit"
                      fluid
                      loading={formik.isSubmitting}
                      className="payment-page__transaction__button"
                      color="green"
                      content="Pagar"
                    />
                  }
                >
                  <Header icon>
                    <Icon name="shopping cart" />
                    {paymentResponse.msg}
                  </Header>
                  <Modal.Actions>
                    <Button basic inverted onClick={() => navigate('/auth')}>
                      <Icon name="checkmark" /> Ir al perfil
                    </Button>
                  </Modal.Actions>
                </Modal>
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    )
  }
}
