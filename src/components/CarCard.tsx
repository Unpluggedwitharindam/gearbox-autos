import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Car as CarType } from "@/lib/cars";
import { CarImageCarousel } from "@/components/CarImageCarousel";
import { ShareButton } from "@/components/ShareButton";

export function CarCard({ car }: { car: CarType }) {
  const imgs = (car.images && car.images.length > 0) ? car.images : (car.image ? [car.image] : []);
  return (
    <div className="bg-card group overflow-hidden border border-transparent hover:border-border transition-all flex flex-col">
      <div className="relative">
        <div className="absolute top-4 right-4 z-20">
          <ShareButton compact title={car.name} text={`Check out this ${car.name} on Gearbox Autos`} path={`/car/${car.slug}`} />
        </div>
        <CarImageCarousel images={imgs} alt={car.name} />
        <div className="absolute bottom-0 left-0 z-20 bg-primary text-primary-foreground px-3 py-1 font-head text-sm tracking-widest">
          {car.price}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 gap-3">
          <div>
            <h3 className="font-head text-2xl leading-none mb-1">{car.name}</h3>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              {car.transmission} • {car.fuel}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-head text-2xl text-primary leading-none">{car.price}</div>
            <div className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Asking Price</div>
          </div>
        </div>
        <div className="grid grid-cols-4 border-t border-border pt-4">
          <Spec label="Year" value={String(car.year)} />
          <Spec label="KM" value={car.km} border />
          <Spec label="RTO" value={car.rto} border />
          <Spec label="Location" value={car.location} />
        </div>
        <Link
          to="/car/$id"
          params={{ id: car.slug }}
          className="mt-5 flex items-center justify-between border border-border px-4 py-3 font-head text-lg tracking-wide hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
        >
          Book a Test Drive
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Spec({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div className={`text-center px-1 ${border ? "border-l border-border" : ""}`}>
      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{label}</div>
      <div className="text-sm font-semibold truncate">{value}</div>
    </div>
  );
}
