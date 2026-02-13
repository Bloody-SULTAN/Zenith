// ──────────────────────────────────────────────
// ISSMap — Interactive Leaflet map for ISS tracking
// ──────────────────────────────────────────────
// Renders dark CartoDB tiles with a CircleMarker for
// the ISS, a polyline ground track, and a telemetry
// info overlay. All map tiles are free (no API key).

import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  useMap,
} from 'react-leaflet';
import type { ISSPositionExtended } from '@/types';

interface ISSMapProps {
  position: ISSPositionExtended;
  history: ISSPositionExtended[];
}

// ── Auto-follow: pan map to ISS on each update ──

function MapAutoFollow({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [map, lat, lng]);
  return null;
}

// ── Split polyline at the antimeridian (±180°) ──

function splitAtAntimeridian(
  positions: ISSPositionExtended[]
): [number, number][][] {
  const segments: [number, number][][] = [[]];
  for (let i = 0; i < positions.length; i++) {
    const current = positions[i];
    if (i > 0) {
      const prev = positions[i - 1];
      if (Math.abs(current.longitude - prev.longitude) > 180) {
        segments.push([]);
      }
    }
    segments[segments.length - 1].push([current.latitude, current.longitude]);
  }
  return segments;
}

// ── Main Map Component ──────────────────────

export function ISSMap({ position, history }: ISSMapProps) {
  const segments = splitAtAntimeridian(history);

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-xl">
      <MapContainer
        center={[position.latitude, position.longitude]}
        zoom={3}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <MapAutoFollow lat={position.latitude} lng={position.longitude} />

        {/* Ground track */}
        {segments.map((segment, i) => (
          <Polyline
            key={i}
            positions={segment}
            pathOptions={{ color: '#38bdf8', weight: 2, opacity: 0.4 }}
          />
        ))}

        {/* ISS marker */}
        <CircleMarker
          center={[position.latitude, position.longitude]}
          radius={8}
          pathOptions={{
            color: '#38bdf8',
            fillColor: '#38bdf8',
            fillOpacity: 0.9,
            weight: 2,
          }}
        />
      </MapContainer>

      {/* Telemetry overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-white/5 bg-[#0a1628]/80 px-4 py-3 backdrop-blur-md">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <div>
            <span className="text-slate-400">Lat</span>
            <span className="ml-2 font-mono text-sky-400">
              {position.latitude.toFixed(4)}°
            </span>
          </div>
          <div>
            <span className="text-slate-400">Lon</span>
            <span className="ml-2 font-mono text-sky-400">
              {position.longitude.toFixed(4)}°
            </span>
          </div>
          <div>
            <span className="text-slate-400">Alt</span>
            <span className="ml-2 font-mono text-sky-400">
              {position.altitude.toFixed(1)} km
            </span>
          </div>
          <div>
            <span className="text-slate-400">Vel</span>
            <span className="ml-2 font-mono text-sky-400">
              {position.velocity.toFixed(2)} km/s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
