import { useState } from "react";
import { LINKS } from "@/lib/coin";
import { OutLink } from "@/components/out-link";

const SHOTS = [
  {
    src: "/mission/helmet.jpg",
    alt: "Asteroid con casco de burbuja y traje azul, flotando entre las estrellas",
    caption: "En el vacío",
  },
  {
    src: "/mission/studio.jpg",
    alt: "Asteroid sentado, con capucha azul pizarra y orejas amarillas",
    caption: "El peluche",
  },
  {
    src: "/mission/cabin.jpg",
    alt: "Asteroid en ingravidez dentro de la cabina",
    caption: "Cero g",
  },
  {
    src: "/mission/night.jpg",
    alt: "Asteroid de vuelta en la Tierra, junto a una ventana de noche",
    caption: "De noche",
  },
];

export function Product() {
  const [index, setIndex] = useState(0);
  const shot = SHOTS[index];

  return (
    <section id="peluche" className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <div className="hud relative border border-signal/50 bg-panel">
            <span className="pointer-events-none absolute top-0 left-0 size-5 border-t-2 border-l-2 border-signal" />
            <span className="pointer-events-none absolute top-0 right-0 size-5 border-t-2 border-r-2 border-signal" />
            <span className="pointer-events-none absolute bottom-0 left-0 size-5 border-b-2 border-l-2 border-signal" />
            <span className="pointer-events-none absolute right-0 bottom-0 size-5 border-r-2 border-b-2 border-signal" />
            <img
              src={shot.src}
              alt={shot.alt}
              className="aspect-square w-full object-cover md:aspect-4/5"
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="font-display tracking-widest text-steel uppercase">{shot.caption}</p>
            <div className="flex gap-2" role="tablist" aria-label="Fotos del peluche">
              {SHOTS.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={item.caption}
                  onClick={() => setIndex(i)}
                  className={`h-11 w-11 border ${i === index ? "border-signal bg-signal" : "border-line bg-transparent"}`}
                >
                  <span
                    className={`mx-auto block size-2 ${i === index ? "bg-void" : "bg-steel"}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="font-display text-sm tracking-widest text-signal uppercase">
            Tienda · edición oficial
          </p>
          <h2 className="mt-3 font-display text-5xl leading-none tracking-wide text-balance text-frost uppercase md:text-6xl">
            Asteroid Plush
          </h2>
          <p className="soon mt-6 font-display text-5xl tracking-widest text-signal uppercase md:text-6xl">
            Coming soon
          </p>
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-steel">
            Asteroid el Shiba, con las orejas más esponjosas, no es un cachorro común: es un
            pionero espacial. Se aventura al cosmos moviendo la cola con deleite y luego regresa
            a la Tierra para acurrucarse por la noche. Lo diseñó Liv P, miembro honorario del
            equipo Polaris Dawn.
          </p>
          <p className="mt-4 text-sm text-steel">
            El peluche todavía no está a la venta. La ficha oficial abre cuando la ventana se
            active.
          </p>
          <OutLink
            href={LINKS.shop}
            className="mt-8 inline-flex h-12 w-fit items-center border border-signal bg-signal px-6 font-display text-lg tracking-widest text-void uppercase transition-transform duration-150 active:scale-[0.96]"
          >
            Coming soon
          </OutLink>
        </div>
      </div>
    </section>
  );
}
