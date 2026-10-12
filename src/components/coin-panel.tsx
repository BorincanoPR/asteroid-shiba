import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { RocketChart, type ChartPoint } from "@/components/rocket-chart";
import { OutLink } from "@/components/out-link";
import { LINKS, MINT, type CoinQuote } from "@/lib/coin";

function money(n: number | null, digits = 0) {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n > 0 && n < 1) return `$${n.toPrecision(3)}`;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  });
}

function signed(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "—";
  const body = Math.abs(n).toLocaleString("es-ES", { maximumFractionDigits: 2 });
  return `${n >= 0 ? "+" : "−"}${body}%`;
}

function rocketTo(price: number): ChartPoint[] {
  const steps = 36;
  return Array.from({ length: steps }, (_, i) => {
    const u = i / (steps - 1);
    return { x: i, y: price * (0.12 + 0.88 * Math.pow(u, 1.6)) };
  });
}

export function CoinPanel({ quote }: { quote: CoinQuote }) {
  const [copied, setCopied] = useState(false);

  const market = useMemo<ChartPoint[]>(() => {
    if (quote.candles.length >= 2) return quote.candles.map((c) => ({ x: c.t, y: c.c }));
    return [];
  }, [quote.candles]);

  const live = quote.priceUsd && quote.priceUsd > 0 ? quote.priceUsd : 0.000061;
  const points = market.length >= 2 ? market : rocketTo(live);
  const realHistory = market.length >= 2;

  const domain = useMemo(() => {
    const ys = points.map((p) => p.y);
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const pad = Math.max((max - min) * 0.28, max * 0.06);
    return {
      x: [points[0].x, points[points.length - 1].x] as [number, number],
      y: [Math.max(0, min - pad), max + pad] as [number, number],
    };
  }, [points]);

  async function copyMint() {
    try {
      await navigator.clipboard.writeText(MINT);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    window.setTimeout(() => setCopied(false), 1600);
  }

  const day = new Intl.DateTimeFormat("es", { day: "numeric", month: "short" });

  return (
    <section id="moneda" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="font-display text-sm tracking-widest text-steel uppercase">
          Solana · token de la comunidad
        </p>
        <h2 className="mt-3 font-display text-5xl leading-none tracking-wide uppercase md:text-7xl">
          $Asteroid
        </h2>
        <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-steel">
          La misma curva de un cohete, ahora en precio. $ASTEROID es una moneda de fans en
          Solana: no la emite SpaceX, no es de la familia Perrotto y no es un consejo para
          invertir. Puedes perder lo que pongas.
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          <Cell k="Precio" v={money(quote.priceUsd)} />
          <Cell k="24 h" v={signed(quote.change24h)} />
          <Cell k="Volumen" v={money(quote.volume24h)} />
          <Cell k="Capitalización" v={money(quote.marketCap)} />
        </dl>

        <div className="mt-px border border-line bg-panel">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-display text-sm tracking-widest text-steel uppercase">
              {realHistory ? "Trayectoria · precio real" : "Trayectoria · perfil de cohete"}
            </p>
            <p className="font-display text-sm tracking-widest text-steel uppercase">USD</p>
          </div>
          <div className="h-64 md:h-80">
            <RocketChart
              points={points}
              xDomain={domain.x}
              yDomain={domain.y}
              curve="monotone"
              formatX={(x) => (realHistory ? day.format(new Date(x * 1000)) : `${x}`)}
              formatY={(y) => (y < 1 ? y.toPrecision(2) : y.toFixed(2))}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <OutLink
            href={LINKS.pump}
            className="inline-flex h-12 items-center justify-center border border-signal bg-signal px-6 font-display text-lg tracking-widest text-void uppercase transition-transform duration-150 active:scale-[0.96]"
          >
            Comprar en Pump.fun
          </OutLink>
          <OutLink
            href={LINKS.jup}
            className="inline-flex h-12 items-center justify-center border border-signal px-6 font-display text-lg tracking-widest text-signal uppercase transition-transform duration-150 active:scale-[0.96]"
          >
            Comprar en Jupiter
          </OutLink>
          <OutLink
            href={quote.pairUrl ?? LINKS.dex}
            className="inline-flex h-12 items-center justify-center border border-line px-6 font-display text-lg tracking-widest text-frost uppercase"
          >
            Ver gráfica
          </OutLink>
        </div>

        <div className="mt-6 flex flex-col gap-3 border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-display text-xs tracking-widest text-steel uppercase">
              Contrato · Solana
            </p>
            <p className="mt-1 truncate font-display text-lg tracking-wide text-frost">{MINT}</p>
          </div>
          <button
            type="button"
            onClick={copyMint}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 border border-line px-4 font-display tracking-widest text-frost uppercase"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>
    </section>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-void px-4 py-5">
      <dt className="font-display text-xs tracking-widest text-steel uppercase">{k}</dt>
      <dd className="mt-2 font-display text-2xl tabular-nums tracking-wide text-frost">{v}</dd>
    </div>
  );
}
