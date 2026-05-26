export function TrustBar() {
  const items = [
    { title: "0% Commission", desc: "Buy your dream car without any extra fees." },
    { title: "No Hidden Charges", desc: "What you see is what you pay." },
    { title: "Quality Assured", desc: "Every car is verified for quality and performance." },
    { title: "Hassle Free Process", desc: "Smooth and transparent from start to finish." },
  ];
  return (
    <div className="container-page mt-16">
      <div className="surface grid gap-6 md:grid-cols-4 p-6">
        {items.map((i) => (
          <div key={i.title} className="flex gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full border border-primary/40 grid place-items-center text-primary">★</div>
            <div>
              <div className="font-semibold text-sm">{i.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{i.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
