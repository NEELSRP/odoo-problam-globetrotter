import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'

export default function TripMap({ stops }) {
  const withCoords = stops.filter((s) => s.city.latitude && s.city.longitude)

  if (withCoords.length === 0) {
    return (
      <div className="ticket-card border border-dashed border-ink/30 p-8 text-center text-ink-soft">
        Add a stop with a mapped city to see it on the map.
      </div>
    )
  }

  const center = [withCoords[0].city.latitude, withCoords[0].city.longitude]
  const path = withCoords.map((s) => [s.city.latitude, s.city.longitude])

  return (
    <div className="ticket-card overflow-hidden border border-ink/10" style={{ height: '22rem' }}>
      <MapContainer center={center} zoom={4} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={path} pathOptions={{ color: '#2F6E5E', dashArray: '6 8', weight: 3 }} />
        {withCoords.map((s) => (
          <Marker key={s.id} position={[s.city.latitude, s.city.longitude]}>
            <Popup>
              <strong>{s.city.name}</strong>, {s.city.country}
              <br />
              {s.start_date} → {s.end_date}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
