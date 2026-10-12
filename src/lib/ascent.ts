export type Sample = {
  t: number;
  alt: number;
  vel: number;
  down: number;
};

const KEYS: Sample[] = [
  { t: 0, alt: 0, vel: 0, down: 0 },
  { t: 20, alt: 1.4, vel: 0.2, down: 0.3 },
  { t: 60, alt: 14, vel: 0.62, down: 6 },
  { t: 90, alt: 32, vel: 1.05, down: 16 },
  { t: 150, alt: 72, vel: 1.95, down: 48 },
  { t: 175, alt: 86, vel: 2.2, down: 68 },
  { t: 260, alt: 142, vel: 4.1, down: 210 },
  { t: 380, alt: 188, vel: 6.2, down: 560 },
  { t: 480, alt: 206, vel: 7.25, down: 980 },
  { t: 540, alt: 214, vel: 7.66, down: 1280 },
];

export const ASCENT_END = KEYS[KEYS.length - 1].t;
export const COUNT_FROM = -15;

function smooth(u: number) {
  const x = Math.min(1, Math.max(0, u));
  return x * x * (3 - 2 * x);
}

export function sampleAscent(t: number): Sample {
  const x = Math.max(0, t);
  const last = KEYS[KEYS.length - 1];
  if (x >= last.t) return { ...last };
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].t < x) i += 1;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const u = smooth((x - a.t) / (b.t - a.t));
  return {
    t: x,
    alt: a.alt + (b.alt - a.alt) * u,
    vel: a.vel + (b.vel - a.vel) * u,
    down: a.down + (b.down - a.down) * u,
  };
}

export function phaseLabel(t: number) {
  if (t < -10) return "VENTANA ABIERTA";
  if (t < 0) return "CUENTA FINAL";
  if (t < 8) return "DESPEGUE";
  if (t < 60) return "ASCENSO";
  if (t < 150) return "MÁXIMA PRESIÓN DINÁMICA";
  if (t < 180) return "MECO · FIN DE PRIMERA ETAPA";
  if (t < 500) return "SEGUNDA ETAPA";
  if (t < ASCENT_END) return "INSERCIÓN ORBITAL";
  return "ÓRBITA ALCANZADA";
}

export function formatClock(t: number) {
  const sign = t < 0 ? "T−" : "T+";
  const abs = Math.abs(t);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = Math.floor(abs % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${sign} ${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function formatKm(n: number) {
  return n.toLocaleString("es-ES", {
    minimumFractionDigits: n < 30 ? 1 : 0,
    maximumFractionDigits: n < 30 ? 1 : 0,
  });
}

export function formatVel(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
