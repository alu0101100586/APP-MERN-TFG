import React, { useState, useEffect } from 'react';
import { Form, Icon } from 'semantic-ui-react';
import { useFormik } from 'formik';
import { 
  ArtistService, 
  DiscService, 
  ConcertService, 
  MerchandiseService 
} from '../../../service';
import { initialValues, validationSchema } from './SearchBar.form';
import { ItemPagination } from '../ItemPagination';
import './SearchBar.scss';

const artistService = new ArtistService();
const discService = new DiscService();
const concertService = new ConcertService();
const merchandiseService = new MerchandiseService();

export function SearchBar(props) {
  const { type } = props;
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    (async () => {
      switch (type) {
        case 'artist':
          const responseArtist = await artistService.getArtistsApi();
          setItems(responseArtist);
          break;
        case 'disc':
          const responseDisc = await discService.getDiscsApi();
          setItems(responseDisc);
          break;
        case 'concert':
          const responseConcert = await concertService.getConcertsApi();
          setItems(responseConcert);
          break;
        case 'merchandise':
          const responseMerchandise = await merchandiseService.getMerchandisesApi();
          setItems(responseMerchandise);
          break;
        default:
          break;
      }
    })();
  }, []);

  const defaultOptions = [
    { key: '1', value: 'name', text: 'Nombre' },
    { key: '2', value: 'releaseDate', text: 'Fecha Salida' },
    { key: '3', value: 'musicalGenre', text: 'Géneros Musicales' },
  ]

  const  merchOptions = [
    { key: '1', value: 'name', text: 'Nombre' },
    { key: '2', value: 'releaseDate', text: 'Fecha Salida' },
    { key: '3', value: 'size', text: 'Tallas' },
  ]

  const artistOptions = [
    { key: '1', value: 'name', text: 'Nombre' },
    { key: '2', value: 'musicalGenre', text: 'Géneros Musicales' },
  ]

  const options = type === 'merchandise' ? merchOptions : type === 'artist' ? artistOptions : defaultOptions;

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    onSubmit: values => {
      handleSearch( values.searchTerm, values.filter );
    },
    validateOnChange: false,
  });

  //TODO - hacer que funcionen para cada opcion musicalGenre, size, etc
  const handleSearch = (searchTerm, selectedFilter) => {
    const filteredResults = items.filter((item) => {
      const searchField = options.find((option) => option.value === selectedFilter)?.value || '';
      switch (searchField) {
        case 'name':
          return item.name.toLowerCase().includes(searchTerm.toLowerCase());

        case 'releaseDate':
          return item.releaseDate.toLowerCase().includes(searchTerm.toLowerCase());

        case 'musicalGenre':
          console.log(item.musicalGenre);
          return item.musicalGenre.toLowerCase().includes(searchTerm.toLowerCase());

        case 'size':
          return item.size.toLowerCase().includes(searchTerm.toLowerCase());

        default:
          return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      // const fieldValue = item[searchField] || '';

      // return fieldValue.includes(searchTerm.toLowerCase());
    });

    setSearchResults(filteredResults);
  };

  return (
    <div className='search-bar'>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Form.Input
            width={16}
            type='text'
            placeholder='Ingrese su búsqueda...'
            icon={<Icon name='search' link/>}
            name='searchTerm'
            value={formik.values.searchTerm}
            onChange={formik.handleChange}
            error={formik.errors.searchTerm}
          />

          <Form.Select
            width={4}
            placeholder='Filtrar por...'
            options={options}
            name='filter'
            value={formik.values.filter}
            onChange={(e, { value }) => formik.setFieldValue('filter', value)}
            error={formik.errors.filter}
          />

          <Form.Button
            width={3}
            content='Buscar'
            type='submit'
            onsubmit={formik.isSubmitting}
          />
        </Form.Group>
      </Form>

      <div className='search-results'>
        {searchResults.length === 0 ?  (
          <ItemPagination items={items} type={type} />
        ) : (
          <ItemPagination items={searchResults} type={type} />
        )}
      </div>
    </div>
  )
}
