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
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
  useMap,
} from "@/components/ui/map";

type CapturedPoint = {
  id: string;
  longitude: number;
  latitude: number;
  createdAt: string;
};

function MapClickCapture({
  onCapture,
}: {
  onCapture: (coords: { longitude: number; latitude: number }) => void;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    const handleMapClick = (event: MapMouseEvent) => {
      onCapture({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      });
    };

    map.on("click", handleMapClick);
    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, isLoaded, onCapture]);

  return null;
}

const worldCenter: [number, number] = [0, 20];

function toFeatureCollection(points: CapturedPoint[]) {
  return {
    type: "FeatureCollection",
    features: points.map((point, index) => ({
      type: "Feature",
      properties: {
        id: point.id,
        order: index + 1,
        createdAt: point.createdAt,
      },
      geometry: {
        type: "Point",
        coordinates: [point.longitude, point.latitude],
      },
    })),
  } satisfies GeoJSON.FeatureCollection<
    GeoJSON.Point,
    { id: string; order: number; createdAt: string }
  >;
};

export default function Home() {
  const [points, setPoints] = useState<CapturedPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<CapturedPoint | null>(
    null
  );

  const clusterData = useMemo(() => toFeatureCollection(points), [points]);

  const routeCoordinates = useMemo(
    () => points.map((point) => [point.longitude, point.latitude] as [number, number]),
    [points]
  );

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

  const clearPoints = useCallback(() => {
    setPoints([]);
    setSelectedPoint(null);
  }, []);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Map center={worldCenter} zoom={1.6} minZoom={1.1} maxZoom={18} renderWorldCopies>
        <MapClickCapture onCapture={handleCapture} />

        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />

        <MapClusterLayer
          data={clusterData}
          onPointClick={(feature, coordinates) => {
            const pointId = feature.properties?.id;
            const point = points.find((item) => item.id === pointId);
            if (point) {
              setSelectedPoint(point);
              return;
            }

            setSelectedPoint({
              id: String(pointId ?? ""),
              longitude: coordinates[0],
              latitude: coordinates[1],
              createdAt: new Date().toISOString(),
            });
          }}
        />

        {routeCoordinates.length > 1 && (
          <MapRoute
            id="captured-route"
            coordinates={routeCoordinates}
            color="hsl(var(--chart-2))"
            width={3}
            opacity={0.8}
          />
        )}

        {points.map((point, index) => (
          <MapMarker
            key={point.id}
            longitude={point.longitude}
            latitude={point.latitude}
          >
            <MarkerContent>
              <div className="h-3.5 w-3.5 rounded-full border-2 border-background bg-primary shadow" />
              <MarkerLabel>#{index + 1}</MarkerLabel>
            </MarkerContent>

            <MarkerTooltip>Captured point #{index + 1}</MarkerTooltip>

            <MarkerPopup closeButton>
              <div className="min-w-56 space-y-1">
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

        {selectedPoint && (
          <MapPopup
            longitude={selectedPoint.longitude}
            latitude={selectedPoint.latitude}
            closeButton
            onClose={() => setSelectedPoint(null)}
          >
            <div className="min-w-56 space-y-1">
              <p className="text-sm font-semibold">Selected location</p>
              <p className="text-xs text-muted-foreground">
                {selectedPoint.latitude.toFixed(5)}, {selectedPoint.longitude.toFixed(5)}
              </p>
            </div>
          </MapPopup>
        )}
      </Map>

    </main>
  );
}
