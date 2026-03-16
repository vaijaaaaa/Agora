"use client";

import type { MapMouseEvent } from "maplibre-gl";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Map,
  MapClusterLayer,
  MapControls,
  MapMarker,
  MapPopup,
  MapRoute,
  MapViewport,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
  useMap,
} from "@/components/ui/map";
import { bangaloreMlas, partyConfig, type MLA } from "@/lib/bangalore-mlas";

// ─── Types ────────────────────────────────────────────────────────────────────

type CapturedPoint = {
  id: string;
  longitude: number;
  latitude: number;
  createdAt: string;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Fires onCapture for every click on the bare map (not on a marker). */
function MapClickCapture({
  onCapture,
}: {
  onCapture: (coords: { longitude: number; latitude: number }) => void;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;
    const handler = (e: MapMouseEvent) => {
      onCapture({ longitude: e.lngLat.lng, latitude: e.lngLat.lat });
    };
    map.on("click", handler);
    return () => { map.off("click", handler); };
  }, [map, isLoaded, onCapture]);

  return null;
}

/** Party-coloured dot pin — text appears only on hover via MarkerTooltip. */
function MlaMarkerDot({ mla }: { mla: MLA }) {
  const cfg = partyConfig[mla.party];
  return (
    <div className={`h-4 w-4 rounded-full border-2 border-background shadow-md cursor-pointer ${cfg.bg}`} />
  );
}

/** Full MLA info card shown inside a MarkerPopup. */
function MlaCard({ mla }: { mla: MLA }) {
  const cfg = partyConfig[mla.party];
  const initials = mla.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-64">
      {/* Party accent bar */}
      <div className={`h-1 w-full rounded-t-sm ${cfg.bg} -mx-3 -mt-3 mb-3 w-[calc(100%+1.5rem)]`} />

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold text-white ${cfg.bg} ${cfg.border}`}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="truncate text-sm font-semibold leading-snug">
            {mla.name}
          </p>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.badge}`}
          >
            {mla.party}
          </span>
          <p className="text-[11px] text-muted-foreground">
            {mla.constituency}
          </p>
        </div>
      </div>

      <div className={`mt-3 border-t pt-2`}>
        <p className="text-[11px] text-muted-foreground">
          Karnataka Legislative Assembly
        </p>
        <p className="text-[11px] text-muted-foreground">
          {mla.latitude.toFixed(4)}°N {mla.longitude.toFixed(4)}°E
        </p>
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const worldCenter: [number, number] = [77.5946, 12.9716]; // opens on Bangalore
const MLA_ZOOM_THRESHOLD = 10;

function toFeatureCollection(points: CapturedPoint[]) {
  return {
    type: "FeatureCollection",
    features: points.map((point, index) => ({
      type: "Feature",
      properties: { id: point.id, order: index + 1, createdAt: point.createdAt },
      geometry: { type: "Point", coordinates: [point.longitude, point.latitude] },
    })),
  } satisfies GeoJSON.FeatureCollection<
    GeoJSON.Point,
    { id: string; order: number; createdAt: string }
  >;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [zoom, setZoom] = useState(10);
  const [points, setPoints] = useState<CapturedPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<CapturedPoint | null>(null);

  const showMlaMarkers = zoom >= MLA_ZOOM_THRESHOLD;

  const clusterData = useMemo(() => toFeatureCollection(points), [points]);
  const routeCoordinates = useMemo(
    () => points.map((p) => [p.longitude, p.latitude] as [number, number]),
    [points]
  );

  const handleViewportChange = useCallback((vp: MapViewport) => {
    setZoom(vp.zoom);
  }, []);

  const handleCapture = useCallback(
    ({ longitude, latitude }: { longitude: number; latitude: number }) => {
      const point: CapturedPoint = {
        id: crypto.randomUUID(),
        longitude,
        latitude,
        createdAt: new Date().toISOString(),
      };
      setPoints((prev) => [...prev, point]);
      setSelectedPoint(point);
    },
    []
  );

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Map
        center={worldCenter}
        zoom={10}
        minZoom={1.1}
        maxZoom={18}
        renderWorldCopies
        onViewportChange={handleViewportChange}
      >
        <MapClickCapture onCapture={handleCapture} />

        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />

        {/* ── Cluster layer for user-captured points ── */}
        <MapClusterLayer
          data={clusterData}
          onPointClick={(feature, coordinates) => {
            const pointId = feature.properties?.id;
            const existing = points.find((p) => p.id === pointId);
            setSelectedPoint(
              existing ?? {
                id: String(pointId ?? ""),
                longitude: coordinates[0],
                latitude: coordinates[1],
                createdAt: new Date().toISOString(),
              }
            );
          }}
        />

        {/* ── Route connecting captured points ── */}
        {routeCoordinates.length > 1 && (
          <MapRoute
            id="captured-route"
            coordinates={routeCoordinates}
            color="hsl(var(--chart-2))"
            width={3}
            opacity={0.8}
          />
        )}

        {/* ── Captured-point individual markers ── */}
        {points.map((point, index) => (
          <MapMarker key={point.id} longitude={point.longitude} latitude={point.latitude}>
            <MarkerContent>
              <div className="h-3.5 w-3.5 rounded-full border-2 border-background bg-primary shadow" />
              <MarkerLabel>#{index + 1}</MarkerLabel>
            </MarkerContent>
            <MarkerTooltip>Captured point #{index + 1}</MarkerTooltip>
            <MarkerPopup closeButton>
              <div className="min-w-52 space-y-1">
                <p className="text-sm font-semibold">Captured location #{index + 1}</p>
                <p className="text-xs text-muted-foreground">
                  {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(point.createdAt).toLocaleString()}
                </p>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}

        {/* ── Selected-point floating popup ── */}
        {selectedPoint && (
          <MapPopup
            longitude={selectedPoint.longitude}
            latitude={selectedPoint.latitude}
            closeButton
            onClose={() => setSelectedPoint(null)}
          >
            <div className="min-w-52 space-y-1">
              <p className="text-sm font-semibold">Selected location</p>
              <p className="text-xs text-muted-foreground">
                {selectedPoint.latitude.toFixed(5)}, {selectedPoint.longitude.toFixed(5)}
              </p>
            </div>
          </MapPopup>
        )}

        {/* ── Bangalore MLA constituency markers (visible when zoomed in) ── */}
        {showMlaMarkers &&
          bangaloreMlas.map((mla) => (
            <MapMarker
              key={mla.constituency}
              longitude={mla.longitude}
              latitude={mla.latitude}
            >
              <MarkerContent>
                <MlaMarkerDot mla={mla} />
              </MarkerContent>

              <MarkerTooltip>
                <span className="font-semibold">{mla.name}</span>
                <span className="mx-1 opacity-50">·</span>
                {mla.constituency}
              </MarkerTooltip>

              <MarkerPopup closeButton>
                <MlaCard mla={mla} />
              </MarkerPopup>
            </MapMarker>
          ))}
      </Map>
    </main>
  );
}
