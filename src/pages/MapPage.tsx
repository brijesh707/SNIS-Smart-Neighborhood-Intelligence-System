import { useState, useMemo, useEffect, useRef } from 'react';
import { Map as MapIcon, Layers, Info, X, MapPin } from 'lucide-react';
import L from 'leaflet';
import { runClustering } from '@/lib/clustering';
import { venueCategoryLabels, type Neighbourhood, type VenueCategory } from '@/data/neighbourhoods';

const clusterColors = [
  { hex: '#5cbd94', text: 'text-mint-600', label: 'Cluster A' },
  { hex: '#5ea7e0', text: 'text-sky-500', label: 'Cluster B' },
  { hex: '#f09a72', text: 'text-peach-500', label: 'Cluster C' },
  { hex: '#9d83ca', text: 'text-lavender-500', label: 'Cluster D' },
  { hex: '#e28898', text: 'text-rose-500', label: 'Cluster E' },
  { hex: '#eab05a', text: 'text-amber-500', label: 'Cluster F' },
];

const venueCategoryColors: Record<VenueCategory, string> = {
  restaurants: '#f09a72',
  parks: '#5cbd94',
  schools: '#5ea7e0',
  shopping: '#e28898',
  healthcare: '#d06a7d',
  transit: '#9d83ca',
  entertainment: '#eab05a',
  groceries: '#8dd4b6',
};

function safetyColorHex(score: number): string {
  if (score >= 80) return '#5cbd94';
  if (score >= 65) return '#5ea7e0';
  if (score >= 50) return '#eab05a';
  if (score >= 40) return '#f09a72';
  return '#d06a7d';
}

function safetyLabel(score: number): string {
  if (score >= 80) return 'Very Safe';
  if (score >= 65) return 'Safe';
  if (score >= 50) return 'Moderate';
  if (score >= 40) return 'Caution';
  return 'High Risk';
}

function createCircleIcon(color: string, size: number, label?: string): L.DivIcon {
  const html = label
    ? `<div style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>
        <div style="margin-top:2px;padding:1px 5px;background:white;border-radius:4px;font-size:10px;font-weight:600;color:#5a6a80;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.1);">${label}</div>
      </div>`
    : `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.15);"></div>`;
  return L.divIcon({
    html,
    className: 'neighbourhood-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MapPage() {
  const [kValue, setKValue] = useState(4);
  const [showVenues, setShowVenues] = useState(true);
  const [colorMode, setColorMode] = useState<'cluster' | 'safety'>('cluster');
  const [selected, setSelected] = useState<Neighbourhood | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const venueMarkersRef = useRef<L.Marker[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { clustered } = useMemo(() => runClustering(kValue), [kValue]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [51.45, -0.1],
      zoom: 10,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when data, color mode, or venue toggle changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    venueMarkersRef.current.forEach((m) => m.remove());
    venueMarkersRef.current = [];

    // Venue markers
    if (showVenues) {
      clustered.forEach((n) => {
        n.venues.forEach((v) => {
          const color = venueCategoryColors[v.category];
          const icon = createCircleIcon(color, 8);
          const marker = L.marker([v.lat, v.lng], { icon }).addTo(map);
          marker.bindPopup(
            `<div style="font-size:13px;">
              <strong>${v.name}</strong><br/>
              <span style="color:#888;">${venueCategoryLabels[v.category]}</span><br/>
              <span style="color:#eab05a;">Rating: ${v.rating}</span>
            </div>`
          );
          venueMarkersRef.current.push(marker);
        });
      });
    }

    // Neighbourhood markers
    clustered.forEach((n) => {
      const color =
        colorMode === 'cluster'
          ? clusterColors[n.cluster! % clusterColors.length].hex
          : safetyColorHex(n.safetyIndex);
      const icon = createCircleIcon(color, 14, n.name);
      const marker = L.marker([n.lat, n.lng], { icon }).addTo(map);
      marker.bindPopup(
        `<div style="font-size:13px;min-width:160px;">
          <strong style="font-size:14px;">${n.name}</strong><br/>
          <span style="color:#888;">${n.city}</span><br/><br/>
          <span>Population: <strong>${(n.population / 1000).toFixed(1)}k</strong></span><br/>
          <span>Income: <strong>£${(n.medianIncome / 1000).toFixed(0)}k</strong></span><br/>
          <span>Safety: <strong style="color:${safetyColorHex(n.safetyIndex)};">${n.safetyIndex}/100 (${safetyLabel(n.safetyIndex)})</strong></span><br/>
          <span>Cluster: <strong>${clusterColors[n.cluster! % clusterColors.length].label}</strong></span><br/>
          <span>Venues: <strong>${n.venues.length}</strong></span>
        </div>`
      );
      marker.on('click', () => setSelected(n));
      markersRef.current.push(marker);
    });
  }, [clustered, colorMode, showVenues]);

  return (
    <div className="pt-16 bg-pastel-50 min-h-screen">
      {/* Header */}
      <div className="bg-pastel-100 border-b border-pastel-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-2">
            <MapIcon className="w-7 h-7 text-mint-500" />
            <h1 className="text-2xl font-bold text-pastel-500">Map View</h1>
          </div>
          <p className="text-pastel-400 max-w-2xl">
            Neighbourhoods plotted on an interactive OpenStreetMap by geocoded coordinates.
            Points are colored by cluster assignment or safety score. Toggle venue markers to
            see the underlying Foursquare Places API data.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Controls */}
        <div className="bg-white rounded-2xl border border-pastel-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-pastel-500 mb-3">
                <Layers className="w-4 h-4 text-mint-500" />
                Clusters (k): <span className="text-mint-500 font-bold">{kValue}</span>
              </label>
              <input
                type="range"
                min={2}
                max={6}
                value={kValue}
                onChange={(e) => setKValue(Number(e.target.value))}
                className="w-full max-w-xs h-2 bg-pastel-200 rounded-lg appearance-none cursor-pointer accent-mint-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-pastel-400 mr-1">Color by:</span>
              <button
                onClick={() => setColorMode('cluster')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  colorMode === 'cluster'
                    ? 'bg-mint-400 text-white'
                    : 'bg-pastel-100 text-pastel-400 hover:bg-pastel-200'
                }`}
              >
                Cluster
              </button>
              <button
                onClick={() => setColorMode('safety')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  colorMode === 'safety'
                    ? 'bg-mint-400 text-white'
                    : 'bg-pastel-100 text-pastel-400 hover:bg-pastel-200'
                }`}
              >
                Safety
              </button>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <button
                onClick={() => setShowVenues(!showVenues)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  showVenues ? 'bg-mint-400' : 'bg-pastel-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    showVenues ? 'translate-x-5' : ''
                  }`}
                />
              </button>
              <span className="text-sm text-pastel-400">Show venues</span>
            </label>
          </div>
        </div>

        {/* Map container - centered, prominent */}
        <div className="bg-white rounded-2xl border border-pastel-200 p-4">
          <div
            ref={containerRef}
            className="w-full rounded-xl overflow-hidden"
            style={{ height: '520px' }}
          />
        </div>

        {/* Legend */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Color legend */}
          <div className="bg-white rounded-2xl border border-pastel-200 p-5">
            <h3 className="text-sm font-semibold text-pastel-500 mb-3">
              {colorMode === 'cluster' ? 'Cluster Legend' : 'Safety Legend'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {colorMode === 'cluster'
                ? clusterColors.slice(0, kValue).map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs text-pastel-400">{c.label}</span>
                    </div>
                  ))
                : [
                    { color: '#5cbd94', label: 'Very Safe (80+)' },
                    { color: '#5ea7e0', label: 'Safe (65-79)' },
                    { color: '#eab05a', label: 'Moderate (50-64)' },
                    { color: '#f09a72', label: 'Caution (40-49)' },
                    { color: '#d06a7d', label: 'High Risk (<40)' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="text-xs text-pastel-400">{s.label}</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Venue legend */}
          {showVenues && (
            <div className="bg-white rounded-2xl border border-pastel-200 p-5">
              <h3 className="text-sm font-semibold text-pastel-500 mb-3">Venue Categories</h3>
              <div className="flex flex-wrap gap-3">
                {(Object.entries(venueCategoryColors) as [VenueCategory, string][]).map(
                  ([cat, color]) => (
                    <div key={cat} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-xs text-pastel-400">
                        {venueCategoryLabels[cat]}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info note */}
        <div className="bg-mint-50 border border-mint-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-mint-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-pastel-500 text-sm mb-1">
                About This Visualization
              </h3>
              <p className="text-sm text-pastel-400 leading-relaxed">
                Neighbourhood coordinates are geocoded from Wikipedia lists, as Peddi [3] did for
                Hyderabad. Venue locations are retrieved from the Foursquare Places API. The
                pipeline - scraping to geocoding to API venue retrieval to clustering to map
                visualization - generalizes across different business objectives, from mall site
                selection to relocation guidance. Click any marker for neighbourhood details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-pastel-500/30 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-pastel-500">{selected.name}</h3>
                <p className="text-sm text-pastel-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selected.city}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1 text-pastel-400 hover:text-pastel-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-pastel-50 rounded-lg p-3 text-center">
                <div className="text-xs text-pastel-400">Population</div>
                <div className="text-sm font-bold text-pastel-500">
                  {(selected.population / 1000).toFixed(1)}k
                </div>
              </div>
              <div className="bg-pastel-50 rounded-lg p-3 text-center">
                <div className="text-xs text-pastel-400">Income</div>
                <div className="text-sm font-bold text-pastel-500">
                  £${(selected.medianIncome / 1000).toFixed(0)}k
                </div>
              </div>
              <div className="bg-pastel-50 rounded-lg p-3 text-center">
                <div className="text-xs text-pastel-400">Safety</div>
                <div
                  className="text-sm font-bold"
                  style={{ color: safetyColorHex(selected.safetyIndex) }}
                >
                  {selected.safetyIndex}/100
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-medium text-pastel-400 mb-2">
                Cluster:{' '}
                <span className="text-pastel-500 font-semibold">
                  {clusterColors[selected.cluster! % clusterColors.length].label}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-pastel-500 mb-2">
                Venues ({selected.venues.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selected.venues.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-pastel-50"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: venueCategoryColors[v.category] }}
                    />
                    <span className="text-sm text-pastel-500 flex-1">{v.name}</span>
                    <span className="text-xs text-pastel-400">
                      {venueCategoryLabels[v.category]}
                    </span>
                    <span className="text-xs font-medium text-amber-500">
                      {v.rating}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
