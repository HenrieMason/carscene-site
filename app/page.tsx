export default function Home() {
  const screenshots = [
    "/screenshot1.png",
    "/screenshot2.png",
];

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <h1 className="text-center text-4xl font-black tracking-tight md:text-6xl">
          CarScene: Dream Garage
        </h1>

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

        <div className="mt-16 grid w-full gap-6 md:grid-cols-2">
          {screenshots.map((src, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
            >
              <img
                src={src}
                alt={`CarScene screenshot ${index + 1}`}
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}