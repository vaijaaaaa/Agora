"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Plus } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="pointer-events-auto flex h-14 w-full max-w-4xl items-center justify-between rounded-full border border-border/50 bg-background/60 px-6 backdrop-blur-lg shadow-sm">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Agora
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link 
            href="/" 
            className={`transition-colors hover:text-foreground ${pathname === "/" ? "text-foreground" : "text-muted-foreground"}`}
          >
            Feed
          </Link>
          <Link 
            href="/report" 
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-colors ${
              pathname === "/report" 
                ? "bg-primary text-primary-foreground font-semibold" 
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            <Plus className="h-4 w-4" />
            Report
          </Link>
        </nav>
      </header>
    </div>
  );
}
