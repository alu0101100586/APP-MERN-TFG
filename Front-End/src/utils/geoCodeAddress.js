import { ENV } from './constants'

export function geoCodeAddress(address) {
  const url = `https://api.opencagedata.com/geocode/v1/json?key=${
    ENV.API_KEY_GEOCODE
  }&q=${encodeURIComponent(address)}`

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry
        return [lat, lng]
      } else {
        console.error(
          'No se encontraron resultados de geocodificación para la dirección especificada'
        )
      }
    })
    .catch((error) => {
      console.error('Error al obtener las coordenadas:', error)
      throw error
    })
}
