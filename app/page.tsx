"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const screenshots = [
    "/screenshot1.png",
    "/screenshot2.png",
    "/screenshot3.png",
    "/screenshot4.png",
  ];

  const products = [
    {
      image: "/Heritage, White.png",
      link: "https://shop.carsceneapp.com/products/carscene-heritage-tee-white?variant=53356529484083",
    },
    {
      image: "/Heritage, Black.png",
      link: "https://shop.carsceneapp.com/products/carscene-heritage-tee?variant=53293917569331",
    },
    { spacer: true },
    {
      image: "/Red_Transparent.png",
      link: "https://shop.carsceneapp.com/products/red-on-black-carscene-sticker?variant=53357946667315",
    },
    {
      image: "/Black_Transparent.png",
      link: "https://shop.carsceneapp.com/products/red-on-grey-carscene-sticker?variant=53357948862771",
    },
    { spacer: true },
    {
      image: "/Cap, White.png",
      link: "https://shop.carsceneapp.com/products/carscene-cap?variant=53295688876339",
    },
    {
      image: "/Cap, Black.png",
      link: "https://shop.carsceneapp.com/products/carscene-cap-black?variant=53356532138291",
    },
    { spacer: true },
    {
      image: "/Hoodie, Grey.png",
      link: "https://shop.carsceneapp.com/products/carscene-heavy-hoodie-grey?variant=53356524929331",
    },
    {
      image: "/Hoodie, Black.png",
      link: "https://shop.carsceneapp.com/products/carscene-heavy-hoodie?variant=53356450709811",
    },
  ];

  const realProducts = products.filter((p) => !p.spacer);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const raw = -rect.top / scrollable;

      setProgress(Math.min(1, Math.max(0, raw)));
    };

    update();
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

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
              className="flex-1 rounded-2xl bg-white px-6 py-4 text-center text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Download for iOS
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.carscene.app"
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Download for Play Store
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section ref={sectionRef} className="relative h-[520vh] px-6">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="absolute top-10 z-20 text-center md:top-14">
            <h2 className="text-3xl font-black md:text-5xl">
              Wear the Car Scene
            </h2>
            <p className="mt-3 text-sm text-white/50">
              Scroll to shop the drop
            </p>
          </div>

          <div className="relative h-[520px] w-full max-w-[760px] md:h-[620px]">
            {realProducts.map((product, index) => {
              const step = 1 / realProducts.length;
              const local = (progress - index * step) / step;

              const clamped = Math.min(1, Math.max(0, local));

              const x = 90 - clamped * 90;
              const y = index * 76;
              const scale = 1 - index * 0.015;
              const opacity = local < -0.25 ? 0 : 1;

              return (
                <a
                  key={product.image}
                  href={product.link}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute left-1/2 top-1/2 block w-[78vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 hover:scale-[1.03]"
                  style={{
                    zIndex: index + 1,
                    opacity,
                    transform: `translate(calc(-50% + ${x}vw), calc(-50% + ${y}px)) scale(${scale})`,
                  }}
                >
                  <img
                    src={product.image}
                    alt=""
                    className="w-full object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
                  />
                </a>
              );
            })}
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