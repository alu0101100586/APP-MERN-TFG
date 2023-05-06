import React from 'react'
import { Button } from 'semantic-ui-react'
import { useAuth } from '../../../../hooks'
import { useNavigate } from 'react-router-dom'
import { Auth, UserService } from '../../../../service'
import './DeleteUserTransaction.scss'

const userService = new UserService()
const authService = new Auth()

export function DeleteUserTransaction(props) {
  const { close } = props
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const handleDelete = async (accessToken) => {
    try {
      await userService.deleteMeApi(accessToken)
      authService.removeTokens()
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="delete-user-transaction">
      <h1>¿Seguro de que quieres seguir adelante?</h1>
      <div className="delete-user-transaction__content">
        <p>
          No podrás acceder de nuevo con este usuario y toda tu información será
          borrada, además la página de artista/grupo asignada a esta cuenta se
          borrará para siempre.
        </p>
      </div>

      <div className="delete-user-transaction__buttons">
        <Button
          className="delete-user-transaction__buttons-delete"
          secondary
          onClick={() => handleDelete(accessToken)}
        >
          Eliminar
        </Button>
        <Button
          className="delete-user-transaction__buttons-cancel"
          primary
          onClick={close}
        >
          Cancelar
        </Button>
      </div>
    </div>
  )
}
