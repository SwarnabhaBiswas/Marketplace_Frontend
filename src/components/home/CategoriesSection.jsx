import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const catRef = useRef(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    pointerType: "mouse",
  });

useEffect(() => {
  (async () => {
    try {
      const res = await api.get("/categories");
      const cats = res.data.data || [];
      // Sort Z -> A (case-insensitive)
      cats.sort((a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: "base" }));
      setCategories(cats);
    } catch (e) {}
  })();
}, []);


  useEffect(() => {
    const el = catRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "auto" });
  }, [categories.length]);

  const catsToShow = categories.map((c) => c.name);

  // Map by slug to avoid whitespace/casing/punctuation mismatches (same logic as backend)
  function slugifyLocal(name) {
    return String(name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  const catImgMap = {
    'rigid-pvc-conduit': '/cat-rigid-pvc-conduit.jpg',
    'circular-box': '/cat-circular-box.jpg',
    'pvc-conduit-accessories': '/cat-pvc-conduit-accessories.jpg',
    'modular-box': '/cat-modular-box.jpg',
    'mcb-box': '/cat-mcb-box.jpeg',
    'mcb-distribution-box': '/cat-mcb-box.jpeg',
    'fan-box':'/cat-fan-box.jpg',
    'fan-accessories':'/cat-fan-accessories.jpeg',
    'conceal-box':'/cat-conceal-box.jpg'
  };

  function getCatImg(name) {
    const key = slugifyLocal(name || '');
    return catImgMap[key] || '/cat-default.svg';
  }
  
  function onCatPointerDown(e) {
    const el = catRef.current;
    if (!el) return;
    if (e.pointerType && e.pointerType !== "touch") {
      drag.current.active = false;
      return;
    }
    drag.current = {
      active: false,
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: el.scrollLeft,
      pointerType: "touch",
    };
  }

  function onCatPointerMove(e) {
    const el = catRef.current;
    if (!el) return;
    const d = drag.current;
    if (d.pointerType !== "touch") return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.active) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        d.active = true;
        try {
          el.setPointerCapture(e.pointerId);
        } catch {}
      } else {
        return;
      }
    }
    el.scrollLeft = d.scrollLeft - dx;
  }

  function onCatPointerUp(e) {
    const el = catRef.current;
    if (!el) return;
    if (drag.current.pointerType !== "touch") return;
    drag.current.active = false;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {}
  }

  function onCatWheel(e) {
    const el = catRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: "auto" });
    }
  }

  return (
    <section
      className="relative bg-primary text-platinum"
      aria-labelledby="home-categories"
    >
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-1">
            <h2 id="home-categories" className="text-2xl sm:text-3xl font-bold">
              Product Categories
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              Our extensive product range includes a wide variety of pipes and
              fittings, tailored to meet the unique requirements of our clients.
            </p>
            <Link
              to="/products"
              className="text-medium relative overflow-hidden mt-6 inline-flex items-center rounded-md border border-none px-5 py-2 bg-attention text-platinum bg-gradient-to-l from-white/10 to-attention bg-[length:200%_100%] bg-right transition-all duration-500 hover:bg-primary hover:text-platinum"
            >
              Discover all Products
            </Link>
          </div>

          <div className="lg:col-span-2">
            <div className="relative pb-12">
              <div
                ref={catRef}
                id="catScroller"
                className="overflow-x-auto scroll-auto no-scrollbar touch-auto select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory"
                onPointerDown={onCatPointerDown}
                onPointerMove={onCatPointerMove}
                onPointerUp={onCatPointerUp}
                onPointerCancel={onCatPointerUp}
                onWheel={onCatWheel}
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="flex gap-5 pr-10 justify-start">
                  {catsToShow.slice(0, 10).map((c) => (
                    <Link
                      key={c}
                      to={`/products?category=${encodeURIComponent(c)}`}
                      className="group w-[240px] sm:w-[280px] md:w-[320px] flex-shrink-0 snap-start"
                    >
                      <div className="h-[170px] sm:h-[200px] md:h-[220px] overflow-hidden rounded-xl bg-white shadow-lg">
                        <img
                          src={getCatImg(c)}
                          alt={`${c} category`}
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 640px) 260px, (max-width: 768px) 300px, 320px"
                          className="h-full w-full object-cover transition-transform duration-300 ease-out md:group-hover:scale-110 active:scale-95"
                        />
                      </div>
                      <div className="mt-2 text-base sm:text-lg font-medium text-white/90">
                        {c}
                      </div>
                    </Link>
                  ))}

                  <Link
                    to="/products"
                    className="group w-[240px] sm:w-[280px] md:w-[320px] flex-shrink-0 snap-start"
                  >
                    <div className="relative h-[170px] sm:h-[200px] md:h-[220px] overflow-hidden rounded-xl bg-white shadow-lg">
                      <img
                        src="/discover-all.png"
                        alt="Explore all categories"
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 640px) 260px, (max-width: 768px) 300px, 320px"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="rounded-full bg-black/40 px-4 py-2 text-white">
                          Explore all
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-base sm:text-lg font-medium text-white/90">
                      Discover all Products
                    </div>
                  </Link>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-2 right-2 sm:bottom-0 sm:right-0 mb-1 flex gap-2">
                <button
                  aria-label="Prev"
                  onClick={() => {
                    const el = catRef.current;
                    if (el) el.scrollBy({ left: -320, behavior: "smooth" });
                  }}
                  className="pointer-events-auto h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center"
                >
                  ‹
                </button>
                <button
                  aria-label="Next"
                  onClick={() => {
                    const el = catRef.current;
                    if (el) el.scrollBy({ left: 320, behavior: "smooth" });
                  }}
                  className="pointer-events-auto h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
