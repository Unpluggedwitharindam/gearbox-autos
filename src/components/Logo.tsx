export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-head text-3xl tracking-wider leading-none text-foreground ${className}`}>
      GEARBOX <span className="text-primary">AUTOS</span>
    </span>
  );
}
