import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Webcast } from "@/components/webcast";
import { Product } from "@/components/product";
import { Story } from "@/components/story";
import { CoinPanel } from "@/components/coin-panel";
import { OutLink } from "@/components/out-link";
import { EMPTY_QUOTE, LINKS, getAsteroidQuote } from "@/lib/coin";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await getAsteroidQuote();
    } catch {
      return EMPTY_QUOTE;
    }
  },
  component: Home,
});

function Home() {
  const quote = Route.useLoaderData();

  return (
    <main>
      <SiteHeader />
      <Webcast />
      <Product />
      <Story />
      <CoinPanel quote={quote} />
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-steel md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-pretty leading-relaxed">
            Homenaje independiente a Asteroid, el indicador de cero g de Polaris Dawn diseñado
            por Liv Perrotto. No está afiliado a SpaceX, a Polaris ni a su familia. La cuenta es
            una simulación. La moneda es especulativa.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-display tracking-widest uppercase">
            <OutLink href={LINKS.shop}>Tienda</OutLink>
            <OutLink href={LINKS.foundation}>Fundación</OutLink>
            <OutLink href={LINKS.pump}>Pump.fun</OutLink>
          </div>
        </div>
      </footer>
    </main>
  );
}
