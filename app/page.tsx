export default function Home() {
  const screenshots = [
    "/screenshot1.png",
    "/screenshot2.png",
    "/screenshot3.png",
    "/screenshot4.png",
  ];

  const featuredProduct = {
    image: "/bundle.png",
    link: "https://shop.carsceneapp.com/products/carscene-sticker-pack?variant=53364362903859",
  };

  const products = [
    {
      image: "/Heritage, White.png",
      link: "https://shop.carsceneapp.com/products/carscene-heritage-tee-white?variant=53356529484083",
    },
    {
      image: "/Heritage, Black.png",
      link: "https://shop.carsceneapp.com/products/carscene-heritage-tee?variant=53293917569331",
    },
    {
      image: "/Hoodie, Grey.png",
      link: "https://shop.carsceneapp.com/products/carscene-heavy-hoodie-grey?variant=53356524929331",
    },
    {
      image: "/Hoodie, Black.png",
      link: "https://shop.carsceneapp.com/products/carscene-heavy-hoodie?variant=53356450709811",
    },
    {
      image: "/Cap, White.png",
      link: "https://shop.carsceneapp.com/products/carscene-cap?variant=53295688876339",
    },
    {
      image: "/Cap, Black.png",
      link: "https://shop.carsceneapp.com/products/carscene-cap-black?variant=53356532138291",
    },
    {
      image: "/Red_Transparent.png",
      link: "https://shop.carsceneapp.com/products/carscene-classic-sticker-6?variant=53362223350067",
    },
    {
      image: "/Black_Transparent.png",
      link: "https://shop.carsceneapp.com/products/carscene-stealth-sticker-6?variant=53362206245171",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-16 pb-10 md:pt-24 md:pb-12">
        {/* Desktop Background */}
        <img
          src="/Background.png"
          alt=""
          className="absolute inset-0 hidden h-full w-full object-cover opacity-70 md:block"
        />

        {/* Mobile Background */}
        <img
          src="/Background2.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70 md:hidden"
        />

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_35%)]" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center">
          <img
            src="/TransparentWhite.png"
            alt="CarScene Logo"
            className="mb-6 w-[220px] md:w-[320px]"
          />

          <div className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/75 backdrop-blur-sm">
            The app for building dream garages.
          </div>

          <div className="mt-8 flex w-full max-w-md flex-col gap-4 sm:flex-row">
            <a
              href="https://apps.apple.com/us/app/carscene-dream-garage/id6760978493"
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-2xl bg-white px-6 py-4 text-center text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Download for iOS
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.carscene.app"
              target="_blank"
              rel="noreferrer"
              className="flex-1 whitespace-nowrap rounded-2xl border border-white/15 bg-black/35 px-6 py-4 text-center text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Download from Play Store
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-white px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          
          {/* Featured Product */}
          <div className="mb-14 flex justify-center">
            <a
              href={featuredProduct.link}
              target="_blank"
              rel="noreferrer"
              className="group flex w-full max-w-4xl items-center justify-center"
            >
              <img
                src={featuredProduct.image}
                alt=""
                className="w-full object-contain transition duration-300 group-hover:scale-[1.02]"
              />
            </a>
          </div>

          {/* Regular Products */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8 md:gap-y-16">
            {products.map((product) => (
              <a
                key={product.image}
                href={product.link}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-center"
              >
                <img
                  src={product.image}
                  alt=""
                  className="w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section className="px-6 pt-4 pb-8 md:pt-4 md:pb-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {screenshots.map((src, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5"
              >
                <img
                  src={src}
                  alt={`CarScene screenshot ${index + 1}`}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">
            © 2026 Henrie Studios
          </p>
        </div>
      </footer>
    </main>
  );
}