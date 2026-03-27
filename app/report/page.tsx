"use client";

import { useState, useEffect } from "react";
import type { MapMouseEvent } from "maplibre-gl";
import { 
  MapPin, 
  Flame, 
  Stethoscope, 
  Droplet, 
  TriangleAlert, 
  Dog, 
  Recycle, 
  Trash2, 
  Construction,
  Building,
  UploadCloud,
  ExternalLink,
  Camera
} from "lucide-react";
import { Map, MapControls, MapMarker, useMap } from "@/components/ui/map";
import { supabase } from "@/lib/supabase";

function MapClickCapture({ onCapture }: { onCapture: (coords: { lng: number; lat: number }) => void }) {
  const { map, isLoaded } = useMap();
  useEffect(() => {
    if (!map || !isLoaded) return;
    const handler = (e: MapMouseEvent) => onCapture({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    map.on("click", handler);
    return () => { map.off("click", handler); };
  }, [map, isLoaded, onCapture]);
  return null;
}

export default function ReportPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  
  const [siteType, setSiteType] = useState<string>("");
  const [severity, setSeverity] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mapOpen, setMapOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleMapClick = async (coords: { lat: number; lng: number }) => {
    setCoordinates(coords);
    setIsGeocoding(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        setLocation(data.display_name);
        if (data.address) {
          if (data.address.state) setState(data.address.state);
          const valArea = data.address.suburb || data.address.neighbourhood || data.address.city_district || data.address.county || "";
          if (valArea) setArea(valArea);
        }
      }
    } catch (e) {
      console.error("Reverse geocoding failed", e);
    } finally {
      setIsGeocoding(false);
    }
  };

  const SITE_TYPES = [
    "Road", "Footpath", "Drainage", "Open Plot", "Park", 
    "Market", "School Zone", "Hospital Zone", "Encroachment"
  ];

  const SEVERITY_LEVELS = ["Minor", "Moderate", "Severe", "Blocking Access"];

  const CATEGORIES = [
    { id: "plastic", label: "Plastic", icon: Recycle },
    { id: "organic", label: "Organic/Food", icon: Trash2 },
    { id: "debris", label: "Construction Debris", icon: Construction },
    { id: "sewage", label: "Sewage Overflow", icon: Droplet },
    { id: "burning", label: "Open Burning", icon: Flame },
    { id: "ewaste", label: "E-Waste", icon: TriangleAlert },
    { id: "medical", label: "Medical Waste", icon: Stethoscope },
    { id: "animal", label: "Animal Carcass", icon: Dog },
    { id: "mixed", label: "Mixed Garbage", icon: Trash2 },
  ];

  const handleSubmit = async () => {
    if (!name.trim() || !location.trim() || photos.length === 0) {
      alert("Please fill out Your Name, Exact Location, and upload at least 1 Photo.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
         // Mock mode logic since Supabase keys might not be defined locally yet
         await new Promise(r => setTimeout(r, 1500));
         console.warn("Supabase keys are not set. The form is running in Mock Mode.");
      } else {
        // 1. Upload photos to Supabase Storage Bucket ('reports_media')
        const uploadedFileUrls: string[] = [];
        for (const file of photos) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError, data } = await supabase.storage
            .from('reports_media') 
            .upload(fileName, file);
            
          if (uploadError) throw uploadError;
          
          const { data: publicUrlData } = supabase.storage
            .from('reports_media')
            .getPublicUrl(fileName);
            
          uploadedFileUrls.push(publicUrlData.publicUrl);
        }

        // 2. Insert robust record into Supabase Database ('reports' table)
        const { error: dbError } = await supabase
          .from('reports')
          .insert([
            {
              name,
              contact: contact || null,
              state: state || null,
              area: area || null,
              exact_location: location,
              latitude: coordinates?.lat || null,
              longitude: coordinates?.lng || null,
              site_type: siteType || null,
              severity: severity || null,
              category: category || null,
              notes: notes || null,
              photos: uploadedFileUrls,
            }
          ]);

        if (dbError) throw dbError;
      }

      alert("Report successfully submitted to the server! Authorities have been flagged.");
      
      // Clear the form
      setName("");
      setContact("");
      setState("");
      setArea("");
      setLocation("");
      setNotes("");
      setSiteType("");
      setSeverity("");
      setCategory("");
      setPhotos([]);
      setCoordinates(null);
      
    } catch (e: any) {
      console.error("Submission error:", e);
      alert(`Error submitting report: ${e.message || "Unknown error occurred"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-32 selection:bg-primary/20">
      <main className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Report an Issue</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Help keep the city clean by reporting urban infrastructure issues. 
            Drop a pin, snap a photo, and let the authorities know. No sign-up required.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: IDENTIFIER, LOCATION & DETAILS */}
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-8">
            <h2 className="font-semibold text-lg border-b pb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              Location & Details
            </h2>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex justify-between">
                <span>Your Name <span className="text-destructive">*</span></span>
              </label>
              <input 
                type="text" 
                placeholder="e.g. Aditi Sharma" 
                className="w-full bg-background border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Contact Info (New Feature) */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex justify-between">
                <span>Contact Info</span>
                <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-wider bg-muted px-2 py-0.5 rounded">Optional</span>
              </label>
              <input 
                type="text" 
                placeholder="Email or phone for resolving queries" 
                className="w-full bg-background border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            {/* State & Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">
                State & Zone <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="State" 
                  className="w-1/2 bg-background border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="District / Zone" 
                  className="w-1/2 bg-background border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
            </div>

            {/* Specific Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">
                Exact Location <span className="text-destructive">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Street name, landmark, etc." 
                className="w-full bg-background border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              
              {coordinates && (
                <div className="text-[11px] bg-primary/10 text-primary px-3 py-2 rounded-md font-medium mt-2 flex justify-between items-center">
                  <span>
                    {isGeocoding ? "Fetching address..." : `Selected Pin: ${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`}
                  </span>
                  <button onClick={() => setCoordinates(null)} className="underline hover:text-foreground transition-colors">Clear</button>
                </div>
              )}

              {!mapOpen ? (
                <button 
                  onClick={() => setMapOpen(true)}
                  className="flex items-center justify-center w-full gap-2 py-2 mt-3 border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  {coordinates ? "Adjust Pin on Map" : "Select Coordinate on Map"}
                </button>
              ) : (
                <div className="mt-4 border rounded-md overflow-hidden relative shadow-sm" style={{ height: "300px" }}>
                  <Map
                    center={coordinates ? [coordinates.lng, coordinates.lat] : [77.5946, 12.9716]}
                    zoom={11}
                  >
                    <MapControls position="bottom-right" showZoom showCompass />
                    <MapClickCapture 
                      onCapture={handleMapClick} 
                    />
                    {coordinates && (
                      <MapMarker longitude={coordinates.lng} latitude={coordinates.lat}>
                          <div className="w-4 h-4 bg-primary rounded-full border-2 border-background shadow-md shadow-primary/30 animate-pulse" />
                      </MapMarker>
                    )}
                  </Map>
                  <div className="absolute top-2 left-2 right-2 bg-background/90 backdrop-blur-sm p-2 rounded text-xs text-center border font-medium z-10 shadow-sm">
                    Tap anywhere on the map to drop a pin
                  </div>
                  <button 
                    onClick={() => setMapOpen(false)}
                    className="absolute bottom-4 left-4 bg-foreground text-background px-4 py-2 rounded-md text-xs font-bold shadow-md z-10 hover:opacity-90 transition-opacity"
                  >
                    Confirm Pin
                  </button>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2 pt-6 border-t mt-6">
              <label className="text-sm font-medium flex justify-between items-center">
                <span>Additional Notes</span>
                <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-wider bg-muted px-2 py-0.5 rounded">Optional</span>
              </label>
              <textarea 
                rows={4}
                placeholder="Describe dimensions, smell, duration, public hazard..." 
                className="w-full bg-background border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-y"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: CLASSIFICATION & MEDIA */}
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-8">
            <h2 className="font-semibold text-lg border-b pb-4 flex items-center gap-2">
              <TriangleAlert className="w-5 h-5 text-muted-foreground" />
              Issue Classification
            </h2>

            {/* Type of Site */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex justify-between items-center">
                <span>Type of Site</span>
                <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-wider bg-muted px-2 py-0.5 rounded">Optional</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SITE_TYPES.map(type => (
                  <button 
                    key={type}
                    onClick={() => setSiteType(type)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${
                      siteType === type 
                        ? "bg-primary text-primary-foreground border-primary shadow-sm flex-shrink-0" 
                        : "bg-background text-muted-foreground hover:bg-muted flex-shrink-0"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex justify-between items-center">
                <span>Severity</span>
                <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-wider bg-muted px-2 py-0.5 rounded">Optional</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SEVERITY_LEVELS.map(level => (
                  <button 
                    key={level}
                    onClick={() => setSeverity(level)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md border transition-all ${
                      severity === level 
                        ? "bg-destructive text-destructive-foreground border-destructive shadow-sm flex-shrink-0" 
                        : "bg-background text-muted-foreground hover:bg-muted flex-shrink-0"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Garbage Category */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex justify-between items-center">
                <span>Category</span>
                <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-wider bg-muted px-2 py-0.5 rounded">Optional</span>
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {CATEGORIES.map(cat => {
                  const isSelected = category === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                        isSelected 
                          ? "bg-primary/10 border-primary text-foreground shadow-sm ring-1 ring-primary"
                          : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={isSelected ? 2 : 1.5} />
                      <span className="text-xs font-medium text-center leading-tight">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-2 pt-6 border-t mt-6">
              <label className="text-sm font-medium flex justify-between items-center">
                <span>Photographic Evidence <span className="text-destructive text-sm ml-1">*</span></span>
              </label>
              <label className="w-full min-h-44 bg-muted/30 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-3 hover:bg-muted/80 transition-all cursor-pointer group overflow-hidden relative p-4">
                <input 
                  type="file" 
                  multiple 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setPhotos(Array.from(e.target.files).slice(0, 6)); // up to 6 photos
                    }
                  }}
                />
                
                {photos.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {photos.map((file, index) => (
                      <div key={index} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-medium truncate max-w-[120px]">
                        {file.name}
                      </div>
                    ))}
                    <div className="text-xs text-muted-foreground hover:text-foreground mt-2 w-full text-center">
                      Tap anywhere to change photos ({photos.length}/6 selected)
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3 bg-background rounded-full border shadow-sm group-hover:scale-105 transition-transform">
                      <Camera className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Click to upload or drag photos</p>
                      <p className="text-xs text-muted-foreground mt-1">Up to 6 images (JPG, PNG, WEBP)</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>
          
          {/* SUBMIT SECTION */}
          <div className="lg:col-span-2 pt-4 flex flex-col items-center justify-center mt-2 mb-8">
             <button 
               onClick={handleSubmit}
               disabled={isSubmitting}
               className="bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-primary-foreground font-bold px-12 py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] w-full max-w-sm text-lg"
             >
               {isSubmitting ? "Submitting..." : "Submit Report"}
             </button>
             <div className="text-xs text-muted-foreground text-center mt-4">
               <p className="font-medium text-foreground">Submit Anonymously</p>
               <p className="mt-1">Your report will be public on the map but contact details stay private.</p>
             </div>
          </div>

          {/* BOTTOM: EXTERNAL GOVT LINKS */}
          <div className="lg:col-span-2 pt-8 mt-4 border-t border-border focus:outline-none">
             <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
               <Building className="w-5 h-5 text-muted-foreground" />
               Official Govt Grievance Portals
             </h3>
             <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
               If your issue relates to major administrative negligence, consider directly filing a grievance on these official national or state portals for legal escalation.
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <a href="https://pgportal.gov.in/" target="_blank" rel="noreferrer" className="block p-4 rounded-xl border bg-card hover:bg-muted transition-colors relative group">
                 <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                 <h4 className="font-medium text-sm">CPGRAMS (National)</h4>
                 <p className="text-xs text-muted-foreground mt-2 text-balance leading-relaxed">Centralized Public Grievance Redress and Monitoring System.</p>
               </a>
               <a href="https://swachhbharat.mygov.in/" target="_blank" rel="noreferrer" className="block p-4 rounded-xl border bg-card hover:bg-muted transition-colors relative group">
                 <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                 <h4 className="font-medium text-sm">Swachh Bharat</h4>
                 <p className="text-xs text-muted-foreground mt-2 text-balance leading-relaxed">For solid waste management and sanitation complaints.</p>
               </a>
               <a href="https://sahaaya.bbmpgov.in/" target="_blank" rel="noreferrer" className="block p-4 rounded-xl border bg-card hover:bg-muted transition-colors relative group">
                 <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                 <h4 className="font-medium text-sm">BBMP Sahaaya</h4>
                 <p className="text-xs text-muted-foreground mt-2 text-balance leading-relaxed">Bangalore local municipality infrastructure issue reporting.</p>
               </a>
               <a href="https://ipgrs.karnataka.gov.in/" target="_blank" rel="noreferrer" className="block p-4 rounded-xl border bg-card hover:bg-muted transition-colors relative group">
                 <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                 <h4 className="font-medium text-sm">Karnataka e-Spandana</h4>
                 <p className="text-xs text-muted-foreground mt-2 text-balance leading-relaxed">State-level integrated grievance redressal system.</p>
               </a>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
