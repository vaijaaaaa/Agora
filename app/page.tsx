"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Map,
  MapClusterLayer,
  MapControls,
  MapPopup,
} from "@/components/ui/map";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Flame, Construction, Droplet, TriangleAlert, Activity, Recycle, Trash2, Stethoscope, Dog, MapPin, Clock, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { id: "plastic", label: "Plastic Waste", icon: Recycle, color: "text-blue-400", hex: "#60a5fa" },
  { id: "organic", label: "Organic/Food", icon: Trash2, color: "text-green-500", hex: "#22c55e" },
  { id: "debris", label: "Construction Debris", icon: Construction, color: "text-yellow-600", hex: "#ca8a04" },
  { id: "sewage", label: "Sewage Overflow", icon: Droplet, color: "text-indigo-500", hex: "#6366f1" },
  { id: "burning", label: "Open Burning", icon: Flame, color: "text-orange-500", hex: "#f97316" },
  { id: "ewaste", label: "E-Waste", icon: TriangleAlert, color: "text-yellow-400", hex: "#facc15" },
  { id: "medical", label: "Medical Waste", icon: Stethoscope, color: "text-red-400", hex: "#f87171" },
  { id: "animal", label: "Animal Carcass", icon: Dog, color: "text-amber-700", hex: "#78350f" },
  { id: "mixed", label: "Mixed Garbage", icon: Trash2, color: "text-stone-500", hex: "#78716c" },
];

function AnalyticsSidebar({ reportsCount, severeCount, categories }: any) {
  return (
    <Sidebar collapsible="offcanvas" className="border-r shadow-lg">
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex aspect-square size-10 items-center justify-center rounded-xl border border-primary/20">
            <Activity className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="text-base font-bold text-foreground">Live Hotspots</span>
            <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">Agora Network Map</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-background rounded-lg border p-4 text-center shadow-sm">
            <p className="text-2xl font-black text-foreground">{reportsCount}</p>
            <p className="text-muted-foreground mt-1 text-[10px] font-bold uppercase tracking-widest opacity-80">Total</p>
          </div>
          <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4 text-center shadow-sm">
            <p className="text-2xl font-black text-destructive">{severeCount}</p>
            <p className="text-destructive/80 mt-1 text-[10px] font-bold uppercase tracking-widest opacity-80">Severe</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6 text-sm">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold px-1 text-muted-foreground uppercase tracking-widest mb-2">Category Breakdown</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <SidebarMenuItem key={cat.id}>
                    <div className="flex items-center justify-between pointer-events-none p-2 rounded-md transition-colors bg-muted/30 border border-transparent hover:border-border">
                      <div className="flex items-center gap-3">
                        <Icon className={`size-4 ${cat.color}`} />
                        <span className="font-semibold text-sm text-foreground">{cat.label}</span>
                      </div>
                      <SidebarMenuBadge className="bg-background border shadow-xs text-foreground font-bold">
                        {categories[cat.id] || 0}
                      </SidebarMenuBadge>
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function Home() {
  const [points, setPoints] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('id, latitude, longitude, category, severity');
      
      if (!error && data) {
        const validPoints = data.filter(p => p.latitude && p.longitude);
        setPoints(validPoints);
      }
    };
    fetchReports();

    const channel = supabase
      .channel('public:reports')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reports' },
        (payload) => {
          const newReport = payload.new;
          if (newReport.latitude && newReport.longitude) {
            setPoints(current => [...current, newReport]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePointClick = async (feature: any) => {
    const reportId = feature.properties.id;
    setIsLoadingReport(true);
    
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (!error && data) {
      setSelectedReport(data);
    }
    setIsLoadingReport(false);
  };

  const clusterData = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: points.map((point) => ({
        type: "Feature",
        properties: { 
          id: point.id, 
          severity: point.severity,
          color: CATEGORIES.find(c => c.id === point.category)?.hex || "#3b82f6"
        },
        geometry: { type: "Point", coordinates: [point.longitude, point.latitude] },
      })),
    } satisfies GeoJSON.FeatureCollection<GeoJSON.Point>;
  }, [points]);

  const categoriesCount = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of points) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [points]);

  const severeCount = points.filter(p => p.severity === "Severe").length;

  return (
    <SidebarProvider>
      <AnalyticsSidebar 
        reportsCount={points.length} 
        severeCount={severeCount}
        categories={categoriesCount}
      />
      <SidebarInset className="relative h-screen w-full overflow-hidden flex flex-col bg-background m-0 p-0 border-none">
        <Map
          center={[77.5946, 12.9716]}
          zoom={12}
          minZoom={2}
          maxZoom={18}
          renderWorldCopies={true}
          className="flex-1 w-full h-full border-none outline-none"
        >
          <MapControls position="bottom-right" showZoom showCompass />
          
          <MapClusterLayer
            data={clusterData}
            onPointClick={handlePointClick}
          />

          {selectedReport && (
            <MapPopup
              latitude={selectedReport.latitude}
              longitude={selectedReport.longitude}
              onClose={() => setSelectedReport(null)}
              closeButton
              className="p-0 overflow-hidden w-72 sm:w-80 shadow-2xl border-primary/20 backdrop-blur-md bg-card/95"
            >
              <div className="relative group">
                {selectedReport.photos && selectedReport.photos.length > 0 ? (
                  <div className="relative h-44 w-full overflow-hidden">
                    <img 
                      src={selectedReport.photos[0]} 
                      alt="Reported Issue" 
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
                        selectedReport.severity === "Severe" ? "bg-destructive shadow-lg shadow-destructive/20" : 
                        selectedReport.severity === "Moderate" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : 
                        "bg-green-500 shadow-lg shadow-green-500/20"
                      }`}>
                        {selectedReport.severity}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 w-full bg-muted flex items-center justify-center flex-col gap-2">
                    <div className="p-3 rounded-full bg-muted-foreground/10 text-muted-foreground">
                      <TriangleAlert className="size-6" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">No Photo Provided</p>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest opacity-70 leading-none">
                    <MapPin className="size-3" />
                    <span>Location Detail</span>
                  </div>
                  <h3 className="font-bold text-base leading-tight">
                    {selectedReport.exact_location}
                  </h3>
                  <p className="text-muted-foreground text-xs font-medium">
                    {selectedReport.area}, {selectedReport.state}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1 text-[9px] font-bold uppercase tracking-widest">
                      <Clock className="size-2.5" />
                      <span>Reported On</span>
                    </div>
                    <p className="text-[11px] font-bold leading-none">
                      {new Date(selectedReport.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1 text-[9px] font-bold uppercase tracking-widest">
                      <User className="size-2.5" />
                      <span>Reporter</span>
                    </div>
                    <p className="text-[11px] font-bold leading-none truncate">
                      {selectedReport.name}
                    </p>
                  </div>
                </div>

                {selectedReport.notes && (
                  <div className="pt-2 border-t border-border/50">
                     <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                      "{selectedReport.notes}"
                    </p>
                  </div>
                )}
              </div>
            </MapPopup>
          )}
        </Map>
      </SidebarInset>
    </SidebarProvider>
  );
}
