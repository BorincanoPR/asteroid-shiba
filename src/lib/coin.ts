import { createServerFn } from "@tanstack/react-start";

export const MINT = "F1ppSHedBsGGwEKH78JVgoqr4xkQHswtsGGLpgM7bCP2";

export const LINKS = {
  shop: "https://shop.spacex.com/products/spacex-asteroid-mascot",
  pump: `https://pump.fun/coin/${MINT}`,
  jup: `https://jup.ag/swap/SOL-${MINT}`,
  dex: "https://dexscreener.com/solana/91tdwygdurpekg8jcwcfzjn7agflgb9zb711fhpygr2j",
  foundation: "https://stargracefoundation.org",
} as const;

export type Candle = { t: number; c: number };

export type CoinQuote = {
  priceUsd: number | null;
  change24h: number | null;
  volume24h: number | null;
  liquidityUsd: number | null;
  marketCap: number | null;
  pairUrl: string | null;
  candles: Candle[];
};

export const EMPTY_QUOTE: CoinQuote = {
  priceUsd: null,
  change24h: null,
  volume24h: null,
  liquidityUsd: null,
  marketCap: null,
  pairUrl: null,
  candles: [],
};

type DexPair = {
  chainId?: string;
  url?: string;
  pairAddress?: string;
  priceUsd?: string;
  volume?: { h24?: number };
  priceChange?: { h24?: number };
  liquidity?: { usd?: number };
  marketCap?: number;
};

function num(value: string | undefined) {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export const getAsteroidQuote = createServerFn({ method: "GET" }).handler(
  async (): Promise<CoinQuote> => {
    try {
      const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${MINT}`, {
        signal: AbortSignal.timeout(5000),
        headers: { accept: "application/json" },
      });
      if (!res.ok) return EMPTY_QUOTE;
      const body = (await res.json()) as { pairs?: DexPair[] };
      const pairs = (body.pairs ?? []).filter((p) => p.chainId === "solana");
      pairs.sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
      const top = pairs[0];
      if (!top) return EMPTY_QUOTE;

      let candles: Candle[] = [];
      if (top.pairAddress) {
        try {
          const g = await fetch(
            `https://api.geckoterminal.com/api/v2/networks/solana/pools/${top.pairAddress}/ohlcv/hour?aggregate=4&limit=42&currency=usd`,
            {
              signal: AbortSignal.timeout(5000),
              headers: { accept: "application/json" },
            },
          );
          if (g.ok) {
            const gj = (await g.json()) as {
              data?: { attributes?: { ohlcv_list?: number[][] } };
            };
            const list = gj.data?.attributes?.ohlcv_list ?? [];
            candles = list
              .map((row) => ({ t: row[0] ?? 0, c: row[4] ?? 0 }))
              .filter((c) => c.t > 0 && c.c > 0)
              .reverse();
          }
        } catch {
          candles = [];
        }
      }

      return {
        priceUsd: num(top.priceUsd),
        change24h: top.priceChange?.h24 ?? null,
        volume24h: top.volume?.h24 ?? null,
        liquidityUsd: top.liquidity?.usd ?? null,
        marketCap: top.marketCap ?? null,
        pairUrl: top.url ?? null,
        candles,
      };
    } catch {
      return EMPTY_QUOTE;
    }
  },
);
