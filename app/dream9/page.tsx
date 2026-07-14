"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import cars from "../../data/cars.json";
import { featuredCars } from "../../data/featuredCars";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

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

function gridColor(color: string) {
  return color === "White" ? "#000000" : "#FFFFFF";
}

function shareBackgroundColor(color: string) {
  switch (color) {
    case "Black":
      return "#111111";
    case "True Navy":
      return "#101a33";
    case "Blue Spruce":
      return "#2f4f4f";
    case "Orchid":
      return "#ffb6c1";
    case "White":
    default:
      return "#ffffff";
  }
}

export default function Dream9Page() {
  const SITE_PAUSED = false;

  if (SITE_PAUSED) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white">
        <div className="max-w-md">
          <h1 className="text-4xl font-black text-red-600">
            Dream 9 is temporarily paused
          </h1>

          <p className="mt-4 text-sm font-bold text-white/60">
            We’re making a few updates. Check back soon.
          </p>
        </div>
      </main>
    );
  }
  const allCars = cars as Car[];
  const posterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const designGenerationRef = useRef(0);
  const shareExportRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const [showFront, setShowFront] = useState(false);
  const [previewStep, setPreviewStep] = useState(0);

  const SHOPIFY_STORE_URL = "https://carscenebrand.com";
  const SHIRT_COLORS = {
    White: {
      front: "/carscenefront-white.png",
      back: "/Dream9Template-white.png",
      sizes: ["S", "M", "L", "XL", "2XL"],
    },
    Black: {
      front: "/carscenefront-black.png",
      back: "/Dream9Template-black.png",
      sizes: ["S", "M", "L", "XL", "2XL"],
    },
    "Blue Spruce": {
      front: "/carscenefront-blue-spruce.png",
      back: "/Dream9Template-blue-spruce.png",
      sizes: ["S", "M", "L", "XL", "2XL"],
    },
    "True Navy": {
      front: "/carscenefront-true-navy.png",
      back: "/Dream9Template-true-navy.png",
      sizes: ["S", "M", "L", "XL", "2XL"],
    },
    Orchid: {
      front: "/carscenefront-orchid.png",
      back: "/Dream9Template-orchid.png",
      sizes: ["S", "M", "L", "XL", "2XL"],
    },
  } as const;

  type ShirtColor = keyof typeof SHIRT_COLORS;
  type ShirtSize = "S" | "M" | "L" | "XL" | "2XL";
  type ProductType = "shirt" | "mug";

  const SHIRT_VARIANT_IDS: Record<ShirtColor, Partial<Record<ShirtSize, string>>> = {
    White: {
      S: "53631942623539",
      M: "53558192668979",
      L: "53558192701747",
      XL: "53558192734515",
      "2XL": "53558192767283",
    },
    Black: {
      S: "53631955173683",
      M: "53631955206451",
      L: "53631955239219",
      XL: "53631955271987",
      "2XL": "53631955304755",
    },
    "Blue Spruce": {
      S: "53631963201843",
      M: "53631963234611",
      L: "53631963267379",
      XL: "53631963300147",
      "2XL": "53631963332915",
    },
    "True Navy": {
      S: "53631969329459",
      M: "53631969362227",
      L: "53631969394995",
      XL: "53631969427763",
      "2XL": "53631969460531",
    },
    Orchid: {
      S: "53631977062707",
      M: "53631977095475",
      L: "53638299910451",
      XL: "53631977161011",
      "2XL": "53631977193779",
    },
  };

  const MUG_VARIANT_ID = "53652974698803";

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
  const lastLogged = useRef("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchView, setSearchView] = useState<"featured" | "brands">("featured");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [featuredSeed, setFeaturedSeed] = useState(0);
  const [hasCustomizedDream9, setHasCustomizedDream9] = useState(false);
  const [showShuffleConfirm, setShowShuffleConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  function getRandomDream9() {
    return [...allCars]
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);
  }
  const [slots, setSlots] = useState<(Car | null)[]>(
    Array(9).fill(null)
  );

  const hasInitializedSlots = useRef(false);

  useEffect(() => {
    if (hasInitializedSlots.current) return;

    hasInitializedSlots.current = true;

    const randomFeatured = [...featuredCars]
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);

    setSlots(
      randomFeatured.map(
        (name) => allCars.find((car) => car.model === name) ?? null
      )
    );
  }, []);

  const [deleteReadySlot, setDeleteReadySlot] = useState<number | null>(null);
  const [isMakingDesign, setIsMakingDesign] = useState(false);
  const [preparedDesignBlob, setPreparedDesignBlob] = useState<Blob | null>(null);
  const [prepareDesignPromise, setPrepareDesignPromise] =
    useState<Promise<Blob> | null>(null);
  const [showCheckoutHint, setShowCheckoutHint] = useState(false);
  const [shouldPulseBuyButton, setShouldPulseBuyButton] = useState(false);
  const [pulseEye, setPulseEye] = useState(false);
  const [hasUsedEye, setHasUsedEye] = useState(false);

  const [showIntroPopup, setShowIntroPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [productType, setProductType] =
    useState<ProductType>("shirt");

  const [shirtColor, setShirtColor] =
    useState<ShirtColor>("Black");

  const [shirtSize, setShirtSize] =
    useState<ShirtSize>("L");

  const isMug = productType === "mug";

  useEffect(() => {
    if (productType === "mug") {
      setShowFront(false);
      setPreviewStep(0);
      setPulseEye(false);
    }
  }, [productType]);

  useEffect(() => {
    setShowIntroPopup(false);
  }, []);

  function closeIntroPopup() {
    setShowIntroPopup(false);
  }

  const allSlotsFilled = slots.every((slot) => slot !== null);

  useEffect(() => {
    designGenerationRef.current += 1;
    setPreparedDesignBlob(null);
    setPrepareDesignPromise(null);

    if (!allSlotsFilled) return;

    const timer = setTimeout(() => {
      startPreparingDesign();
    }, 1500);

    return () => clearTimeout(timer);
  }, [slots, shirtColor, productType, allSlotsFilled]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCheckoutHint(true);
      setShouldPulseBuyButton(true);
    }, 1 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasUsedEye) {
      setPulseEye(false);
      return;
    }

    const interval = setInterval(() => {
      setPulseEye(true);

      setTimeout(() => {
        setPulseEye(false);
      }, 700);
    }, 20000);

    return () => clearInterval(interval);
  }, [hasUsedEye]);

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

  useEffect(() => {
    const q = query.trim().toLowerCase();

    if (q.length < 3) return;

    const timer = setTimeout(() => {
      if (lastLogged.current === q) return;

      lastLogged.current = q;

      fetch("/api/search-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: q,
          results_count: searchResults.length,
        }),
      }).catch((error) => {
        console.error("Could not log search:", error);
      });
    }, 900);

    return () => clearTimeout(timer);
  }, [query, searchResults.length]);

  const brandCars = useMemo(() => {
    if (!selectedBrand) return [];
    return allCars.filter((car) => car.brand === selectedBrand);
  }, [selectedBrand, allCars]);

  const [featuredCarsList, setFeaturedCarsList] = useState<Car[]>([]);

  useEffect(() => {
    setFeaturedCarsList(
      [...allCars]
        .sort(() => Math.random() - 0.5)
        .slice(0, 100)
    );
  }, [featuredSeed]);

  function randomizeDream9() {
    setSlots(getRandomDream9());
    setSelectedSlot(null);
    setSelectedBrand(null);
    setQuery("");
    setDeleteReadySlot(null);
    setHasCustomizedDream9(false);
    setPreparedDesignBlob(null);
    setPrepareDesignPromise(null);
  }

  function emptyDream9() {
    setSlots(Array(9).fill(null));
    setSelectedSlot(null);
    setSelectedBrand(null);
    setQuery("");
    setDeleteReadySlot(null);
    setHasCustomizedDream9(false);
    setPreparedDesignBlob(null);
    setPrepareDesignPromise(null);
  }

  function shuffleDream9() {
    if (hasCustomizedDream9) {
      setShowShuffleConfirm(true);
      return;
    }

    randomizeDream9();
  }

  function clearDream9() {
    if (hasCustomizedDream9) {
      setShowClearConfirm(true);
      return;
    }

    emptyDream9();
  }
  function addCarToTargetSlot(car: Car) {
    setHasCustomizedDream9(true);
    setPreparedDesignBlob(null);
    setPrepareDesignPromise(null);

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
          coupon: "DREAM9",
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

  function cyclePreview() {
    setHasUsedEye(true);
    setPreviewStep((currentStep) => {
      const nextStep = (currentStep + 1) % 3;

      if (nextStep === 0) {
        // Zoomed in on the back
        setShowFront(false);
      } else if (nextStep === 1) {
        // Zoomed out on the back
        setShowFront(false);
      } else {
        // Zoomed out on the front
        setShowFront(true);
      }

      return nextStep;
    });
  }

  async function shareDream9() {
    if (!shareExportRef.current || !allSlotsFilled) {
      alert("Fill all 9 slots before sharing.");
      return;
    }

    const node = shareExportRef.current;

    try {
      await waitForPosterImages(node);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 4,
        backgroundColor: isMug
          ? "#ffffff"
          : shareBackgroundColor(shirtColor),
        imagePlaceholder:
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      });

      const blob = await (await fetch(dataUrl)).blob();

      const file = new File([blob], "dream9-carscene.png", {
        type: "image/png",
      });

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] }) &&
        navigator.share
      ) {
        await navigator.share({
          title: "My Dream 9 Garage",
          text: "Build your own Dream 9 at carsceneapp.com",
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "dream9-carscene.png";
        link.click();
      }
    } catch (error) {
      console.error("SHARE DREAM 9 FAILED:", error);
      alert("Could not share your Dream 9. Try again.");
    }
  }
  
  async function prepareDesignBlob() {
    if (!exportRef.current || !allSlotsFilled) {
      throw new Error("Design is not ready yet.");
    }

    const node = exportRef.current;

    await waitForPosterImages(node);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 8.3222222222,
      backgroundColor: "transparent",
      imagePlaceholder:
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
    });

    return await (await fetch(dataUrl)).blob();
  }

  async function uploadDesignBlob(blob: Blob) {
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

    return cloudinaryData.secure_url as string;
  }

  function startPreparingDesign() {
    if (!allSlotsFilled) return;

    const generation = designGenerationRef.current;

    setPreparedDesignBlob(null);

    const promise = prepareDesignBlob();

    setPrepareDesignPromise(promise);

    promise
      .then((blob) => {
        // Only keep the PNG if the design has not changed.
        if (generation === designGenerationRef.current) {
          setPreparedDesignBlob(blob);
          setPrepareDesignPromise(null);
        }
      })
      .catch((error) => {
        console.error("BACKGROUND DESIGN PREP FAILED:", error);

        if (generation === designGenerationRef.current) {
          setPrepareDesignPromise(null);
          setPreparedDesignBlob(null);
        }
      });
  }

  async function makePoster(size: ShirtSize) {
    if (!allSlotsFilled || isMakingDesign) return;

    try {
      setIsMakingDesign(true);

      let designBlob = preparedDesignBlob;

      if (!designBlob) {
        designBlob = prepareDesignPromise
          ? await prepareDesignPromise
          : await prepareDesignBlob();
      }

      const designUrl = await uploadDesignBlob(designBlob);

      const variantId =
        productType === "mug"
          ? MUG_VARIANT_ID
          : SHIRT_VARIANT_IDS[shirtColor][size];

      if (!variantId) {
        alert(
          productType === "mug"
            ? "The mug checkout variant is not connected."
            : `${shirtColor} is not available in ${size}.`
        );
        return;
      }

      const checkoutValue = productType === "mug" ? 19.99 : 34.99;
      const checkoutName =
        productType === "mug" ? "Dream 9 Coffee Mug" : "Dream 9 Shirt";

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "InitiateCheckout", {
          value: checkoutValue,
          currency: "USD",
          content_name: checkoutName,
          content_type: "product",
          content_ids: [variantId],
          num_items: 1,
        });
      }

      const checkoutUrl =
        `${SHOPIFY_STORE_URL}/cart/add?id=${variantId}` +
        `&quantity=1` +
        `&properties[Dream 9 Design URL]=${encodeURIComponent(designUrl)}` +
        `&properties[Dream 9 Product]=${encodeURIComponent(
          productType === "mug" ? "Mug" : "Shirt"
        )}` +
        `&properties[Dream 9 Size]=${encodeURIComponent(
          productType === "mug" ? "11oz" : size
        )}` +
        (productType === "shirt"
          ? `&properties[Dream 9 Color]=${encodeURIComponent(shirtColor)}`
          : "") +
        `&return_to=/checkout`;

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("MAKE POSTER FAILED:", error);
      alert(error instanceof Error ? error.message : "Failed to create design.");
    } finally {
      setIsMakingDesign(false);
    }
  }

  function ColorPicker() {
    const COLOR_SWATCHES: Record<ShirtColor, string> = {
      White: "#f5f5f0",
      Black: "#111111",
      "Blue Spruce": "#2f4f4f",
      "True Navy": "#3d5774ff",
      Orchid: "#D8BFD8",
    };

    const COLOR_ORDER: ShirtColor[] = [
      "Black",
      "True Navy",
      "Blue Spruce",
      "White",
      "Orchid",
    ];

    return (
      <div className="grid grid-cols-5 gap-2">
        {COLOR_ORDER.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => {
              setShirtColor(color);
              setPreparedDesignBlob(null);
              setPrepareDesignPromise(null);
            }}
            title={color}
            style={{ backgroundColor: COLOR_SWATCHES[color] }}
            className={`h-12 border-2 transition active:scale-[0.97] ${
              shirtColor === color
                ? "border-red-600"
                : "border-white/20 hover:border-white/50"
            }`}
          />
        ))}
      </div>
    );
  }

  function SizePicker() {
    const SIZE_ORDER: ShirtSize[] = ["S", "M", "L", "XL", "2XL"];

    return (
      <div className="grid grid-cols-5 gap-2">
        {SIZE_ORDER.map((size) => {
          const isAvailable = SHIRT_COLORS[shirtColor].sizes.includes(
            size as never
          );

          return (
            <button
              key={size}
              type="button"
              disabled={!isAvailable || isMakingDesign}
              onClick={() => setShirtSize(size)}
              className={`h-12 text-sm font-black transition active:scale-[0.97] ${
                shirtSize === size
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/15"
              } ${
                !isAvailable
                  ? "cursor-not-allowed opacity-30"
                  : ""
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    );
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

  function renderDream9Design(exportMode = false) {
    const borderColor = isMug
      ? "#000000"
      : gridColor(shirtColor);

    return (
      <div
        className={`relative w-full overflow-hidden transition-transform duration-300 ${
          exportMode ? "h-full" : "aspect-[4494/5097]"
        }`}
      >
        {!isMug && (
          <img
            src={SHIRT_COLORS[shirtColor].back}
            alt="Dream 9 Shirt"
            crossOrigin="anonymous"
            className="absolute inset-0 h-full w-full scale-150 object-contain"
          />
        )}

        {isMug && (
          <div className="absolute inset-0 bg-white" />
        )}

        <div
          className="absolute text-center font-black italic"
          style={{
            color: borderColor,
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
                  key={car?.id ?? `empty-${realIndex}`}
                  type="button"
                  onClick={exportMode ? undefined : () => selectSlot(realIndex)}
                  style={{
                    backgroundColor: "transparent",
                    borderColor,
                  }}
                  className="aspect-square overflow-hidden border-[0.5px] md:border p-0 transition"
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
                    <div className="flex h-full items-center justify-center text-[clamp(8px,2vw,14px)] font-black"
                      style={{ color: borderColor + "66" }}>
                      Empty
                    </div>
                  )}
                </button>
              );
            })}
            <div
              className="absolute text-center"
              style={{
                color: borderColor,
                top: "100%",
                left: "0",
                width: "100%",
                marginTop: "1px",
              }}
            >
              <div
                className="grid grid-cols-3 gap-x-[3%] gap-y-[5px] pt-[2.5%] font-black leading-[1]"
                style={{ color: borderColor }}
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

  function OldExportDesign({
    exportMode = false,
    title = "Dream 9",
  }: {
    exportMode?: boolean;
    title?: string;
  }) {
    const exportGridColor = isMug
      ? "#000000"
      : gridColor(shirtColor);
    return (
      <div
        className={`relative w-full ${
          exportMode ? "h-full" : "aspect-[4494/5097]"
        } p-[6%]`}
        style={{
          color: exportGridColor,
          backgroundColor: "transparent",
        }}
      >
        {exportMode && title === "Dream 9" && (
          <>
            <div className="absolute left-0 top-0 h-[1px] w-[1px] bg-white/5" />
            <div className="absolute right-0 top-0 h-[1px] w-[1px] bg-white/5" />
            <div className="absolute bottom-0 left-0 h-[1px] w-[1px] bg-white/5" />
            <div className="absolute bottom-0 right-0 h-[1px] w-[1px] bg-white/5" />
          </>
        )}
        <div className="flex h-full flex-col">
          <div className="relative pb-[0%] text-center">
            <div
              className="text-[68px] font-black italic leading-none"
              style={{
                transform: "skewX(-8deg)",
                letterSpacing: "-0.04em",
                color: exportGridColor,
              }}
            >
              {title}
            </div>
            {title === "My Dream 9" && (
              <div
                className="absolute right-3 text-[12px] font-bold text-neutral-400/50 whitespace-nowrap"
                style={{
                  top: "-18px",
                }}
              >
                Build yours at carsceneapp.com
              </div>
            )}
          </div>

          <div className="mx-auto grid w-[95%] grid-cols-3 gap-0">
            {displaySlots.map(({ car, realIndex }, index) => {
              const type = car ? classFromPrice(car.price) : "P";

              return (
                <button
                  key={car?.id ?? `empty-${realIndex}`}
                  type="button"
                  onClick={exportMode ? undefined : () => selectSlot(realIndex)}
                  className="aspect-square overflow-hidden border p-0 transition"
                  style={{
                    backgroundColor: title === "My Dream 9"
                      ? shareBackgroundColor(shirtColor)
                      : "transparent",
                    borderColor: exportGridColor,
                  }}
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
                    <div
                      className="flex h-full items-center justify-center text-[clamp(8px,2vw,14px)] font-black"
                      style={{ color: exportGridColor + "66" }}
                    >
                      Empty
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mx-auto grid w-[95%] grid-cols-3 gap-x-[3%] gap-y-[5px] pt-[2.5%] font-black leading-[1.25]"
            style={{ color: exportGridColor }}>
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
            <span className="text-red-600">
              {productType === "mug" ? "All on one mug." : "All on one shirt."}
            </span>
          </h1>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setProductType("shirt")}
            className={`py-3 text-sm font-black transition active:scale-[0.97] ${
              productType === "shirt"
                ? "bg-red-600 text-white"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            T-Shirt
          </button>

          <button
            type="button"
            onClick={() => setProductType("mug")}
            className={`py-3 text-sm font-black transition active:scale-[0.97] ${
              productType === "mug"
                ? "bg-red-600 text-white"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            Coffee Mug
          </button>
        </div>
        </div>

        <div className="mx-auto mb-4 w-full max-w-[540px] overflow-hidden">
          <div ref={posterRef} className="relative overflow-visible">
            <div
              className={`origin-[50%_30%] transition-transform duration-300 ${
                (productType === "shirt" && previewStep === 0) || productType === "mug"
                  ? "scale-[2.1]"
                  : "scale-100"
              }`}
            >
              {productType === "mug" ? (
                renderDream9Design(false)
              ) : showFront ? (
                <div className="relative aspect-[4494/5097] w-full overflow-hidden">
                  <img
                    src={SHIRT_COLORS[shirtColor].front}
                    alt="Front of Dream 9 shirt"
                    className="absolute inset-0 h-full w-full scale-150 object-contain"
                  />
                </div>
              ) : (
                renderDream9Design(false)
              )}
            </div>

            {productType === "shirt" && (
              <button
                type="button"
                onClick={cyclePreview}
                className={`absolute right-3 top-1 z-20 flex h-11 w-11 items-center justify-center rounded-full text-xl text-white shadow-lg transition-colors duration-500 active:scale-95 ${
                  pulseEye
                    ? "bg-red-600"
                    : "bg-gray-400 hover:bg-gray-600"
                }`}
                aria-label="Inspect Dream 9 shirt"
                title="Inspect shirt"
              >
                👁
              </button>
            )}
          </div>
        </div>

        {showCheckoutHint && (
          <div className="mx-auto mb-3 w-full max-w-[540px] text-center">
            <p className="text-sm font-bold text-red-500">
              Wear your Dream 9. Then make it reality.
            </p>
          </div>
        )}

        <div className="mx-auto mb-2 grid w-full max-w-[540px] gap-2">
          <div className="grid grid-cols-3 gap-2">
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
            
            <button
              onClick={shareDream9}
              className="bg-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/15 active:scale-[0.97]"
            >
              Share
            </button>
          </div>
        </div>

        <div className="mx-auto mb-2 grid w-full max-w-[540px] gap-2">
          <button
            onClick={() => {
              if (!allSlotsFilled || isMakingDesign) return;

              makePoster(shirtSize);
            }}
            disabled={!allSlotsFilled || isMakingDesign}
            className={`w-full py-4 text-sm font-black transition active:scale-[0.97] ${
              isMakingDesign
                ? "bg-red-700 text-white"
                : allSlotsFilled
                ? `${shouldPulseBuyButton ? "animate-pulse" : ""} bg-red-600 text-white hover:bg-red-700`
                : "cursor-not-allowed bg-white/10 text-white"
            }`}
          >
            {!allSlotsFilled
              ? "Fill all 9 slots"
              : isMakingDesign
              ? "Preparing Checkout..."
              : productType === "mug"
              ? "24.99 • Free Shipping • 11oz Coffee Mug"
              : `$34.99 • Free Shipping • ${shirtSize} • ${
                  shirtColor === "True Navy"
                    ? "Navy"
                    : shirtColor
                }`}
          </button>
        </div>

        {productType === "shirt" && (
          <div className="mx-auto mb-4 w-full max-w-[540px]">
            <div className="space-y-2">
              <SizePicker />
              <ColorPicker />
            </div>
          </div>
        )}

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

        <div className="relative mx-auto mb-4 flex min-h-[260px] w-full max-w-[540px] flex-col overflow-hidden border border-white/10 bg-white/[0.04] p-6">
          <img
            src="/ShirtMan.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="relative z-10 flex h-full flex-1 flex-col justify-end">
            <h3 className="text-lg font-black">
              Get 10% Off Your Dream 9 Shirt
            </h3>

            <p className="mt-1 text-sm text-white">
              {emailSubmitted
                ? "Success! Use code DREAM9 at checkout."
                : "Enter your email and we'll display a coupon code."}
            </p>

            {!emailSubmitted && (
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="min-w-0 flex-1 border border-white bg-white/10 px-4 py-3 text-white placeholder:text-white/70 outline-none"
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

                          requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                              (
                                searchSectionRef.current?.querySelector(
                                  ".overflow-y-auto"
                                ) as HTMLDivElement | null
                              )?.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              });
                            });
                          });
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

          {/* APP DOWNLOAD */}
          <div className="mt-4 border border-white/10 bg-white/[0.04] p-4">
            <h3 className="text-lg font-black">
              Like cars? Download the app.
            </h3>

            <p className="mt-1 text-sm text-white/60">
              Build your dream garage and go car spotting.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href="https://apps.apple.com/us/app/carscene-dream-garage/id6760978493"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/15"
              >
                iPhone
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.carscene.app"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/15"
              >
                Android
              </a>
            </div>
          </div>
        </section>
      </div>

      {showShuffleConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-[420px] border border-white/10 bg-[#111] p-5 text-center shadow-2xl">
            <h3 className="text-xl font-black text-white">
              Replace all 9 cars?
            </h3>

            <p className="mt-2 text-sm font-bold text-white/60">
              This will replace your current Dream 9 with random cars.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowShuffleConfirm(false)}
                className="bg-white/10 py-4 text-sm font-black text-white transition hover:bg-white/15 active:scale-[0.97]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowShuffleConfirm(false);
                  randomizeDream9();
                }}
                className="bg-red-600 py-4 text-sm font-black text-white transition hover:bg-red-700 active:scale-[0.97]"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-[420px] border border-white/10 bg-[#111] p-5 text-center shadow-2xl">
            <h3 className="text-xl font-black text-white">
              Clear your Dream 9?
            </h3>

            <p className="mt-2 text-sm font-bold text-white/60">
              This will remove every car from your current Dream 9.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="bg-white/10 py-4 text-sm font-black text-white transition hover:bg-white/15 active:scale-[0.97]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowClearConfirm(false);
                  emptyDream9();
                }}
                className="bg-red-600 py-4 text-sm font-black text-white transition hover:bg-red-700 active:scale-[0.97]"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {showIntroPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-xl border border-white/10 bg-[#111] p-5 text-center shadow-2xl">
            <h2 className="text-3xl font-black leading-[0.95] tracking-tight text-white">
              Build a shirt with
              <br />
              <span className="text-red-600">your 9 dream cars.</span>
            </h2>

            <div className="-mt-6 grid grid-cols-2 gap-2">
              <div>
                <img
                  src={SHIRT_COLORS[shirtColor].front}
                  alt="Front of Dream 9 shirt"
                  className="h-[300px] w-full scale-110 object-contain"
                />
                <p className="-mt-3 text-sm font-black text-white/70">Front</p>
              </div>

              <div>
                <img
                  src="/og-image.jpg"
                  alt="Back of Dream 9 shirt"
                  className="h-[300px] w-full scale-110 object-contain"
                />
                <p className="-mt-3 text-sm font-black text-white/70">Back</p>
              </div>
            </div>

            <button
              onClick={closeIntroPopup}
              className="mt-1 w-full bg-red-600 py-4 text-sm font-black text-white transition hover:bg-red-700 active:scale-[0.97]"
            >
              Start Building
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
          <OldExportDesign exportMode title="Dream 9" />
        </div>

        <div
          ref={shareExportRef}
          style={{
            width: "540px",
            height: "612.45px",
          }}
        >
          <OldExportDesign exportMode title="My Dream 9" />
        </div>
      </div>
    </main>
  );
}