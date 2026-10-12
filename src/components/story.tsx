import { OutLink } from "@/components/out-link";

const CHAPTERS = [
  {
    kicker: "01 · El dibujo",
    title: "Liv P, en media hora",
    body: "En enero de 2022, Liv Perrotto —Liv P—, miembro honorario de Polaris Dawn, dibujó a un Shiba con traje espacial. La idea salió de su cariño por los Shiba y de Floki, el perro de Elon Musk. Quería un indicador de cero g que también hablara de los niños que pelean contra el cáncer.",
  },
  {
    kicker: "02 · El vuelo",
    title: "10 de septiembre de 2024",
    body: "Crew Dragon Resilience despegó rumbo a Polaris Dawn. A bordo: Jared Isaacman, Scott Poteet, Sarah Gillis y Anna Menon. Asteroid iba con ellos, abrochado hasta que la cabina dejó de pesar.",
  },
  {
    kicker: "03 · Cero g",
    title: "La señal es un peluche",
    body: "Cuando la cápsula entró en microgravedad, Asteroid flotó. Orejas fuera de la capucha, traje de pizarra, cola quieta en el aire. Ese gesto —un objeto a la deriva— es la tradición: confirma, sin instrumentos, que la tripulación ya no tiene peso.",
  },
  {
    kicker: "04 · El récord",
    title: "1.400 kilómetros",
    body: "La órbita subió hasta unos 1.400 km, el vuelo tripulado más lejano desde el programa Apolo, y la misión hizo la primera caminata espacial comercial. Cinco días después, Resilience amerizó. El pionero volvió al suelo.",
  },
  {
    kicker: "05 · La noche",
    title: "Del cosmos al sofá",
    body: "La historia de la tienda cierra donde empieza el cariño: después del cosmos, Asteroid regresa a la Tierra para acurrucarse de noche. SpaceX hizo réplicas. A petición de Liv, lo recaudado con aquellas ventas fue para St. Jude.",
  },
  {
    kicker: "06 · La mascota",
    title: "Un sí, en una palabra",
    body: "Liv murió el 14 de enero de 2026, a los quince años. Según su familia, una de sus últimas preguntas fue si Asteroid podía ser la mascota de SpaceX. La respuesta pública fue que sí. Su familia sigue la misión en Liv's Stargrace Foundation.",
  },
];

export function Story() {
  return (
    <section id="historia" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="font-display text-sm tracking-widest text-steel uppercase">Bitácora</p>
        <h2 className="mt-3 max-w-3xl font-display text-5xl leading-none tracking-wide text-balance uppercase md:text-6xl">
          Del lápiz a la órbita
        </h2>
        <div className="mt-12 grid gap-x-16 md:grid-cols-2">
          {CHAPTERS.map((chapter) => (
            <article key={chapter.kicker} className="border-t border-line py-6">
              <p className="font-display text-sm tracking-widest text-steel uppercase">
                {chapter.kicker}
              </p>
              <h3 className="mt-2 font-display text-3xl tracking-wide text-frost uppercase">
                {chapter.title}
              </h3>
              <p className="mt-3 text-pretty leading-relaxed text-steel">{chapter.body}</p>
            </article>
          ))}
        </div>
        <OutLink
          href="https://stargracefoundation.org"
          className="mt-4 inline-flex h-12 items-center border border-line px-5 font-display tracking-widest text-frost uppercase"
        >
          Fundación de su familia
        </OutLink>
        <dl className="mt-12 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          <Stat k="Shiba en órbita" v="El primero" />
          <Stat k="Apogeo" v="1.400 km" />
          <Stat k="En el espacio" v="5 días" />
          <Stat k="Caminata" v="La primera comercial" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-void px-4 py-5">
      <dt className="font-display text-xs tracking-widest text-steel uppercase">{k}</dt>
      <dd className="mt-2 font-display text-2xl tracking-wide text-frost">{v}</dd>
    </div>
  );
}
