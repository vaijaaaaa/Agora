"use client";

import { useState } from "react";
import { 
  MapPin, 
  ImagePlus, 
  Flame, 
  Stethoscope, 
  Droplet, 
  TriangleAlert, 
  Dog, 
  Recycle, 
  Trash2, 
  Construction,
  Building,
  UploadCloud
} from "lucide-react";
import { bangaloreMlas } from "@/lib/bangalore-mlas";

export default function ReportPage() {
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [siteType, setSiteType] = useState<string>("");
  const [severity, setSeverity] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectedMla, setSelectedMla] = useState<string>("");
  const [notes, setNotes] = useState("");

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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16">
          {/* LEFT COLUMN: IDENTIFIER AND LOCATION */}
          <div className="space-y-8">
            <div className="bg-card border rounded-xl p-6 shadow-sm space-y-8">
              <h2 className="font-semibold text-lg border-b pb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                Location Details
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
                <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors mt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Select on Map
                </button>
              </div>

              {/* Notify MLA */}
              <div className="space-y-3 pt-6 border-t mt-6">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Notify Local Representative</span>
                  <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-wider bg-muted px-2 py-0.5 rounded">Optional</span>
                </label>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Automatically forward this report to the respective ward authority taking charge.
                </p>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <select 
                    className="w-full bg-background border border-border focus:border-ring focus:ring-2 focus:ring-ring/20 rounded-md py-2 pl-9 pr-4 text-sm appearance-none outline-none transition-all cursor-pointer"
                    value={selectedMla}
                    onChange={(e) => setSelectedMla(e.target.value)}
                  >
                    <option value="" disabled>Select Constituency / Authority</option>
                    {bangaloreMlas.map(mla => (
                      <option key={mla.name} value={mla.name}>
                        {mla.constituency} — {mla.name} ({mla.party})
                      </option>
                    ))}
                    <option value="bbmp">General Civic Body (BBMP)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CLASSIFICATION */}
          <div className="space-y-8">
            <div className="bg-card border rounded-xl p-6 shadow-sm space-y-8">
              <h2 className="font-semibold text-lg border-b pb-4 flex items-center gap-2">
                <TriangleAlert className="w-5 h-5 text-muted-foreground" />
                Issue Details
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
                          ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                          : "bg-background text-muted-foreground hover:bg-muted"
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
                          ? "bg-destructive text-destructive-foreground border-destructive shadow-sm" 
                          : "bg-background text-muted-foreground hover:bg-muted"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
               {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex justify-between items-center">
                  <span>Additional Notes</span>
                  <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-wider bg-muted px-2 py-0.5 rounded">Optional</span>
                </label>
                <textarea 
                  rows={3}
                  placeholder="Describe dimensions, smell, duration, public hazard..." 
                  className="w-full bg-background border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-y"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Photos */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  Photos <span className="text-destructive text-lg leading-none">*</span>
                </label>
                <div className="w-full h-36 bg-muted/50 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/80 transition-all cursor-pointer group">
                  <div className="p-3 bg-background rounded-full border shadow-sm group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Click to upload or drag photos</p>
                    <p className="text-xs text-muted-foreground mt-1">Up to 6 images (JPG, PNG, WEBP)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="text-xs text-muted-foreground max-w-xs">
                 <p className="font-medium text-foreground">Submit Anonymously</p>
                 <p className="mt-1">Your report will be public on the map but contact details stay private.</p>
               </div>
               <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg shadow-sm transition-all active:scale-[0.98]">
                 Submit Report
               </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
