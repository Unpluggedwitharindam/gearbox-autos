import { Link } from "@tanstack/react-router";
import { ArrowRight, Car } from "lucide-react";
import type { Car as CarType } from "@/lib/cars";

export function CarCard({ car }: { car: CarType }) {
  return (
    <div className="surface overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-secondary/40">
        <span className="absolute top-3 left-3 z-10 rounded-md bg-background/80 backdrop-blur px-2 py-1 text-xs font-semibold">{car.price}</span>
        <img src={car.image} alt={car.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="p-5 flex-1 flex flex-col gap-4">
        <h3 className="text-lg font-semibold">{car.name}</h3>
        <div className="grid grid-cols-4 gap-2 text-[11px] text-muted-foreground">
          <div><div className="text-foreground font-medium">{car.year}</div>Year</div>
          <div><div className="text-foreground font-medium">{car.km}</div>KMs</div>
          <div><div className="text-foreground font-medium">{car.rto}</div>RTO</div>
          <div><div className="text-foreground font-medium">{car.location}</div>Location</div>
        </div>
        <Link to="/car/$id" params={{ id: car.id }} className="mt-auto flex items-center justify-between rounded-md border border-border/70 px-4 py-3 text-sm hover:bg-card transition">
          <span className="flex items-center gap-2"><Car className="h-4 w-4 text-primary" /> Book a Test Drive</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
