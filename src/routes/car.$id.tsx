import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, User, Phone, MapPin, Car as CarIcon, ShieldCheck, Calendar, Gauge, FileText, Fuel, Settings2, Tv, AirVent, Disc, Radar, Wind, CircleDot } from "lucide-react";
import { cars } from "@/lib/cars";

export const Route = createFileRoute("/car/$id")({
  head: ({ params }) => ({ meta: [{ title: `${cars.find(c => c.id === params.id)?.name ?? "Car"} — Gearbox Autos` }] }),
  component: CarDetail,
  notFoundComponent: () => <div className="container-page pt-32"><p>Car not found.</p></div>,
});

const featureIcons: Record<string, any> = {
  "Touchscreen Infotainment": Tv,
  "Dual Airbags": ShieldCheck,
  "ABS with EBD": Disc,
  "Rear Parking Sensors": Radar,
  "Automatic Climate Control": Wind,
  "Alloy Wheels": CircleDot,
};

function CarDetail() {
  const { id } = Route.useParams();
  const car = cars.find((c) => c.id === id);
  if (!car) throw notFound();
  const features = car.features ?? ["Touchscreen Infotainment", "Dual Airbags", "ABS with EBD", "Rear Parking Sensors", "Automatic Climate Control", "Alloy Wheels"];

  return (
    <section className="container-page pt-32 pb-12">
      <Link to="/buy" className="text-sm text-muted-foreground inline-flex items-center gap-2 hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to Inventory</Link>

      <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
        <div className="surface p-6">
          <div className="rounded-lg overflow-hidden bg-secondary/40 aspect-[4/3]">
            <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[car.image, car.image, car.image, car.image].map((src, i) => (
              <div key={i} className={`aspect-[4/3] rounded-md overflow-hidden border ${i === 0 ? "border-primary" : "border-border"}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-bold mt-6">{car.name}</h1>
          <div className="text-primary text-2xl font-semibold mt-2">{car.price}</div>

          <div className="mt-5 grid grid-cols-3 md:grid-cols-6 gap-4 text-xs border-t border-border pt-5">
            {[
              { Icon: Calendar, v: car.year, l: "Year of Reg." },
              { Icon: Gauge, v: car.km, l: "KMs Driven" },
              { Icon: FileText, v: car.rto, l: "RTO" },
              { Icon: MapPin, v: car.location, l: "Location" },
              { Icon: Fuel, v: car.fuel, l: "Fuel Type" },
              { Icon: Settings2, v: car.transmission, l: "Transmission" },
            ].map((s, i) => (
              <div key={i}><s.Icon className="h-4 w-4 text-primary mb-1" /><div className="font-medium text-foreground">{s.v}</div><div className="text-muted-foreground">{s.l}</div></div>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="font-semibold mb-4">Key Features</div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-xs text-center">
              {features.map((f) => {
                const I = featureIcons[f] ?? AirVent;
                return (
                  <div key={f} className="flex flex-col items-center gap-2">
                    <I className="h-6 w-6 text-foreground/80" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="surface p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-md border border-primary/40 grid place-items-center text-primary"><Calendar className="h-5 w-5" /></div>
            <div>
              <h2 className="text-xl font-semibold">Book a Test Drive</h2>
              <p className="text-sm text-muted-foreground">Fill in your details and our team will get in touch with you to confirm your test drive.</p>
            </div>
          </div>
          {[
            { Icon: User, p: "Enter your full name", l: "Full Name" },
            { Icon: Phone, p: "Enter your 10 digit mobile number", l: "Phone Number" },
            { Icon: MapPin, p: "Enter your city", l: "City" },
          ].map((f) => (
            <label key={f.l} className="block">
              <div className="text-sm mb-1.5">{f.l}</div>
              <div className="flex items-center gap-2 rounded-md bg-input/60 border border-border/60 px-3 py-2.5">
                <f.Icon className="h-4 w-4 text-muted-foreground" />
                <input placeholder={f.p} className="bg-transparent outline-none text-sm flex-1" />
              </div>
            </label>
          ))}
          <label className="block">
            <div className="text-sm mb-1.5">Which car are you looking to buy?</div>
            <div className="flex items-center gap-2 rounded-md bg-input/60 border border-border/60 px-3 py-2.5">
              <CarIcon className="h-4 w-4 text-muted-foreground" />
              <select className="bg-transparent outline-none text-sm flex-1" defaultValue={car.id}>
                {cars.map((c) => <option key={c.id} value={c.id} className="bg-background">{c.name}</option>)}
              </select>
            </div>
          </label>

          <div className="surface p-4 text-sm">
            <div className="font-semibold flex items-center gap-2 mb-2"><ShieldCheck className="h-4 w-4 text-primary" /> Why Book a Test Drive with Gearbox Autos?</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>✓ No obligation, completely free</li>
              <li>✓ Experience the car before you decide</li>
              <li>✓ Expert assistance and guidance</li>
            </ul>
          </div>

          <button className="btn-primary w-full rounded-md py-3 font-semibold flex items-center justify-center gap-2">Submit Request <ArrowRight className="h-4 w-4" /></button>
          <p className="text-xs text-muted-foreground text-center">🔒 Your information is safe with us and will never be shared.</p>
        </form>
      </div>
    </section>
  );
}
