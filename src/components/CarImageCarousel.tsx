import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CarImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const list = images.length > 0 ? images : [""];
  const n = list.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);

  return (
    <div className="relative rounded-lg overflow-hidden bg-secondary/40 aspect-[4/3]">
      {list[i] ? (
        <img src={list[i]} alt={`${alt} - ${i + 1}`} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">No image</div>
      )}

      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/70 backdrop-blur border border-border/60 grid place-items-center hover:bg-background transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/70 backdrop-blur border border-border/60 grid place-items-center hover:bg-background transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {list.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to image ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-primary" : "w-1.5 bg-foreground/40 hover:bg-foreground/70"}`}
              />
            ))}
          </div>

          <div className="absolute top-3 right-3 text-xs bg-background/70 backdrop-blur border border-border/60 rounded-full px-2.5 py-1">
            {i + 1} / {n}
          </div>
        </>
      )}
    </div>
  );
}
