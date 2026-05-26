export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <svg viewBox="0 0 220 30" className="h-3 w-32 -mb-1 text-foreground/60" fill="none" aria-hidden>
        <path d="M5 25 C 40 2, 180 2, 215 25" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="font-bold tracking-tight text-foreground text-lg">
        Gear<span className="font-extrabold">BOX</span>
      </span>
      <span className="text-[0.95rem] tracking-[0.18em] text-foreground/70 -mt-0.5">
        AUTOS<span className="text-primary">.</span>
      </span>
    </div>
  );
}
