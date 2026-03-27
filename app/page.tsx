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
import { Flame, Construction, Droplet, TriangleAlert, Activity, Recycle, Trash2, Stethoscope, Dog, MapPin, Clock, User, X, Camera, ExternalLink } from "lucide-react";
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
    <Sidebar collapsible="offcanvas" className="border-r shadow-none bg-background/50 backdrop-blur-md">
      <SidebarHeader className="px-5 py-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="bg-primary/5 text-primary flex aspect-square size-9 items-center justify-center rounded-lg border border-primary/10">
            <Activity className="size-4.5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="text-sm font-bold text-foreground tracking-tight">Agora Network</span>
            <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-semibold opacity-70">Live Hotspots</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-3 text-center transition-colors hover:bg-muted/40">
            <p className="text-xl font-bold text-foreground tracking-tighter">{reportsCount}</p>
            <p className="text-muted-foreground mt-0.5 text-[9px] font-bold uppercase tracking-widest opacity-60">Total</p>
          </div>
          <div className="bg-destructive/5 border-destructive/10 rounded-lg border p-3 text-center transition-colors hover:bg-destructive/10">
            <p className="text-xl font-bold text-destructive tracking-tighter">{severeCount}</p>
            <p className="text-destructive/60 mt-0.5 text-[9px] font-bold uppercase tracking-widest opacity-70">Severe</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 space-y-4 text-sm scrollbar-hide">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold px-2 text-muted-foreground/60 uppercase tracking-[0.15em] mb-2">Category Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <SidebarMenuItem key={cat.id}>
                    <div className="flex items-center justify-between pointer-events-none px-2 py-1.5 rounded-md transition-all bg-transparent border border-transparent hover:bg-muted/30">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1 rounded-sm bg-muted/50 ${cat.color.replace('text-', 'bg-').replace('-400', '/10').replace('-500', '/10').replace('-600', '/10').replace('-700', '/10')}`}>
                          <Icon className={`size-3.5 ${cat.color} opacity-90`} />
                        </div>
                        <span className="font-medium text-[13px] text-foreground/90">{cat.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/20 min-w-[20px] text-center">
                        {categories[cat.id] || 0}
                      </span>
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

          {/* Minimal Side Detail Panel */}
          <div className={`fixed top-[80px] right-0 bottom-0 w-[380px] z-50 transition-all duration-500 ease-in-out border-l bg-background/95 backdrop-blur-xl shadow-2xl ${selectedReport ? "translate-x-0" : "translate-x-full"
            }`}>
            {selectedReport && (
              <div className="h-full flex flex-col h-screen">
                {/* Header with Close */}
                <div className="px-6 py-5 flex items-center justify-between border-b shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                      <Activity className="size-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground leading-none">Issue Summary</h2>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-medium">#{selectedReport.id.split('-')[0]}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-2 hover:bg-muted rounded-full transition-colors group"
                  >
                    <X className="size-4 text-muted-foreground group-hover:text-foreground" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {/* Image Section - Compact & Integrated */}
                  <div className="h-52 w-full bg-muted/30 overflow-hidden relative border-b">
                    {selectedReport.photos && selectedReport.photos[0] ? (
                      <img
                        src={selectedReport.photos[0]}
                        alt="Evidence"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542601906970-34f67ef24726?auto=format&fit=crop&q=80&w=800"}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
                        <Camera className="size-6" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">No Imagery Provided</span>
                      </div>
                    )}

                    {/* Floating Info Overlay */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest backdrop-blur-md ${selectedReport.severity === "Severe" || selectedReport.severity === "Blocking Access" ? "bg-red-500/20 text-red-200 border border-red-500/30" :
                        selectedReport.severity === "Moderate" ? "bg-amber-500/20 text-amber-200 border border-amber-500/30" :
                          "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                        }`}>
                        {selectedReport.severity || "Reported"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Location Title & Category */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest bg-secondary text-secondary-foreground border">
                            {CATEGORIES.find(c => c.id === selectedReport.category)?.label || "Other"}
                          </span>
                        </div>
                        <h1 className="text-base font-semibold leading-snug tracking-tight text-foreground line-clamp-3">
                          {selectedReport.exact_location}
                        </h1>
                      </div>

                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <MapPin className="size-3.5 text-primary/60" />
                          <span className="font-medium">{selectedReport.area}, {selectedReport.state}</span>
                        </div>
                        <button
                          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedReport.latitude},${selectedReport.longitude}`, '_blank')}
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="size-3" />
                          Directions
                        </button>
                      </div>
                    </div>

                    {/* Simple Stats Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 py-4 border-y border-border/50">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Registered</p>
                        <p className="font-medium text-xs text-foreground flex items-center gap-1.5">
                          <Clock className="size-3 opacity-50" />
                          {new Date(selectedReport.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Reporter</p>
                        <p className="font-medium text-xs text-foreground flex items-center gap-1.5 truncate">
                          <User className="size-3 opacity-50" />
                          {selectedReport.name}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    {selectedReport.notes && (
                      <div className="bg-muted/30 p-4 rounded-lg border border-border/50 space-y-2">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Citizen Notes</p>
                        <p className="text-xs leading-relaxed text-foreground/80 italic">
                          "{selectedReport.notes}"
                        </p>
                      </div>
                    )}

                    {/* Minimal Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-2 pb-6">
                      <button className="py-2.5 px-4 rounded-md border text-[11px] font-semibold hover:bg-muted transition-all active:scale-[0.98]">
                        Flag Incident
                      </button>
                      <button
                        onClick={() => setSelectedReport(null)}
                        className="py-2.5 px-4 rounded-md bg-secondary text-secondary-foreground text-[11px] font-semibold hover:bg-secondary/80 transition-all active:scale-[0.98]"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Map>
      </SidebarInset>
    </SidebarProvider>
  );
}
