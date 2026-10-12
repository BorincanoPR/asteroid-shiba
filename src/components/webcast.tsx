import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
  ASCENT_END,
  COUNT_FROM,
  formatClock,
  formatKm,
  formatVel,
  phaseLabel,
  sampleAscent,
} from "@/lib/ascent";
import { RocketChart, type ChartPoint } from "@/components/rocket-chart";

const RATES = [1, 4, 8] as const;

export function Webcast() {
  const [missionT, setMissionT] = useState(COUNT_FROM);
  const [playing, setPlaying] = useState(true);
  const [rate, setRate] = useState<(typeof RATES)[number]>(8);
  const [chartOn, setChartOn] = useState(false);

  useEffect(() => {
    setChartOn(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setMissionT((t) => {
        if (t >= ASCENT_END) return t;
        const speed = t < 0 ? 1 : rate;
        return Math.min(ASCENT_END, t + 0.1 * speed);
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [playing, rate]);

  useEffect(() => {
    if (missionT >= ASCENT_END && playing) setPlaying(false);
  }, [missionT, playing]);

  const sample = sampleAscent(Math.max(0, missionT));
  const hot = missionT < 0 && missionT >= -10;
  const liftoff = missionT >= 0 && missionT < 40;

  const points = useMemo<ChartPoint[]>(() => {
    const end = Math.max(0, missionT);
    const rows: ChartPoint[] = [{ x: 0, y: 0 }];
    for (let t = 4; t < end; t += 4) {
      rows.push({ x: t, y: sampleAscent(t).alt });
    }
    if (end > 0) rows.push({ x: end, y: sampleAscent(end).alt });
    return rows;
  }, [missionT]);

  const yMax = Math.max(40, sample.alt * 1.28);
  const xMax = Math.max(80, Math.min(ASCENT_END, Math.max(0, missionT) * 1.18));

  return (
    <section id="transmision" className="relative">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-6 md:grid-cols-2 md:pt-10">
        <div className="order-2 md:order-1">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-sm tracking-widest text-frost uppercase">
              Simulación · Polaris Dawn
            </p>
            <p className="border border-signal/60 px-2 py-1 font-display text-xs tracking-widest text-signal">
              SIM
            </p>
          </div>
          <p className="mt-8 font-display text-sm tracking-widest text-steel uppercase">
            Indicador de cero g
          </p>
          <h1 className="mt-1 font-display text-6xl leading-none tracking-wide text-balance text-frost uppercase md:text-8xl">
            Asteroid Shiba
          </h1>
          <p
            className={`soon mt-6 font-display text-6xl leading-none tabular-nums text-signal md:text-8xl ${hot ? "countdown-hot" : ""}`}
            aria-label={formatClock(missionT)}
          >
            {formatClock(missionT)}
          </p>
          <p className="mt-3 font-display text-xl tracking-widest text-frost uppercase md:text-2xl">
            {liftoff && missionT < 8 ? "Despegue" : phaseLabel(missionT)}
          </p>
          <p className="mt-4 max-w-xl text-pretty text-steel">
            Orejas esponjosas, cola en el aire. No es un cachorro común: es el pionero que
            flotó en la Crew Dragon y volvió a la Tierra para acurrucarse de noche.
          </p>
        </div>
        <div className="hud relative order-1 border border-signal/50 bg-void md:order-2">
          <span className="pointer-events-none absolute top-0 left-0 size-5 border-t-2 border-l-2 border-signal" />
          <span className="pointer-events-none absolute top-0 right-0 size-5 border-t-2 border-r-2 border-signal" />
          <span className="pointer-events-none absolute bottom-0 left-0 size-5 border-b-2 border-l-2 border-signal" />
          <span className="pointer-events-none absolute right-0 bottom-0 size-5 border-r-2 border-b-2 border-signal" />
          <img
            src="/mission/helmet.jpg"
            alt="Asteroid, Shiba blanco con casco de burbuja y traje azul, flotando en el espacio"
            className="aspect-square w-full object-cover object-top"
          />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-4">
          <div className="grid grid-cols-3 gap-px border border-line bg-line">
            <Readout label="Altitud" value={`${formatKm(sample.alt)} km`} />
            <Readout label="Velocidad" value={`${formatVel(sample.vel)} km/s`} />
            <Readout label="Alcance" value={`${formatKm(sample.down)} km`} />
          </div>
          <div className="mt-px border border-line bg-void/80">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-2">
              <p className="font-display text-sm tracking-widest text-steel uppercase">
                Telemetría · perfil de cohete
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPlaying((v) => !v)}
                  className="inline-flex h-11 items-center gap-2 border border-line px-3 font-display text-sm tracking-widest text-frost uppercase transition-transform duration-150 active:scale-[0.96]"
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                  {playing ? "Pausa" : "Seguir"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMissionT(COUNT_FROM);
                    setPlaying(true);
                  }}
                  className="inline-flex h-11 items-center gap-2 border border-line px-3 font-display text-sm tracking-widest text-frost uppercase transition-transform duration-150 active:scale-[0.96]"
                >
                  <RotateCcw size={16} />
                  Repetir
                </button>
                <div className="flex h-11 border border-line">
                  {RATES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRate(item)}
                      aria-pressed={rate === item}
                      className={`px-3 font-display text-sm tracking-widest uppercase ${
                        rate === item ? "bg-signal text-void" : "text-steel"
                      }`}
                    >
                      {item}×
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-52 md:h-64">
              {chartOn ? (
                <RocketChart
                  points={points}
                  xDomain={[0, xMax]}
                  yDomain={[0, yMax]}
                  formatX={(x) => `T+${Math.round(x)}s`}
                  formatY={(y) => `${Math.round(y)}`}
                />
              ) : null}
            </div>
          </div>
          <p className="mt-3 pb-6 text-sm text-steel">
            Cuenta al estilo de una transmisión. No es un lanzamiento real de SpaceX. Tras el
            despegue, la gráfica acelera a {rate}×.
          </p>
      </div>
    </section>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-void/80 px-3 py-3">
      <p className="font-display text-xs tracking-widest text-steel uppercase">{label}</p>
      <p className="mt-1 font-display text-xl tabular-nums text-frost md:text-2xl">{value}</p>
    </div>
  );
}
