export default function Home() {
  const features = [
    {
      title: "Spot Legendary Cars",
      text: "Track the cars you see in real life, build your collection, and turn every drive into a hunt.",
    },
    {
      title: "Build Dream Garages",
      text: "Create your perfect lineup, compare builds with friends, and flex your taste in cars.",
    },
    {
      title: "Compete With Friends",
      text: "Show off your collection value, discover rare finds, and see who has the best garage.",
    },
  ];

  const stats = [
    { value: "1,500+", label: "Cars to discover" },
    { value: "P / A / S / X", label: "Tier system" },
    { value: "Real-world", label: "Spotting gameplay" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-2xl font-black tracking-[0.25em]">CARSCENE</div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/50">
              Dream Garage Culture
            </div>
          </div>

          <nav className="hidden gap-8 text-sm text-white/70 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#about" className="transition hover:text-white">
              About
            </a>
            <a href="#download" className="transition hover:text-white">
              Download
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%)]" />
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70">
                The app for spotting rare cars
              </div>
              <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-7xl">
                Build your <span className="text-white/70">dream garage</span>. Find them all.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
                CarScene turns real-life car spotting into a game. Discover cars, track your finds,
                build insane garages, and compete with friends over who has the best taste.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#download"
                  className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  Download CarScene
                </a>
                <a
                  href="#features"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Features
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/40 backdrop-blur">
                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-neutral-900">
                  <div className="border-b border-white/10 px-6 py-4 text-sm text-white/50">
                    CarScene Preview
                  </div>
                  <div className="grid gap-4 p-6">
                    <div className="rounded-3xl border border-white/10 bg-neutral-950 p-5">
                      <div className="text-sm uppercase tracking-[0.2em] text-white/45">
                        Collection Value
                      </div>
                      <div className="mt-2 text-4xl font-black">$12.4M</div>
                      <div className="mt-2 text-sm text-white/50">
                        Based on the cars you’ve spotted
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="text-sm text-white/50">Most recent find</div>
                        <div className="mt-2 text-2xl font-bold">Porsche 918 Spyder</div>
                        <div className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/70">
                          X Tier
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="text-sm text-white/50">Dream Garage</div>
                        <div className="mt-2 text-2xl font-bold">3 / 5 cars selected</div>
                        <div className="mt-4 h-2 rounded-full bg-white/10">
                          <div className="h-2 w-3/5 rounded-full bg-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-black/30">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-3xl font-black md:text-4xl">{stat.value}</div>
                <div className="mt-2 text-sm uppercase tracking-[0.2em] text-white/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-[0.3em] text-white/45">Features</div>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">Why CarScene hits different</h2>
            <p className="mt-4 text-lg leading-8 text-white/65">
              It is not just another car app. It gives car culture a game loop — discover, collect,
              rank, and build.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/20"
              >
                <div className="text-2xl font-bold">{feature.title}</div>
                <p className="mt-4 text-base leading-7 text-white/65">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 md:grid-cols-[1.1fr_0.9fr] md:pb-28"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10">
            <div className="text-sm uppercase tracking-[0.25em] text-white/45">About the brand</div>
            <h3 className="mt-4 text-3xl font-black md:text-4xl">
              Made for people who actually notice cars
            </h3>
            <p className="mt-5 text-lg leading-8 text-white/65">
              CarScene is built around the thrill of seeing something rare in the wild. Whether it is
              a hypercar, a clean classic, or the perfect daily build, the whole point is to make car
              spotting addictive again.
            </p>
            <p className="mt-5 text-lg leading-8 text-white/65">
              The brand is bold, competitive, and social — a place where taste matters, friends judge
              your garage, and every sighting adds to your story.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-neutral-900 p-8 md:p-10">
            <div className="text-sm uppercase tracking-[0.25em] text-white/45">
              Perfect for content
            </div>
            <h3 className="mt-4 text-3xl font-black">Built to be shared</h3>
            <ul className="mt-6 space-y-4 text-white/65">
              <li>• Show off rare finds</li>
              <li>• Post your dream garage lineup</li>
              <li>• Compare collection values</li>
              <li>• Challenge friends to spot better cars</li>
            </ul>
          </div>
        </section>

        <section id="download" className="px-6 pb-24">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/10 bg-white px-8 py-12 text-black shadow-2xl shadow-black/30 md:px-12 md:py-16">
            <div className="max-w-3xl">
              <div className="text-sm uppercase tracking-[0.25em] text-black/50">Download</div>
              <h2 className="mt-4 text-4xl font-black md:text-5xl">
                Start building your garage today.
              </h2>
              <p className="mt-5 text-lg leading-8 text-black/70">
                Discover over 1,500 cars, track what you see, and create the garage you wish was in
                your driveway.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#"
                className="rounded-2xl bg-black px-6 py-4 text-center text-sm font-semibold text-white transition hover:scale-[1.02]"
              >
                App Store
              </a>
              <a
                href="#"
                className="rounded-2xl border border-black/10 bg-black/5 px-6 py-4 text-center text-sm font-semibold text-black transition hover:bg-black/10"
              >
                Instagram / TikTok
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}