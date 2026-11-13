'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { StrikePoint } from '@/types/strike';

const iconCache: Record<string, L.DivIcon> = {};

function getIcon(status: string) {
  if (iconCache[status]) return iconCache[status];

  const colors: Record<string, string> = {
    active: '#dc2626',
    suspended: '#f59e0b',
    ended: '#6b7280',
    unconfirmed_end: '#7c3aed',
  };

  const color = colors[status] ?? '#6b7280';

  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });

  iconCache[status] = icon;
  return icon;
}

function locationLabel(strike: StrikePoint) {
  if (strike.scope === 'national') return 'Nacional';
  if (strike.city && strike.state) return `${strike.city}/${strike.state}`;
  if (strike.state) return strike.state;
  if (strike.city) return strike.city;
  return 'Local não informado';
}

function statusLabel(status: string) {
  if (status === 'active') return 'Ativa';
  if (status === 'suspended') return 'Suspensa';
  if (status === 'ended') return 'Encerrada';
  if (status === 'unconfirmed_end') return 'Sem término confirmado';
  return status;
}

function statusStyle(status: string) {
  if (status === 'active') return { background: '#fee2e2', color: '#991b1b' };
  if (status === 'suspended') return { background: '#fef3c7', color: '#92400e' };
  if (status === 'unconfirmed_end') return { background: '#ede9fe', color: '#5b21b6' };
  return { background: '#f3f4f6', color: '#374151' };
}

function confidenceLabel(confidence: string) {
  if (confidence === 'confirmed') return 'Confirmada';
  if (confidence === 'likely') return 'Provável';
  if (confidence === 'unverified') return 'Não verificada';
  return confidence;
}

function eventTypeLabel(eventType: string) {
  if (eventType === 'paralisacao') return 'Paralisação';
  return 'Greve';
}

function eventTypeStyle(eventType: string) {
  if (eventType === 'paralisacao') return { background: '#fef3c7', color: '#92400e' };
  return { background: '#ede9fe', color: '#5b21b6' };
}

type StrikeMapProps = {
  strikes: StrikePoint[];
};

export default function StrikeMap({ strikes }: StrikeMapProps) {
  const [mapKey] = useState(() => `map-${Math.random().toString(36).slice(2)}`);

  // DIAGNÓSTICO — apagar depois
  console.log('TOTAL STRIKES:', strikes.length);
  console.log('PRIMEIRO STRIKE:', strikes[0]);
  console.log('EVENTTYPES:', strikes.map((s) => s.eventType));

  const withCoords = strikes.filter(
    (s): s is StrikePoint & { lat: number; lng: number } =>
      s.lat != null && s.lng != null
  );

  return (
    <MapContainer
      key={mapKey}
      center={[-15.7939, -47.8828]}
      zoom={4}
      style={{ height: '100%', width: '100%', minHeight: 500 }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {withCoords.map((strike) => (
        <Marker
          key={strike.id}
          position={[strike.lat, strike.lng]}
          icon={getIcon(strike.status)}
        >
          <Popup>
            <div style={{ minWidth: 220, maxWidth: 300 }}>
              <strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
                {strike.title}
              </strong>

              <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>
                {locationLabel(strike)} · {strike.category}
              </div>

              <div style={{ fontSize: 12, marginBottom: 6 }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    marginRight: 6,
                    ...eventTypeStyle(strike.eventType ?? 'greve'),
                  }}
                >
                  {eventTypeLabel(strike.eventType ?? 'greve')}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    marginRight: 6,
                    ...statusStyle(strike.status),
                  }}
                >
                  {statusLabel(strike.status)}
                </span>
                <span style={{ color: '#6b7280' }}>
                  {confidenceLabel(strike.confidence)}
                </span>
              </div>

              {strike.demands && (
                <div style={{ fontSize: 12, marginBottom: 6, lineHeight: 1.4 }}>
                  {strike.demands}
                </div>
              )}

              {strike.entityName && (
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>
                  {strike.entityName}
                </div>
              )}

              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>
                Início: {new Date(strike.startedAt).toLocaleDateString('pt-BR')}
                {strike.endedAt &&
                  ` · Fim: ${new Date(strike.endedAt).toLocaleDateString('pt-BR')}`}
              </div>

              {strike.sources && strike.sources.length > 0 && (
                <div style={{ fontSize: 11, borderTop: '1px solid #e5e7eb', paddingTop: 6 }}>
                  <span style={{ color: '#6b7280' }}>Fonte: </span>
                  {strike.sources.map((src, i) => (
                    <span key={src.id}>
                      {i > 0 && ' · '}
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#2563eb', textDecoration: 'underline' }}
                      >
                        {src.publisher ?? 'link'}
                      </a>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}