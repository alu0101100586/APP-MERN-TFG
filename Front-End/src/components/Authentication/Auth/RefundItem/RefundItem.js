import React, { useEffect, useState } from 'react'
import { Form, Loader } from 'semantic-ui-react'
import { map } from 'lodash'
import { useFormik } from 'formik';
import { 
  DiscService, 
  ConcertService, 
  MerchandiseService 
} from '../../../../service'
import { useAuth } from '../../../../hooks'
import { initialValues, validationSchema } from './RefundItem.form'

const discController = new DiscService();
const concertController = new ConcertService();
const merchController = new MerchandiseService();

export function RefundItem(props) {
  const { accessToken } = useAuth();
  const { close, onReload, type } = props;
  const [selectedItem, setSelectedItem] = useState('');
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (type === 'disc') {
          const response = await discController.getDiscsUserApi(accessToken, 1, 1000);
          setItems(response.docs);
        } else if (type === 'concert') {
          const response = await concertController.getConcertsUserApi(accessToken, 1, 1000);
          setItems(response.docs);
        } else if (type === 'merch') {
          const response = await merchController.getMerchandiseUserApi(accessToken, 1, 1000);
          setItems(response.docs);
        }
      } catch (error) {
        throw(error);
      }
    })()
  }, [])

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: async (formData) => {
      try {
        if (type === 'disc') {
          await discController.returnDiscApi(accessToken, formData.item)
        } else if (type === 'concert') {
          await concertController.returnTicketApi(accessToken, formData.item)
        } else if (type === 'merch') {
          await merchController.returnMerchandiseApi(accessToken, formData.item)
        }
        onReload()
        close()
      } catch (error) {
        console.log(error);
      }
    },
    validateOnChange: false,
  })

  if(!items) return <Loader active inline="centered" />;

  const itemOptions = map(items, (item) => ({
    key: item._id,
    text: item.name,
    value: item._id,
  }));

  const handleOptionChange = (event,{ value }) => {
    setSelectedItem(value);
    formik.setFieldValue('item', value);
  }

  return (
    <Form className="refund-item" onSubmit={formik.handleSubmit}>
      <Form.Select
        label="Selecciona un elemento"
        name="item"
        placeholder='Elemento'
        options={itemOptions}
        value={selectedItem}
        onChange={handleOptionChange}
        error={formik.errors.item}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Eliminar
      </Form.Button>
    </Form>
  )
}
