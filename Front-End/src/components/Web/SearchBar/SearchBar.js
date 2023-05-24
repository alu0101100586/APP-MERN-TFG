import React, { useState } from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';
import './SearchBar.scss';


export function SearchBar(props) {
  const { onSearch } = props;
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    //logica de enviar solicitud de busqueda al servidor
    onSearch(searchTerm);
  }

  return (
    <div className='search-bar'>
      <Form>
        <Form.Group >
          <Form.Input
            width={12}
            type='text'
            placeholder='Buscar un artista...'
            // icon={<Icon name='search' link onClick={handleSearch} />}
            icon={<Icon name='search' link/>}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          <Form.Select
            width={2}
            placeholder='Filtrar por...'
            options={[
              { key: '1', value: '1', text: 'Todos' },
              { key: '2', value: '2', text: 'Nombre' },
              { key: '3', value: '3', text: 'Fecha Inicio' },
              { key: '4', value: '4', text: 'Géneros musicales' },
            ]}
          />
        </Form.Group>
      </Form>
    </div>
  )
}
