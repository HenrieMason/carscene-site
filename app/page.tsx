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

          {/* DOWNLOAD BUTTONS */}
          {/* DOWNLOAD BUTTONS */}
          <div className="mt-8 flex items-center gap-4">
            {/* APPLE */}
            <a
              href="https://apps.apple.com/us/app/carscene-dream-garage/id6760978493"
              target="_blank"
              rel="noreferrer"
              className="relative flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-[14px] border border-white bg-black transition hover:scale-[1.03]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.10]"
                style={{ backgroundImage: "url('/Tracks.png')" }}
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="relative z-10 h-7 fill-white"
              >
                <path d="M318.7 268.1c-.2-36.7 16.4-64.5 49.8-84.7-18.7-26.8-46.9-41.6-84.1-44.5-35.2-2.8-73.7 20.7-87.8 20.7-14.9 0-49-19.7-75.8-19.7C58.6 140 0 193.4 0 303.4c0 32.5 5.9 66 17.7 100.4 15.7 45.2 72.2 156 131.1 154.2 30.8-.7 52.5-21.9 92.6-21.9 38.9 0 59 21.9 92.6 21.9 59.4-.9 110.5-101.6 126.2-146.9-80.2-37.8-76.2-137.6-76.5-142zM259.3 76.5C286.3 43.9 283 12 282.2 0c-23.8 1.4-51.4 16.2-67.1 34.5-17.3 19.7-27.4 44.1-25.2 74.4 25.9 2 51.4-11.2 69.4-32.4z" />
              </svg>
            </a>

            {/* ANDROID */}
            <a
              href="https://play.google.com/store/apps/details?id=com.carscene.app"
              target="_blank"
              rel="noreferrer"
              className="relative flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-[14px] border border-[#ff3131] bg-black transition hover:scale-[1.03]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.16]"
                style={{ backgroundImage: "url('/TracksRed.png')" }}
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                className="relative z-10 h-7 fill-[#ff3131]"
              >
                <path d="M420.6 125.2l43.9-76c2.5-4.3 1-9.8-3.3-12.3s-9.8-1-12.3 3.3l-44.8 77.6c-34.5-15.9-73.1-24.8-114.1-24.8s-79.6 8.9-114.1 24.8L131.1 40.2c-2.5-4.3-8-5.8-12.3-3.3s-5.8 8-3.3 12.3l43.9 76C97.5 158.6 56 222.9 56 296h464c0-73.1-41.5-137.4-99.4-170.8zM208 224c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zm160 0c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24z" />
              </svg>
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