"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import cars from "../../data/cars.json";

type Car = {
  brand: string;
  model: string;
  price: number;
  id: string;
  class: string;
  image: string;
};

const kBrandOrder = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "Bmw",
  "Bugatti",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Dodge",
  "Ferrari",
  "Ford",
  "Genesis",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Koenigsegg",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Pagani",
  "Pontiac",
  "Porsche",
  "Rolls Royce",
  "Subaru",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "Other Cars",
  "Other SUVs",
];

function classFromPrice(price: number) {
  if (price < 50000) return "P";
  if (price < 100000) return "A";
  if (price < 500000) return "S";
  return "X";
}

function classTint(type: string) {
  switch (type) {
    case "X":
      return "rgb(251, 208, 80)";
    case "S":
      return "rgb(170, 148, 209)";
    case "A":
      return "rgb(146, 194, 234)";
    case "P":
    default:
      return "rgb(227, 227, 227)";
  }
}

export default function Dream9Page() {
  const allCars = cars as Car[];
  const posterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const SHOPIFY_STORE_URL = "https://carscenebrand.com";
  const POSTER_VARIANT_ID = "53414631899443";
  const SHIRT_VARIANT_IDS = {
    S: "53417034449203",
    M: "53417034481971",
    L: "53417034514739",
    XL: "53417034547507",
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const [mode, setMode] = useState<"poster" | "shirt">("shirt");
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  function getRandomDream9() {
    return [...allCars]
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);
  }
  const [slots, setSlots] = useState<(Car | null)[]>(Array(9).fill(null));
  useEffect(() => {
    setSlots(getRandomDream9());
  }, []);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [shirtSize, setShirtSize] = useState<"S" | "M" | "L" | "XL">("L");
  const [deleteReadySlot, setDeleteReadySlot] = useState<number | null>(null);
  const [isMakingDesign, setIsMakingDesign] = useState(false);

  const allSlotsFilled = slots.every((slot) => slot !== null);

  const brands = useMemo(() => {
    const existingBrands = new Set(allCars.map((car) => car.brand));

    const orderedBrands = kBrandOrder.filter((brand) =>
      existingBrands.has(brand)
    );

    const extraBrands = Array.from(existingBrands)
      .filter((brand) => !kBrandOrder.includes(brand))
      .sort();

    return [...orderedBrands, ...extraBrands];
  }, [allCars]);

  const defaultOpenSlot = slots.findIndex((slot) => slot === null);

  const targetSlot =
    selectedSlot !== null ? selectedSlot : defaultOpenSlot === -1 ? 0 : defaultOpenSlot;

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return allCars
      .filter((car) => {
        const searchable = `${car.brand} ${car.model}`.toLowerCase();

        const acronym = car.model
          .split(/[\s-]+/)
          .map((word) => word[0])
          .join("")
          .toLowerCase();

        return searchable.includes(q) || acronym.includes(q);
      })
      .slice(0, 36);
  }, [query, allCars]);

  const brandCars = useMemo(() => {
    if (!selectedBrand) return [];
    return allCars.filter((car) => car.brand === selectedBrand);
  }, [selectedBrand, allCars]);

  function shuffleDream9() {
    setSlots(getRandomDream9());
    setSelectedSlot(null);
    setSelectedBrand(null);
    setQuery("");
    setDeleteReadySlot(null);
  }

  function clearDream9() {
    setSlots(Array(9).fill(null));
    setSelectedSlot(null);
    setSelectedBrand(null);
    setQuery("");
    setDeleteReadySlot(null);
  }
  function addCarToTargetSlot(car: Car) {
    setSlots((current) => {
      const withoutEmptySlots = current.filter((slot): slot is Car => slot !== null);

      if (selectedSlot !== null && selectedSlot < withoutEmptySlots.length) {
        const next = [...withoutEmptySlots];
        next[selectedSlot] = car;
        return next;
      }

      if (withoutEmptySlots.length >= 9) {
        return [...withoutEmptySlots.slice(0, 8), car];
      }

      return [...withoutEmptySlots, car];
    });

    setSelectedSlot(null);
    setSelectedBrand(null);
    setQuery("");
    setDeleteReadySlot(null);
  }

  function selectSlot(index: number) {
    const car = displaySlots[index];

    if (car) {
      if (deleteReadySlot === index) {
        setSlots((current) =>
          current.filter((slot) => slot?.id !== car.id)
        );
        setDeleteReadySlot(null);
        return;
      }

      setDeleteReadySlot(index);

      setTimeout(() => {
        setDeleteReadySlot((current) =>
          current === index ? null : current
        );
      }, 3000);

      return;
    }

    setSelectedSlot(index);
  }

  function waitForPosterImages(node: HTMLElement) {
    const images = Array.from(node.querySelectorAll("img"));

    return Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();

        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );
  }
  
  async function makePoster() {
    if (!exportRef.current || !allSlotsFilled || isMakingDesign) return;

    const node = exportRef.current;

    try {
      const isShirt = mode === "shirt";
      if (isShirt && !showSizePicker) {
        setShowSizePicker(true);
        return;
      }

      setIsMakingDesign(true);

      const exportWidth = isShirt ? 4494 : 3600;

      const rect = node.getBoundingClientRect();
      const pixelRatio = exportWidth / rect.width;

      await waitForPosterImages(node);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio,
        backgroundColor: "white",
        imagePlaceholder:
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      });

      const blob = await (await fetch(dataUrl)).blob();

      const formData = new FormData();
      const filename = `dream9-${Date.now()}.png`;
      formData.append("file", blob, filename);
      formData.append("upload_preset", "dream9_unsigned");

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dvcxnicew/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryData.secure_url) {
        throw new Error("Cloudinary upload failed.");
      }

      const designUrl = cloudinaryData.secure_url;
      const variantId = isShirt
        ? SHIRT_VARIANT_IDS[shirtSize]
        : POSTER_VARIANT_ID;

      const checkoutUrl =
        `${SHOPIFY_STORE_URL}/cart/add?id=${variantId}` +
        `&quantity=1` +
        `&properties[Dream 9 Design URL]=${encodeURIComponent(designUrl)}` +
        `&properties[Dream 9 Product]=${encodeURIComponent(
          isShirt ? "Shirt" : "Poster"
        )}` +
        `&properties[Dream 9 Size]=${encodeURIComponent(
          isShirt ? shirtSize : "18x24"
        )}`;

      window.location.href = checkoutUrl + "&return_to=/checkout";
    } catch (error) {
      console.error(error);
      alert("Failed to create design.");
    } finally {
      setIsMakingDesign(false);
    }
  }

  const displaySlots = useMemo(() => {
    const carsOnly = slots.filter((car): car is Car => car !== null);
    carsOnly.sort((a, b) => a.price - b.price);

    return [...carsOnly, ...Array(9 - carsOnly.length).fill(null)];
  }, [slots]);

  function Dream9Design({ exportMode = false }: { exportMode?: boolean }) {
    return (
      <div
        className={`w-full text-black ${
          mode === "poster"
            ? "aspect-[3/4] bg-white p-[5%]"
            : "aspect-[4494/5097] bg-white p-[6%]"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="pb-[0%] text-center">
            <div
              className="text-[68px] font-black italic leading-none"
              style={{
                transform: "skewX(-8deg)",
                letterSpacing: "-0.04em",
              }}
            >
              Dream 9
            </div>
          </div>

          <div
            className={`mx-auto grid grid-cols-3 gap-0 ${
              mode === "shirt" ? "w-[95%]" : "w-full"
            }`}
          >
            {displaySlots.map((car, index) => {
              const type = car ? classFromPrice(car.price) : "P";

              return (
                <button
                  key={index}
                  type="button"
                  onClick={exportMode ? undefined : () => selectSlot(index)}
                  style={{ backgroundColor: classTint(type) }}
                  className={`aspect-square overflow-hidden border p-0 transition ${
                    !exportMode && selectedSlot === index
                      ? "border-[3px] border-red-600"
                      : "border border-black"
                  }`}
                >
                  {car ? (
                    <div className="relative h-full w-full overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.model}
                        crossOrigin="anonymous"
                        decoding="sync"
                        loading="eager"
                        className="absolute left-1/2 top-1/2 w-[200%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
                      />

                      {!exportMode && deleteReadySlot === index && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                          <span className="text-[42px] font-black text-red-500">
                            ✕
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-[clamp(8px,2vw,14px)] font-black text-black/35">
                      Empty
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div
            className={`mx-auto grid grid-cols-3 gap-x-[3%] gap-y-[5px] pt-[2.5%] font-black leading-[1.25] text-black ${
              mode === "shirt" ? "w-[95%]" : "w-full"
            }`}
          >
            {displaySlots.map((car, index) => (
              <div
                key={index}
                className={`min-w-0 overflow-hidden whitespace-nowrap ${
                  exportMode
                    ? "text-[7.8px]"
                    : "text-[clamp(4.2px,1.25vw,7.8px)] lg:text-[7.8px]"
                } ${
                  index % 3 === 0
                    ? "text-left"
                    : index % 3 === 1
                    ? "text-center"
                    : "text-right"
                }`}
              >
                {car && <>{car.model}</>}
              </div>
            ))}
          </div>

          {mode === "poster" && (
            <div className="mt-auto flex items-end justify-between pt-[4%]">
              <div className="self-end -translate-y-[2px] text-[clamp(10px,2.5vw,16px)] font-black text-black/45">
                {today}
              </div>

              <img
                src="/someday.png"
                alt="Someday, one day."
                crossOrigin="anonymous"
                decoding="sync"
                loading="eager"
                className="mr-[-1%] translate-y-[5px] w-[50%] object-contain opacity-45"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black px-4 py-5 text-white md:p-6">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[420px_1fr] lg:gap-8">
        <section className="order-1 min-w-0 overflow-hidden lg:order-2">
         <div className="mx-auto mb-2 grid w-full max-w-[540px] gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={shuffleDream9}
              className="bg-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/15 active:scale-[0.97]"
            >
              Shuffle
            </button>

            <button
              onClick={clearDream9}
              className="bg-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/15 active:scale-[0.97]"
            >
              Clear
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMode("shirt");
                setShowSizePicker(false);
              }}
              className={`px-5 py-4 text-sm font-black transition ${
                mode === "shirt"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              Shirt
            </button>

            <button
              onClick={() => {
                setMode("poster");
                setShowSizePicker(false);
              }}
              className={`px-5 py-4 text-sm font-black transition ${
                mode === "poster"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              Poster
            </button>
          </div>

          <button
            onClick={makePoster}
            disabled={!allSlotsFilled || isMakingDesign}
            className={`w-full py-4 text-sm font-black transition active:scale-[0.97] ${
              isMakingDesign
                ? "bg-red-700 text-white"
                : allSlotsFilled
                ? "animate-pulse bg-red-600 text-white hover:bg-red-700"
                : "cursor-not-allowed bg-white/10 text-white"
            }`}
          >
            {isMakingDesign ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Building...
              </span>
            ) : allSlotsFilled ? (
              mode === "poster" ? (
                "Buy Poster - $21.99"
              ) : showSizePicker ? (
                "Buy Shirt - $32.99"
              ) : (
                "Choose Shirt Size"
              )
            ) : (
              "Fill all 9 slots"
            )}
          </button>

          <p className="text-center text-xs font-bold text-white/55">
            {mode === "shirt" && showSizePicker
              ? "Select shirt size."
              : "Pick your 9 favorite cars below."}
          </p>

          {mode === "shirt" && showSizePicker && (
            <div className="grid grid-cols-4 gap-2">
              {(["S", "M", "L", "XL"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setShirtSize(size)}
                  className={`py-3 text-sm font-black transition ${
                    shirtSize === size
                      ? "bg-red-600 text-white"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mx-auto w-full max-w-[540px] overflow-hidden">
          <div ref={posterRef}>
            <Dream9Design />
          </div>
        </div>
        </section>

        <section className="order-2 min-w-0 lg:order-1">
          <div className="min-w-0 overflow-hidden border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-4">
              <h1 className="text-3xl font-black tracking-tight">
                Build Your Dream 9
              </h1>

              <p className="mt-2 text-sm text-white/50">
                Shuffle your Dream 9, or tap any slot to replace a car.
              </p>
            </div>

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedBrand(null);
              }}
              placeholder="Search all cars..."
              className="w-full border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40"
            />

            <div className="mt-4 max-h-[60vh] overflow-auto pr-1">
              {query.trim() ? (
                <div className="space-y-2">
                  {searchResults.map((car) => (
                    <button
                      key={car.id}
                      onClick={() => addCarToTargetSlot(car)}
                      style={{
                        backgroundColor: classTint(classFromPrice(car.price)),
                      }}
                      className="flex min-w-0 w-full max-w-full items-center gap-3 overflow-hidden border border-black/20 p-3 text-left text-black transition hover:brightness-95"
                    >
                      <img
                        src={car.image}
                        alt={car.model}
                        crossOrigin="anonymous"
                        decoding="sync"
                        loading="eager"
                        className="h-14 w-24 shrink-0 object-contain"
                      />

                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="truncate font-black">
                          {car.brand} {car.model}
                        </div>

                        <div className="text-sm text-black/60">
                          ♠{car.price.toLocaleString()}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : selectedBrand ? (
                <div>
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="mb-4 border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/15"
                  >
                    ← Back to Brands
                  </button>

                  <h2 className="mb-3 text-xl font-black">{selectedBrand}</h2>

                  <div className="space-y-2">
                    {brandCars.map((car) => (
                      <button
                        key={car.id}
                        onClick={() => addCarToTargetSlot(car)}
                        style={{
                          backgroundColor: classTint(classFromPrice(car.price)),
                        }}
                        className="flex min-w-0 w-full max-w-full items-center gap-3 overflow-hidden border border-black/20 p-3 text-left text-black transition hover:brightness-95"
                      >
                        <img
                          src={car.image}
                          alt={car.model}
                          crossOrigin="anonymous"
                          decoding="sync"
                          loading="eager"
                          className="h-14 w-24 shrink-0 object-contain"
                        />

                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="truncate font-black">{car.model}</div>

                          <div className="text-sm text-black/60">
                            ♠{car.price.toLocaleString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="mb-3 text-xl font-black">Choose a Brand</h2>

                  <div className="grid grid-cols-2 gap-1.5">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className="border border-white/10 bg-white/[0.06] px-4 py-2.5 text-left font-black transition hover:bg-white/10"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}
             </div>
          </div>
        </section>
      </div>
      <div className="fixed left-[-9999px] top-0">
        <div ref={exportRef} className="w-[540px]">
          <Dream9Design exportMode />
        </div>
      </div>
    </main>
  );
}