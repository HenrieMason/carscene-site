export default function Home() {
  const screenshots = [
    "/screenshot1.png",
    "/screenshot2.png",
    "/screenshot3.png",
    "/screenshot4.png",
  ];

  const products = [
    {
      name: "CarScene Heritage Tee",
      description: "The first CarScene statement piece. Built everywhere, driven here.",
      image: "/carscene-heritage-tee.png",
      link: "https://shop.carsceneapp.com/products/carscene-heritage-tee",
    },
    {
      name: "CarScene Cap",
      description: "Clean everyday CarScene identity. Simple, sharp, and wearable.",
      image: "/carscene-hat.png",
      link: "https://shop.carsceneapp.com/products/carscene-cap",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-16 pb-10 md:pt-24 md:pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%)]" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center">
          <img
            src="/TransparentWhite.png"
            alt="CarScene Logo"
            className="mb-6 w-[220px] md:w-[320px]"
          />

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70">
            Spot cars, build garages
          </div>

          <div className="mt-8 flex w-full max-w-md flex-col gap-4 sm:flex-row">
            <a
              href="https://apps.apple.com/us/app/carscene-dream-garage/id6760978493"
              target="_blank"
              rel="noreferrer"
              className="relative flex-1 overflow-hidden rounded-2xl border border-white/20 bg-white px-6 py-4 text-center text-sm font-black text-black transition hover:scale-[1.02]"
            >
              <span
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('/Tracks.png')" }}
              />
              <span className="relative z-10">Download for iOS</span>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.carscene.app"
              target="_blank"
              rel="noreferrer"
              className="relative flex-1 overflow-hidden rounded-2xl border border-[#ff3131]/70 bg-black px-6 py-4 text-center text-sm font-black text-white transition hover:scale-[1.02]"
            >
              <span
                className="absolute inset-0 bg-cover bg-center opacity-35"
                style={{ backgroundImage: "url('/TracksRed.png')" }}
              />
              <span className="relative z-10">Download for Play Store</span>
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-6 pt-4 pb-10 md:pt-6 md:pb-12">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-10">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-black md:text-5xl">
              Wear the Car Scene
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <a
                key={product.name}
                href={product.link}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10"
              >
                <div className="aspect-[4/3] bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-black">{product.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {product.description}
                  </p>

                  <div className="mt-5 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition group-hover:scale-[1.02]">
                    Shop Now
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section className="px-6 pt-4 pb-8 md:pt-4 md:pb-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black md:text-4xl">
            Spot. Collect. Compete.
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
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
    </main>
  );
}