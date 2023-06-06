import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { icon as leafletIcon } from 'leaflet'
import { geoCodeAddress } from '../../../utils'
import { image } from '../../../assets'
import 'leaflet/dist/leaflet.css'
import './Map.scss'

export function Map(props) {
  const { location } = props
  const [position, setPosition] = useState([0, 0])

  const markerIcon = leafletIcon({
    iconUrl: image.Marker,
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })

  useEffect(() => {
    ;(async () => {
      const [lat, lng] = await geoCodeAddress(location)
      setPosition([lat, lng])
    })()
  }, [location])

  return (
    <div
      className="map-component"
      id="map"
      style={{
        width: '100%',
        height: '200px',
        cursor: 'grab',
        background: 'none',
      }}
    >
      {position[0] !== 0 && position[1] !== 0 ? (
        <MapContainer
          center={position}
          zoom={17}
          zoomControl={false}
          dragging={true}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="Map data © OpenStreetMap contributors"
          />
          <Marker position={position} icon={markerIcon} />
        </MapContainer>
      ) : (
        <p>{location}</p>
      )}
    </div>
  )
}
