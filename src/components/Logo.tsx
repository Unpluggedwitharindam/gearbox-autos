import logo from "@/assets/gearbox-logo.png.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Gearbox Autos"
      className={`h-9 w-auto object-contain ${className}`}
      loading="eager"
    />
  );
}
