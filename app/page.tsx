export default function Home() {
  const screenshots = [
    "/screenshot1.png",
    "/screenshot2.png",
    "/screenshot3.png",
    "/screenshot4.png",
  ];

  const features = [
    {
      title: "Spot Cars You See in Real Life",
      text: "Track the cars you find out in the wild and turn everyday spotting into a game.",
    },
    {
      title: "Build Dream Garages",
      text: "Create your ideal lineup, save your favorite builds, and show off your taste.",
    },
    {
      title: "Compete With Friends",
      text: "Compare collections, flex rare finds, and see who has the best garage.",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden px-6 py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%)]" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center">
          {/* LOGO (only addition) */}
          <img
            src="/TransparentWhite.png"
            alt="CarScene Logo"
            className="w-[220px] md:w-[320px] mb-6"
          />

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70">
            CarScene: Dream Garage
          </div>

          <p className="mt-6 max-w-2xl text-center text-lg leading-8 text-white/70">
            An app for car spotting and building dream garages.
          </p>

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

      <section className="px-6 pb-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/20"
            >
              <h2 className="text-2xl font-bold">{feature.title}</h2>
              <p className="mt-4 text-base leading-7 text-white/65">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black md:text-4xl">
            See the app in action
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {screenshots.map((src, index) => (
              <div
                key={index}
                className="mx-auto max-w-[220px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
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