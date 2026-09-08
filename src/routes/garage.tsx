import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowUp,
  Car,
  Mic,
  Paperclip,
  PlayCircle,
  Repeat,
  ShieldCheck,
  Tag,
  Users,
  X,
} from "lucide-react";

export const Route = createFileRoute("/garage")({
  head: () => ({
    meta: [
      { title: "Gearbox Garage — Ask. Drive. Decide. | Gearbox Autos" },
      {
        name: "description",
        content:
          "Gearbox Garage is India's car knowledge space — ask about buying, selling or comparing cars and get a clear Gearbox verdict with price, condition and risk scores.",
      },
      { property: "og:title", content: "Gearbox Garage — Ask. Drive. Decide." },
      {
        property: "og:description",
        content:
          "Real questions. Real answers. India's most trusted car knowledge space, by Gearbox Autos Jamshedpur.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://gearboxautos.in/garage" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gearboxautos.in/garage" }],
  }),
  component: GaragePage,
});

type Mode = "buy" | "sell" | "compare";

const MODES: { id: Mode; label: string; icon: typeof Car; placeholder: string }[] = [
  { id: "buy", label: "Buying a Car", icon: Car, placeholder: "Ask anything about a car..." },
  { id: "sell", label: "Selling a Car", icon: Tag, placeholder: "How much should I sell my car for..." },
  { id: "compare", label: "Compare Cars", icon: Repeat, placeholder: "Which two cars should I compare..." },
];

const CHIPS: Record<Mode, string[]> = {
  buy: [
    "Is ₹8.5 lakh a fair price for a 2020 Creta?",
    "What is my car worth?",
    "Should I buy a diesel in 2026?",
    "Compare City vs Verna",
    "How to sell my car for the best price?",
  ],
  sell: [
    "What is my 2018 Swift worth today?",
    "Best month to sell a car in India?",
    "Should I sell privately or to a dealer?",
    "How do I transfer the RC quickly?",
  ],
  compare: [
    "Compare City vs Verna",
    "Creta or Seltos for city driving?",
    "Nexon petrol vs Punch petrol",
    "Fortuner vs Endeavour resale value",
  ],
};

const VIDEOS = [
  { title: "Used Car Inspection Checklist", lines: ["PRE-OWNED CAR", "INSPECTION", "CHECKLIST"], time: "12:34", views: "12K views", age: "3 days ago", tone: "from-[#1b1f24] to-[#3a4148]" },
  { title: "Diesel vs Petrol — Which One Should You Buy?", lines: ["DIESEL OR PETROL?", "WHICH ONE SHOULD YOU BUY?"], time: "8:21", views: "18K views", age: "5 days ago", tone: "from-[#8fb6d6] to-[#dfe8ef]" },
  { title: "Real Car Case — Good Deal or Trap?", lines: ["REAL CAR CASE", "GOOD DEAL OR TRAP?"], time: "10:02", views: "9.4K views", age: "7 days ago", tone: "from-[#20242a] to-[#4a5158]" },
  { title: "Mercedes C250d — Full Review", lines: ["MERCEDES C250d", "FULL REVIEW"], time: "14:26", views: "22K views", age: "10 days ago", tone: "from-[#0d1013] to-[#343a41]" },
  { title: "How to Sell Your Car for the Best Price", lines: ["HOW TO", "SELL YOUR CAR", "FOR THE BEST PRICE"], time: "9:18", views: "11K views", age: "2 weeks ago", tone: "from-[#161a1e] to-[#464d55]" },
];

const FILTERS = ["Latest", "Buying Tips", "Car Reviews", "Inspection"];

function SteeringWheel({ angle }: { angle: number }) {
  return (
    <motion.svg
      viewBox="0 0 240 240"
      className="h-56 w-56 md:h-64 md:w-64 drop-shadow-[0_28px_40px_rgba(14,18,23,0.22)]"
      animate={{ rotate: angle }}
      transition={{ type: "spring", stiffness: 90, damping: 12 }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="rim" cx="35%" cy="25%">
          <stop offset="0%" stopColor="#4a4f55" />
          <stop offset="60%" stopColor="#22262b" />
          <stop offset="100%" stopColor="#0c0e11" />
        </radialGradient>
        <linearGradient id="spoke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b4046" />
          <stop offset="100%" stopColor="#15181c" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="108" fill="none" stroke="url(#rim)" strokeWidth="24" />
      <circle cx="120" cy="120" r="118" fill="none" stroke="#000" strokeOpacity="0.15" strokeWidth="2" />
      <circle cx="120" cy="120" r="96" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="2" />
      {/* thumb grips */}
      <rect x="16" y="88" width="26" height="64" rx="13" fill="#2b3036" />
      <rect x="198" y="88" width="26" height="64" rx="13" fill="#2b3036" />
      {/* spokes */}
      <path d="M40 128 H200 V150 Q120 176 40 150 Z" fill="url(#spoke)" />
      <rect x="108" y="150" width="24" height="60" rx="10" fill="url(#spoke)" />
      {/* hub */}
      <ellipse cx="120" cy="140" rx="52" ry="34" fill="#1a1e22" />
      <ellipse cx="120" cy="138" rx="46" ry="29" fill="#23282e" />
      <g transform="translate(120 138)">
        <path d="M-16 -9 L2 -9 L-4 0 L10 0 L-10 12 L-5 1 L-18 1 Z" fill="#E5252F" />
      </g>
      <circle cx="86" cy="132" r="8" fill="#31363c" />
      <circle cx="154" cy="132" r="8" fill="#31363c" />
    </motion.svg>
  );
}

function Pedal({
  kind,
  onClick,
  pressed,
}: {
  kind: "clutch" | "brake" | "accel";
  onClick: () => void;
  pressed: boolean;
}) {
  const wide = kind === "brake";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      animate={{ scale: pressed ? 0.95 : 1, y: pressed ? 4 : 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`relative flex items-center justify-center rounded-[10px] bg-gradient-to-b from-[#d5d9dd] to-[#9ba2a9] shadow-[0_14px_22px_rgba(14,18,23,0.22),inset_0_1px_0_#ffffff] ring-1 ring-[#8b9298] ${
        wide ? "h-[72px] w-[76px]" : "h-[86px] w-[62px]"
      }`}
      aria-label={kind}
    >
      {kind === "brake" ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-[#2b3036] text-[15px] font-bold text-[#2b3036]">
          !
        </span>
      ) : (
        <span className={`flex ${kind === "clutch" ? "flex-col gap-[7px]" : "flex-row gap-[7px]"}`}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`rounded-full bg-[#3a4046] ${kind === "clutch" ? "h-[5px] w-9" : "h-11 w-[5px]"}`}
            />
          ))}
        </span>
      )}
    </motion.button>
  );
}

function GaragePage() {
  const [mode, setMode] = useState<Mode>("buy");
  const [angle, setAngle] = useState(0);
  const [pressed, setPressed] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [verdict, setVerdict] = useState<string | null>(null);
  const [filter, setFilter] = useState("Latest");
  const inputRef = useRef<HTMLInputElement>(null);

  const press = (k: string) => {
    setPressed(k);
    window.setTimeout(() => setPressed(null), 240);
  };

  const onClutch = () => {
    press("clutch");
    setAngle(-15);
    setMode("sell");
  };
  const onBrake = () => {
    press("brake");
    setAngle(0);
    setQuery("");
    setVerdict(null);
  };
  const onAccel = () => {
    press("accel");
    setAngle(15);
    setMode("buy");
    window.setTimeout(() => inputRef.current?.focus(), 120);
  };

  const submit = (text?: string) => {
    const q = (text ?? query).trim();
    if (!q) return;
    setQuery(q);
    setVerdict(q);
  };

  const active = MODES.find((m) => m.id === mode)!;

  return (
    <div className="min-h-screen bg-white text-[#0E1217]" style={{ fontFamily: "Inter, Montserrat, sans-serif" }}>
      <div className="mx-auto flex max-w-[1500px] flex-col lg:flex-row">
        {/* LEFT RAIL */}
        <aside className="w-full shrink-0 border-b border-[#ECEEF1] px-5 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-[22%] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[17px] font-bold">
              <PlayCircle className="h-6 w-6" strokeWidth={1.8} />
              Videos
            </h2>
            <button className="text-[12px] font-medium text-[#6B737C] hover:text-[#0E1217]">See all →</button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
                  filter === f
                    ? "bg-[#0E1217] text-white"
                    : "border border-[#ECEEF1] bg-white text-[#4A525A] hover:border-[#d8dce0]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-5">
            {VIDEOS.map((v) => (
              <article key={v.title} className="group cursor-pointer">
                <div className={`relative aspect-video overflow-hidden rounded-[10px] bg-gradient-to-br ${v.tone}`}>
                  <div className="absolute inset-0 flex flex-col justify-center gap-0.5 p-3">
                    {v.lines.map((l, i) => (
                      <span
                        key={l}
                        className="text-[13px] font-extrabold uppercase leading-tight tracking-tight"
                        style={{ color: i === 1 ? "#F5B301" : "#ffffff", textShadow: "0 2px 6px rgba(0,0,0,.5)" }}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {v.time}
                  </span>
                </div>
                <h3 className="mt-2 text-[13.5px] font-semibold leading-snug group-hover:text-[#E5252F]">
                  {v.title}
                </h3>
                <p className="mt-1 text-[11.5px] text-[#8A9199]">
                  Gearbox Autos · {v.views} · {v.age}
                </p>
              </article>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <main className="relative flex-1 px-6 py-10 md:px-12 lg:py-14">
          <span
            className="pointer-events-none absolute right-6 top-8 hidden text-[22px] leading-tight text-[#B9C0C7] md:block"
            style={{ fontFamily: "Caveat, cursive", transform: "rotate(8deg)" }}
          >
            Better<br />Cars<br />Brighter<br />People
          </span>

          <div className="mx-auto max-w-[900px]">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-[#ECEEF1]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8A9199]">
                Gearbox Garage
              </p>
              <span className="h-px w-16 bg-[#ECEEF1]" />
            </div>

            <h1 className="mt-4 text-center text-[42px] font-extrabold tracking-tight md:text-[54px]">
              Ask. Drive. Decide.
            </h1>
            <p className="mt-3 text-center text-[16px] text-[#4A525A] md:text-[18px]">
              Real questions. Real answers. India’s most trusted car knowledge space.
            </p>

            {/* WHEEL */}
            <div className="mt-8 flex justify-center">
              <SteeringWheel angle={angle} />
            </div>

            {/* PEDALS */}
            <div className="relative mt-6 flex items-end justify-center gap-8 md:gap-14">
              <span
                className="pointer-events-none absolute left-0 top-0 hidden text-[19px] leading-tight text-[#9AA2AA] lg:block"
                style={{ fontFamily: "Caveat, cursive", transform: "rotate(-6deg)" }}
              >
                Change<br />Mode ↘
              </span>
              <span
                className="pointer-events-none absolute right-0 top-0 hidden text-[19px] leading-tight text-[#9AA2AA] lg:block"
                style={{ fontFamily: "Caveat, cursive", transform: "rotate(6deg)" }}
              >
                Get<br />Answers ↙
              </span>

              {[
                { k: "clutch" as const, t: "Clutch", s: "Change Mode", fn: onClutch },
                { k: "brake" as const, t: "Brake", s: "Refine / Stop", fn: onBrake },
                { k: "accel" as const, t: "Accelerator", s: "Ask / Go", fn: onAccel },
              ].map((p) => (
                <div key={p.k} className="flex flex-col items-center">
                  <Pedal kind={p.k} onClick={p.fn} pressed={pressed === p.k} />
                  <span className="mt-3 text-[14px] font-semibold">{p.t}</span>
                  <span className="text-[12.5px] text-[#8A9199]">{p.s}</span>
                </div>
              ))}
            </div>

            {/* MODE SELECTOR */}
            <div className="mt-10 flex justify-center">
              <div className="flex w-full max-w-[680px] items-center justify-between gap-1 rounded-full border border-[#ECEEF1] bg-white p-1.5 shadow-[0_6px_20px_rgba(14,18,23,0.05)]">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const on = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-[14px] font-medium transition-colors ${
                        on ? "bg-[#FFF0F1] text-[#E5252F]" : "bg-white text-[#4A525A] hover:bg-[#F7F8F9]"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PROMPT */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="mt-6 flex items-center gap-3 rounded-full border border-[#ECEEF1] bg-white px-4 py-3 shadow-[0_10px_30px_rgba(14,18,23,0.07)]"
            >
              <button type="button" aria-label="Attach" className="p-1.5 text-[#8A9199] hover:text-[#0E1217]">
                <Paperclip className="h-5 w-5" strokeWidth={1.7} />
              </button>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={active.placeholder}
                className="flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#9AA2AA]"
              />
              <button type="button" aria-label="Voice" className="p-1.5 text-[#8A9199] hover:text-[#0E1217]">
                <Mic className="h-5 w-5" strokeWidth={1.7} />
              </button>
              <button
                type="submit"
                aria-label="Send"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDEFF1] text-[#6B737C] transition-colors hover:bg-[#E5252F] hover:text-white"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </form>

            {/* CHIPS */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-[#8A9199]">Try asking:</span>
              {CHIPS[mode].map((c) => (
                <button
                  key={c}
                  onClick={() => submit(c)}
                  className="rounded-full border border-[#ECEEF1] bg-white px-3.5 py-2 text-[12.5px] text-[#4A525A] transition-colors hover:border-[#E5252F] hover:text-[#E5252F]"
                >
                  {c}
                </button>
              ))}
            </div>

            {/* VERDICT */}
            <AnimatePresence>
              {verdict && (
                <motion.section
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="mt-8 overflow-hidden"
                >
                  <div className="rounded-2xl border border-[#ECEEF1] bg-white p-6 shadow-[0_12px_40px_rgba(14,18,23,0.06)]">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[15px] font-semibold">{verdict}</p>
                      <button
                        onClick={() => setVerdict(null)}
                        className="flex items-center gap-1 text-[12px] text-[#8A9199] hover:text-[#0E1217]"
                      >
                        <X className="h-4 w-4" /> Close
                      </button>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[#F2F4F6] pt-5">
                      <span className="rounded-full bg-[#FFF0F1] px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#E5252F]">
                        Gearbox Verdict
                      </span>
                      <span className="text-[26px] font-extrabold tracking-tight">
                        82 <span className="text-[#9AA2AA]">/ 100</span>
                        <span className="ml-2 text-[15px] font-medium text-[#4A525A]">• Worth considering</span>
                      </span>
                      <span className="ml-auto text-[14px] text-[#4A525A]">
                        Recommended buying range{" "}
                        <strong className="text-[#0E1217]">₹11.6–12.1L</strong>
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {[
                        { l: "Price Score", v: "86", t: "Good" },
                        { l: "Condition Score", v: "84", t: "Good" },
                        { l: "Risk Factor", v: "76", t: "Verify" },
                      ].map((m) => (
                        <div key={m.l} className="rounded-xl border border-[#ECEEF1] px-4 py-3">
                          <p className="text-[11.5px] uppercase tracking-wide text-[#8A9199]">{m.l}</p>
                          <p className="mt-1 text-[19px] font-bold">
                            {m.v} <span className="text-[13px] font-medium text-[#4A525A]">· {m.t}</span>
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="mt-5 text-[14.5px] leading-relaxed text-[#4A525A]">
                      At this price the car sits slightly under the Jamshedpur market average for a well-kept
                      example, so the deal is workable if the paperwork is clean. Insist on an OBD-II diagnostic
                      scan before payment — stored engine and airbag codes are the most common hidden cost on cars
                      of this age. Check the steering rack for play and listen for a knock over speed breakers, as
                      rack replacement is expensive. Confirm the RC transfer, insurance history and pending
                      challans in writing, and budget roughly ₹18,000–24,000 for a fresh set of tyres if the
                      current ones are past four years old.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="rounded-full bg-[#0E1217] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#22272d]">
                        Ask a follow-up
                      </button>
                      <button className="rounded-full border border-[#ECEEF1] px-5 py-2.5 text-[13px] font-semibold text-[#4A525A] hover:border-[#d8dce0]">
                        View calculation
                      </button>
                      <button className="rounded-full border border-[#ECEEF1] px-5 py-2.5 text-[13px] font-semibold text-[#4A525A] hover:border-[#d8dce0]">
                        Share verdict
                      </button>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* STATS */}
            <div className="relative mt-14 flex flex-wrap items-center gap-10 border-t border-[#ECEEF1] pt-8">
              {[
                { Icon: Users, v: "12K+", l: "Questions answered" },
                { Icon: ShieldCheck, v: "50+", l: "Auto experts" },
                { Icon: Users, v: "1.8K+", l: "Active members" },
              ].map((s) => (
                <div key={s.l} className="flex items-center gap-3">
                  <s.Icon className="h-6 w-6 text-[#6B737C]" strokeWidth={1.4} />
                  <div>
                    <p className="text-[15px] font-bold">{s.v}</p>
                    <p className="text-[12.5px] text-[#8A9199]">{s.l}</p>
                  </div>
                </div>
              ))}
              <span
                className="ml-auto hidden text-[24px] text-[#B9C0C7] md:block"
                style={{ fontFamily: "Caveat, cursive", transform: "rotate(-6deg)" }}
              >
                Drive Smarter
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
