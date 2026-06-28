"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import cars from "../../data/cars.json";
import { featuredCars } from "../../data/featuredCars";

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(true);

  const SHOPIFY_STORE_URL = "https://carscenebrand.com";
  const SHIRT_VARIANT_IDS = {
  M: "53558192668979",
  L: "53558192701747",
  XL: "53558192734515",
  "2XL": "53558192767283",
} as const;

  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchView, setSearchView] = useState<"featured" | "brands">("featured");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [featuredSeed, setFeaturedSeed] = useState(0);
  function getRandomDream9() {
    return [...allCars]
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);
  }
  const [slots, setSlots] = useState<(Car | null)[]>(() => {
    const randomFeatured = [...featuredCars]
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);

    return randomFeatured.map(
      (name) => allCars.find((car) => car.model === name) ?? null
    );
  });

  const [shirtSize, setShirtSize] = useState<"M" | "L" | "XL" | "2XL" | null>(null);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [deleteReadySlot, setDeleteReadySlot] = useState<number | null>(null);
  const [isMakingDesign, setIsMakingDesign] = useState(false);

  const [showIntroPopup, setShowIntroPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  useEffect(() => {
    setShowIntroPopup(false);
  }, []);

  function closeIntroPopup() {
    localStorage.setItem("dream9-popup-seen", "true");
    setShowIntroPopup(false);
  }

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

  const featuredCarsList = useMemo(() => {
    return [...allCars]
      .sort(() => Math.random() - 0.5)
      .slice(0, 100);
  }, [allCars, featuredSeed]);

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
      const next = [...current];

      const indexToReplace =
        selectedSlot !== null
          ? selectedSlot
          : next.findIndex((slot) => slot === null);

      if (indexToReplace === -1) {
        next[8] = car;
      } else {
        next[indexToReplace] = car;
      }

      return next;
    });

    setSelectedSlot(null);
    setSelectedBrand(null);
    setQuery("");
    setSearchView("featured");
    setFeaturedSeed((s) => s + 1);
    setDeleteReadySlot(null);

    setTimeout(() => {
      const y =
        instructionsRef.current!.getBoundingClientRect().top +
        window.scrollY -
        20;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }, 100);
  }

  function selectSlot(index: number) {
    setSelectedSlot(index);
    setSelectedBrand(null);
    setQuery("");
    setSearchView("featured");
    setDeleteReadySlot(null);

    setTimeout(() => {
      const y =
        searchSectionRef.current!.getBoundingClientRect().top +
        window.scrollY -
        8;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }, 100);
  }

  async function submitEmail() {
    if (!email.includes("@") || isSubmittingEmail) return;

    try {
      setIsSubmittingEmail(true);

      const response = await fetch("https://formspree.io/f/xvzjpogb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          source: "Dream 9",
          coupon: "GARAGE10",
        }),
      });

      if (!response.ok) {
        throw new Error("Formspree submission failed.");
      }

      setEmailSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Could not save email. Try again.");
    } finally {
      setIsSubmittingEmail(false);
    }
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
  
  async function makePoster(size: "M" | "L" | "XL" | "2XL") {
    if (!exportRef.current || !allSlotsFilled || isMakingDesign) return;

    const node = exportRef.current;

    try {

      setIsMakingDesign(true);

      await waitForPosterImages(node);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 8.3222222222,
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
      const variantId = SHIRT_VARIANT_IDS[size];

      const checkoutUrl =
        `${SHOPIFY_STORE_URL}/cart/add?id=${variantId}` +
        `&quantity=1` +
        `&properties[Dream 9 Design URL]=${encodeURIComponent(designUrl)}` +
        `&properties[Dream 9 Product]=${encodeURIComponent("Shirt")}` +
        `&properties[Dream 9 Size]=${encodeURIComponent(size)}`;

      window.location.href = checkoutUrl + "&return_to=/checkout";
    } catch (error) {
      console.error("MAKE POSTER FAILED:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create design."
      );
    } finally {
      setIsMakingDesign(false);
    }
  }

  const displaySlots = useMemo(() => {
    const filledSlots = slots
      .map((car, realIndex) => ({ car, realIndex }))
      .filter((slot): slot is { car: Car; realIndex: number } => slot.car !== null)
      .sort((a, b) => a.car.price - b.car.price);

    const emptySlots = slots
      .map((car, realIndex) => ({ car, realIndex }))
      .filter((slot) => slot.car === null);

    return [...filledSlots, ...emptySlots];
  }, [slots]);

  function Dream9Design({ exportMode = false }: { exportMode?: boolean }) {
    return (
      <div
        className={`relative w-full overflow-hidden transition-transform duration-300 ${
          exportMode ? "h-full" : "aspect-[4494/5097]"
        }`}
      >
        <img
          src="/Dream9Template.png"
          alt="Dream 9 Shirt"
          crossOrigin="anonymous"
          className="absolute inset-0 h-full w-full scale-150 object-contain"
        />

        <div
          className="absolute text-center font-black italic text-black"
          style={{
            top: "15.5%",
            left: "50%",
            transform: "translateX(-50%) skewX(-8deg)",
            fontSize: "clamp(18px, 4vw, 33px)",
            letterSpacing: "-0.04em",
          }}
        >
          Dream 9
        </div>

        <div
          className="absolute"
          style={{
            top: "22%",
            left: "30%",
            width: "40%",
          }}
        >
          <div className="grid grid-cols-3 gap-0">
            {displaySlots.map(({ car, realIndex }, index) => {
              const type = car ? classFromPrice(car.price) : "P";

              return (
                <button
                  key={index}
                  type="button"
                  onClick={exportMode ? undefined : () => selectSlot(realIndex)}
                  style={{ backgroundColor: "transparent" }}
                  className="aspect-square overflow-hidden border-[0.5px] border-black md:border p-0 transition"
                >
                  {car ? (
                    <div className="relative h-full w-full overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.model}
                        crossOrigin="anonymous"
                        decoding="sync"
                        loading="eager"
                        className="absolute -right-[35%] -bottom-[0%] h-[95%] w-auto max-w-none object-contain"
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
            <div
              className="absolute text-center text-black"
              style={{
                top: "100%",
                left: "0",
                width: "100%",
                marginTop: "1px",
              }}
            >
              <div
                className="grid grid-cols-3 gap-x-[3%] gap-y-[5px] pt-[2.5%] font-black leading-[1] text-black"
              >
                {displaySlots.map(({ car }, index) => (
                  <div
                    key={index}
                    className={`min-w-0 whitespace-nowrap ${
                      exportMode
                        ? "text-[7.8px]"
                        : "text-[clamp(2px,0.55vw,3.5px)]"
                    } ${
                      index % 3 === 0
                        ? "text-left"
                        : index % 3 === 1
                        ? "text-center"
                        : "text-right"
                    }`}
                  >
                    {car ? car.model : "Empty"}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function OldExportDesign({ exportMode = false }: { exportMode?: boolean }) {
    return (
      <div
        className={`w-full text-black ${
          exportMode ? "h-full bg-white" : "aspect-[4494/5097] bg-white"
        } p-[6%]`}
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

          <div className="mx-auto grid w-[95%] grid-cols-3 gap-0">
            {displaySlots.map(({ car, realIndex }, index) => {
              const type = car ? classFromPrice(car.price) : "P";

              return (
                <button
                  key={index}
                  type="button"
                  onClick={exportMode ? undefined : () => selectSlot(realIndex)}
                  style={{ backgroundColor: "transparent" }}
                  className="aspect-square overflow-hidden border border-black p-0 transition"
                >
                  {car ? (
                    <div className="relative h-full w-full overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.model}
                        crossOrigin="anonymous"
                        decoding="sync"
                        loading="eager"
                        className="absolute -right-[35%] -bottom-[0%] h-[95%] w-auto max-w-none object-contain"
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

          <div className="mx-auto grid w-[95%] grid-cols-3 gap-x-[3%] gap-y-[5px] pt-[2.5%] font-black leading-[1.25] text-black">
            {displaySlots.map(({ car }, index) => (
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
                {car ? car.model : "Empty"}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black px-4 py-5 text-white md:p-6">
      <div className="mx-auto grid w-full max-w-7xl gap-0 lg:grid-cols-[420px_1fr] lg:gap-8">
        <section className="order-1 min-w-0 overflow-hidden lg:order-2">
        <div
          ref={instructionsRef}
          className="mx-auto mb-4 w-full max-w-[540px] text-center"
        >
          <h1 className="text-[34px] font-black leading-[0.95] tracking-tight sm:text-4xl">
            Your 9 favorite cars.
            <br />
            <span className="text-red-600">All on one shirt.</span>
          </h1>

          <p className="mt-3 text-sm font-bold text-white/55">
            Tap any car to make it yours.
          </p>
        </div>

        <div className="mx-auto mb-4 w-full max-w-[540px] overflow-hidden">
          <div ref={posterRef} className="relative overflow-visible">
            <div
              className={`origin-[50%_30%] transition-transform duration-300 ${
                zoomed ? "scale-[2.1]" : "scale-100"
              }`}
            >
              <Dream9Design />
            </div>

            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              className="absolute top-1 right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-gray-400 text-xl text-white shadow-lg transition hover:bg-gray-600 active:scale-95"
              aria-label="Zoom Dream 9 preview"
            >
              🔍
            </button>
          </div>
        </div>

        <div className="mx-auto mb-2 grid w-full max-w-[540px] gap-2">
          <button
            onClick={() => {
              if (!allSlotsFilled) return;
              setShowSizePicker(true);
            }}
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
            ) : !allSlotsFilled ? (
              "Fill all 9 slots"
            ) : showSizePicker ? (
              "Select Shirt Size"
            ) : (
              "Buy Shirt - $34.99 USD"
            )}
          </button>

          {showSizePicker && allSlotsFilled && (
            <div className="grid grid-cols-4 gap-2">
              {(["M", "L", "XL", "2XL"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setShirtSize(size);

                    setTimeout(() => {
                      makePoster(size);
                    }, 150);
                  }}
                  disabled={isMakingDesign}
                  className={`py-4 text-sm font-black text-white transition disabled:opacity-60 ${
                    shirtSize === size
                      ? "bg-red-600"
                      : "bg-white/10 hover:bg-red-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mx-auto mb-4 grid w-full max-w-[540px] gap-2">
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
        </div>

        <div className="mx-auto mb-4 grid w-full max-w-[540px] gap-2">
          {displaySlots.map(({ car, realIndex }, index) => (
            <button
              key={index}
              type="button"
              onClick={() => selectSlot(realIndex)}
              style={
                car
                  ? {
                      backgroundColor: classTint(classFromPrice(car.price)),
                      color: "black",
                    }
                  : undefined
              }
              className={`w-full px-4 py-3 text-left text-sm font-black transition ${
                car
                  ? "hover:brightness-95"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {car ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate">{car.model}</span>
                  <span className="shrink-0 bg-black/10 px-3 py-1 text-xs font-black text-black/70">
                    Replace
                  </span>
                </div>
              ) : (
                "Select a Car"
              )}
            </button>
          ))}
        </div>

        <div className="mx-auto mb-4 w-full max-w-[540px] border border-white/10 bg-white/[0.04] p-4">
            <h3 className="text-lg font-black">
              Get 10% Off Your Dream 9 Shirt
            </h3>

            <p className="mt-1 text-sm text-white/60">
              {emailSubmitted
                ? "Success! Use code GARAGE10 at checkout."
                : "Enter your email and we'll send you a coupon code."}
            </p>

            {!emailSubmitted && (
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="min-w-0 flex-1 bg-white/10 px-4 py-3 outline-none"
                />

                <button
                  onClick={submitEmail}
                  disabled={isSubmittingEmail}
                  className="bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {isSubmittingEmail ? "Saving..." : "Get 10% Off"}
                </button>
              </div>
            )}
          </div>

        </section>

        <section className="order-2 min-w-0 lg:order-1">
          <div
            ref={searchSectionRef}
            className="min-w-0 overflow-hidden border border-white/10 bg-white/[0.04] p-4"
          >
            <div className="mb-4">
              <h1 className="text-3xl font-black tracking-tight">
                Search 1,596 Cars
              </h1>

              <p className="mt-2 text-sm text-white/50">
                Choose a featured car, search for a car, or browse by brand.
              </p>
            </div>

            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedBrand(null);
              }}
              placeholder="Search all cars..."
              className="w-full border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40"
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedBrand(null);
                  setSearchView("featured");
                }}
                className={`py-3 text-sm font-black transition ${
                  searchView === "featured"
                    ? "bg-red-600 text-white"
                    : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                Featured
              </button>

              <button
                onClick={() => {
                  setQuery("");
                  setSelectedBrand(null);
                  setSearchView("brands");
                }}
                className={`py-3 text-sm font-black transition ${
                  searchView === "brands"
                    ? "bg-red-600 text-white"
                    : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                Brands
              </button>
            </div>

            <div className="mt-4 h-[360px] overflow-y-auto pr-1 sm:h-[60vh]">
              {query.trim() ? (
                <div className="space-y-2">
                  {searchResults.length === 0 ? (
                    <div className="flex h-[260px] items-center justify-center border border-white/10 bg-white/[0.04] text-center text-sm font-black text-white/40">
                      No cars found
                    </div>
                  ) : (
                    searchResults.map((car) => (
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
                        <div className="line-clamp-2 font-black leading-tight">
                          {car.model}
                        </div>

                        <div className="text-sm text-black/60">
                          ♠{car.price.toLocaleString()}
                        </div>
                      </div>
                    </button>
                  ))
                )}
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
                          <div className="line-clamp-2 font-black leading-tight">{car.model}</div>

                          <div className="text-sm text-black/60">
                            ♠{car.price.toLocaleString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchView === "featured" ? (
                <div>
                  <h2 className="mb-3 text-xl font-black">Featured Cars</h2>

                  <div className="space-y-2">
                    {featuredCarsList.map((car) => (
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
                          <div className="line-clamp-2 font-black leading-tight">
                            {car.model}
                          </div>

                          <div className="text-sm text-black/60">
                            ♠{car.price.toLocaleString()}
                          </div>
                        </div>
                      </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setFeaturedSeed((s) => s + 1);

                          setTimeout(() => {
                            searchSectionRef.current
                              ?.querySelector(".overflow-y-auto")
                              ?.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              });
                          }, 0);
                        }}
                        className="mt-3 w-full bg-white/10 py-3 text-sm font-black text-white transition hover:bg-white/15"
                      >
                        Show 100 More Cars
                      </button>
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

      {showIntroPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5">
          <div className="w-full max-w-sm border border-white/10 bg-[#111] p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Customize your Dream 9
            </h2>

            <div className="mt-4 space-y-2 text-left text-sm font-bold leading-relaxed text-white/70">
              <p>• Double-tap a car to remove it.</p>
              <p>• Scroll down to search for cars.</p>
              <p>• Build a T-Shirt or Poster.</p>
            </div>

            <button
              onClick={closeIntroPopup}
              className="mt-6 w-full bg-red-600 py-4 text-sm font-black text-white transition hover:bg-red-700 active:scale-[0.97]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
      <div className="pointer-events-none fixed left-0 top-0 opacity-0">
        <div
          ref={exportRef}
          style={{
            width: "540px",
            height: "612.45px",
          }}
        >
          <OldExportDesign exportMode />
        </div>
      </div>
    </main>
  );
}