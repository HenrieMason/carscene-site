"use client";

import { useMemo, useRef, useState } from "react";
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

  const SHOPIFY_STORE_URL = "https://carscenebrand.com";
  const POSTER_VARIANT_ID = "53410851455283";
  const SHIRT_VARIANT_IDS = {
    S: "53411038757171",
    M: "53411038789939",
    L: "53411038822707",
    XL: "53411038855475",
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [mode, setMode] = useState<"poster" | "shirt">("poster");
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [slots, setSlots] = useState<(Car | null)[]>(Array(9).fill(null));
  const [draggedSlot, setDraggedSlot] = useState<number | null>(null);
  const [sortByValue, setSortByValue] = useState(true);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [shirtSize, setShirtSize] = useState<"S" | "M" | "L" | "XL">("L");

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

  function addCarToTargetSlot(car: Car) {
    setSlots((current) => {
      const next = [...current];

      const fallbackOpenIndex = next.findIndex((slot) => slot === null);

      const indexToFill =
        selectedSlot !== null
          ? selectedSlot
          : fallbackOpenIndex === -1
          ? 0
          : fallbackOpenIndex;

      next[indexToFill] = car;
      return next;
    });

    setSelectedSlot(null);
    setSelectedBrand(null);
    setQuery("");
  }

  function selectSlot(index: number) {
    setSelectedSlot(index);
  }

  function moveSlot(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;

    setSlots((current) => {
      const next = [...current];

      const fromCar = next[fromIndex];
      const toCar = next[toIndex];

      next[toIndex] = fromCar;
      next[fromIndex] = toCar;

      return next;
    });

    setSelectedSlot(toIndex);
  }
  
  async function makePoster() {
    if (!posterRef.current || !allSlotsFilled) return;

    try {
      const isShirt = mode === "shirt";
      if (isShirt && !showSizePicker) {
        setShowSizePicker(true);
        return;
      }

      const exportWidth = isShirt ? 4494 : 3600;
      const exportHeight = isShirt ? 5097 : 4800;

      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 1,
        backgroundColor: "white",
        width: exportWidth,
        height: exportHeight,
        canvasWidth: exportWidth,
        canvasHeight: exportHeight,
        style: {
          margin: "0",
          transform: "none",
          width: `${exportWidth}px`,
          height: `${exportHeight}px`,
        },
      });

      const blob = await (await fetch(dataUrl)).blob();

      const formData = new FormData();
      formData.append("file", blob);
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
    }
  }

  const displaySlots = useMemo(() => {
    if (!sortByValue) return slots;

    const carsOnly = slots.filter((car): car is Car => car !== null);
    carsOnly.sort((a, b) => a.price - b.price);

    return [...carsOnly, ...Array(9 - carsOnly.length).fill(null)];
  }, [slots, sortByValue]);

  return (
    <main className="min-h-screen bg-black px-4 py-5 text-white md:p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[420px_1fr] lg:gap-8">
        <section className="order-1 lg:order-2">
          <div className="mx-auto mb-2 flex w-full max-w-[540px] gap-2">
            <button
              onClick={() => {
                setMode("poster");
                setShowSizePicker(false);
              }}
              className={`flex-1 px-5 py-4 text-sm font-black transition ${
                mode === "poster"
                ? "bg-red-600 text-white"
                : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              Poster
            </button>

            <button
              onClick={() => {
                setMode("shirt");
                setShowSizePicker(false);
              }}
              className={`flex-1 px-5 py-4 text-sm font-black transition ${
                mode === "shirt"
                ? "bg-red-600 text-white"
                : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              Shirt
            </button>
          </div>

          <div className="mx-auto mb-3 flex w-full max-w-[540px] gap-2">
            <button
              onClick={makePoster}
              disabled={!allSlotsFilled}
              className={`flex-1 py-4 text-sm font-black transition ${
                allSlotsFilled
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "cursor-not-allowed bg-white/10 text-white"
              }`}
            >
              {allSlotsFilled
                ? mode === "poster"
                  ? "Make Poster"
                  : showSizePicker
                  ? `Make Shirt - ${shirtSize}`
                  : "Choose Shirt Size"
                : "Fill all 9 slots"}
            </button>

            <button
              onClick={() => setSortByValue((v) => !v)}
              className={`w-[120px] py-4 text-xs font-black transition ${
                sortByValue
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              Sort: {sortByValue ? "ON" : "OFF"}
            </button>
          </div>

          {mode === "shirt" && showSizePicker && (
            <div className="mx-auto mb-3 grid w-full max-w-[540px] grid-cols-4 gap-2">
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

          <div className="mx-auto w-full max-w-[540px]">
            <div
              ref={posterRef}
              className={`w-full text-black ${
                mode === "poster"
                  ? "aspect-[3/4] bg-white p-[5%]"
                  : "aspect-[4494/5097] bg-white p-[6%]"
              }`}
            >
              <div className="flex h-full flex-col">
                <div className="pb-[2%] text-center">
                  <div
                    className="text-[clamp(36px,7vw,68px)] font-black italic leading-none"
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
                    const isSelected = targetSlot === index;

                    return (
                      <button
                        key={index}
                        onClick={() => selectSlot(index)}
                        draggable={car !== null}
                        onDragStart={(e) => {
                          if (!car) return;

                          setSortByValue(false);
                          setDraggedSlot(index);

                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                        }}
                        onDrop={(e) => {
                          e.preventDefault();

                          if (draggedSlot === null) return;

                          moveSlot(draggedSlot, index);
                          setDraggedSlot(null);
                        }}
                        onDragEnd={() => setDraggedSlot(null)}
                        style={{
                          backgroundColor: classTint(type),
                        }}
                        className={`aspect-square overflow-hidden border border-black p-0 transition ${
                          draggedSlot === index ? "opacity-40" : ""
                        }`}
                      >
                        {car ? (
                          <div className="relative h-full w-full overflow-hidden">
                            <img
                              src={car.image}
                              alt={car.model}
                              className="absolute left-1/2 top-1/2 w-[200%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
                            />
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
                  className={`mx-auto grid grid-cols-3 gap-x-[3%] gap-y-[4px] pt-[2.5%] text-[clamp(5px,1.15vw,9px)] font-black leading-none text-black ${
                    mode === "shirt" ? "w-[95%]" : "w-full"
                  }`}
                >
                  {displaySlots.map((car, index) => (
                    <div
                      key={index}
                      className={`min-w-0 ${
                        index % 3 === 0
                          ? "text-left"
                          : index % 3 === 1
                          ? "text-center"
                          : "text-right"
                      }`}
                    >
                      {car && (
                        <>
                          {car.model}{" "}
                          <span className="text-[1.25em]">♠</span>
                          {car.price.toLocaleString()}
                        </>
                      )}
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
                      className="mr-[-1%] translate-y-[5px] w-[50%] object-contain opacity-45"
                    />
                  </div>
                )}
              </div>
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
                Tap a slot, then choose a car. Drag filled slots to move or swap cars.
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
    </main>
  );
}