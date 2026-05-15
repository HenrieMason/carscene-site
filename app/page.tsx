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
      description:
        "The first CarScene statement piece. Built everywhere, driven here.",
      image: "/carscene-heritage-tee.png",
      link: "https://shop.carsceneapp.com/products/carscene-heritage-tee",
    },
    {
      name: "CarScene Cap",
      description:
        "Clean everyday CarScene identity. Simple, sharp, and wearable.",
      image: "/carscene-hat.png",
      link: "https://shop.carsceneapp.com/products/carscene-cap",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-16 pb-12 md:pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center">
          <img
            src="/TransparentWhite.png"
            alt="CarScene Logo"
            className="mb-8 w-[220px] md:w-[320px]"
          />

          <div className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/55">
            Spot cars, build garages
          </div>

          {/* DOWNLOAD BUTTONS */}
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <a
              href="https://apps.apple.com/us/app/carscene-dream-garage/id6760978493"
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-2xl border border-white/20 bg-white px-6 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-black transition hover:scale-[1.02] hover:bg-white/90"
            >
              Download for iOS
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.carscene.app"
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-2xl border border-[#ff3131]/80 bg-[#ff3131] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-white transition hover:scale-[1.02] hover:bg-[#ff4a4a]"
            >
              Download for Play Store
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-6 pt-2 pb-12">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 md:p-10">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-black tracking-tight md:text-6xl">
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
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:bg-white/[0.06]"
              >
                <div className="aspect-[4/3] bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-black">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {product.description}
                  </p>

                  <div className="mt-5 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition group-hover:scale-[1.02]">
                    Shop Now
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section className="px-6 pt-2 pb-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black tracking-tight md:text-5xl">
            Spot. Collect. Compete.
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {screenshots.map((src, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04]"
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