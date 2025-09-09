import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const heroImages = ["/hero1.png", "/hero2.png", "/hero3.png"];
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(() => heroImages.map(() => false));
  const touchStartX = useRef(null);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % heroImages.length),
      6500
    );
    return () => clearInterval(t);
  }, []);

  function prev() {
    setIdx((i) => (i - 1 + heroImages.length) % heroImages.length);
  }
  function next() {
    setIdx((i) => (i + 1) % heroImages.length);
  }
  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      dx > 0 ? prev() : next();
    }
    touchStartX.current = null;
  }
  function handleLoad(i) {
    setLoaded((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  }

  return (
    <section className="relative bg-neutral text-platinum">
      <div
        className="relative h-[70vh] sm:h-[80vh] lg:h-[95vh] overflow-hidden "
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Overlay headline & description */}
        <div className="pointer-events-none absolute left-4 right-4 top-8 sm:left-8 sm:top-14 lg:left-16 lg:top-20 z-10 max-w-4xl">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl md:mt-40 mt-40 font-extrabold leading-tight ">
            {/* lg+: single line */}
            <span className="hidden lg:inline bg-gradient-to-b from-[#aad2fa] to-[#020e1aff] bg-clip-text text-transparent">Swasti Pipes & Solutions</span>
            <span className="mt-5 block sm:hidden bg-gradient-to-b from-[#aad2fa] to-[#020e1aff] bg-clip-text text-transparent">Swasti Pipes</span>
            <span className="block sm:hidden bg-gradient-to-b from-[#aad2fa] to-[#020e1aff] bg-clip-text text-transparent">& Solutions</span>

            {/* mobile (<sm): split */}
            <span className="mt-5 block sm:hidden bg-gradient-to-b from-[#aad2fa] to-[#020e1aff] bg-clip-text text-transparent">Solutions That</span>
            <span className="block sm:hidden bg-gradient-to-b from-[#aad2fa] to-[#020e1aff] bg-clip-text text-transparent">Last.</span>

            {/* md only */}
            <span className="hidden md:block lg:hidden bg-gradient-to-b from-[#aad2fa] to-[#020e1aff] bg-clip-text text-transparent">Solutions That</span>
            <span className="hidden md:block lg:hidden bg-gradient-to-b from-[#aad2fa] to-[#020e1aff] bg-clip-text text-transparent">Last.</span>
            <span className="hidden md:hidden lg:block bg-gradient-to-b from-[#aad2fa] to-[#020e1aff] bg-clip-text text-transparent mt-5">Solutions That Last..</span>
          </h1>

          {/* Sub-text */}
          <p className="flex flex-col mt-5 md:mt-5 md:ml-5 text-sm sm:text-lg lg:text-xl text-primary italic lg:mt-7 lg:ml-20">
            {/* Mobile split */}
            <span className="md:hidden lg:hidden">
              Long-lasting. Leak-proof. Trusted
            </span>
            <span className="md:hidden lg:hidden">for every connection.</span>

            {/* lg full line */}
            <span className="hidden lg:block">
              Long-lasting. Leak-proof. Trusted for every connection.
            </span>

            {/* CTA */}
            <Link
              to="/about"
              className="bg-attention mt-3 md:mt-5 md:w-[10rem] transition-all duration-500 hover:bg-[#ff974c] px-2 py-1 rounded pointer-events-auto w-[7rem] text-center"
            >
              Know More ...
            </Link>
          </p>
        </div>

        {/* Images slider */}
        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-out will-change-transform"
          style={{
            transform: `translateX(-${
              (idx * 100) / heroImages.length
            }%)`,
            width: `${heroImages.length * 100}%`,
          }}
        >
          {heroImages.map((src, i) => (
            <div
              key={src}
              className="relative h-full flex-shrink-0"
              style={{ width: `${100 / heroImages.length}%` }}
            >
              {/* Skeleton gradient */}
              <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                  loaded[i] ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  background:
                    "linear-gradient(180deg, var(--color-platinum, #F9FAFB) 0%, var(--color-neutral, #d9d9d9ff) 100%)",
                }}
              />
              <img
                src={src}
                alt="Hero"
                loading={i === 0 ? "eager" : "lazy"}
                fetchpriority={i === 0 ? "high" : "low"}
                decoding="async"
                sizes="100vw"
                onLoad={() => handleLoad(i)}
                className="h-full w-full object-cover transition-transform duration-300 ease-out md:hover:scale-110 active:scale-95 select-none"
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          aria-label="Prev"
          onClick={prev}
          className="hidden sm:block absolute left-3 top-1/2 -translate-y-1/2 rounded bg-black/30 px-3 py-2 text-white md:hover:bg-black/40"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 rounded bg-black/30 px-3 py-2 text-white md:hover:bg-black/40"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {heroImages.map((_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === idx ? "bg-primary" : "bg-platinum"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
