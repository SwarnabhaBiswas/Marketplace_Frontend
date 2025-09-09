import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const touchStartX = useRef(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lbZoom, setLbZoom] = useState(1);
  const [lbTx, setLbTx] = useState(0);
  const [lbTy, setLbTy] = useState(0);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragStartOffsetRef = useRef({ x: 0, y: 0 });
  const lbStartX = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/products/" + slug);
        setProduct(res.data.data);
        setIdx(0);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [slug]);

  // autoplay
  // useEffect(() => {
  //   if (!product?.images || product.images.length <= 1) return;
  //   if (hover) return; // pause on hover
  //   const t = setInterval(() => {
  //     setIdx((i) => (i + 1) % product.images.length);
  //   }, 3000);
  //   return () => clearInterval(t);
  // }, [product?.images, hover]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  if (!product)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  const images =
    product.images && product.images.length
      ? product.images
      : [{ url: "/placeholder.svg" }];
  const current = images[Math.min(idx, images.length - 1)];

  function prev() {
    setIdx((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setIdx((i) => (i + 1) % images.length);
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

  function openLightbox() {
    // Enable lightbox for all screen sizes
    setLightboxOpen(true);
    setLbZoom(1);
    setLbTx(0);
    setLbTy(0);
  }
  function closeLightbox() {
    setLightboxOpen(false);
  }

  function startDrag(e) {
    if (lbZoom <= 1) return;
    draggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragStartOffsetRef.current = { x: lbTx, y: lbTy };
  }
  function moveDrag(e) {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setLbTx(dragStartOffsetRef.current.x + dx);
    setLbTy(dragStartOffsetRef.current.y + dy);
  }
  function endDrag() {
    draggingRef.current = false;
  }

  // Render description: ordered list if author used numbered bullets, else paragraph
  function renderDescription(desc) {
    if (!desc) return null;
    const raw = String(desc);
    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const numberedCount = lines.filter((l) => /^\d+[\).\-\s]+/.test(l)).length;
    if (numberedCount >= 2) {
      return (
        <ol className="mt-3 list-decimal pl-6 space-y-2 text-primary ">
          {lines.map((l, i) => (
            <li key={i}>{l.replace(/^\d+[\).\-\s]+/, "").trim()}</li>
          ))}
        </ol>
      );
    }
    return <p className="mt-3 text-primary whitespace-pre-line">{raw}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-platinum overflow-x-hidden">
      <Header />

      {/* Top-left back button */}
      <div className="fixed left-4 top-24 z-30">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center rounded-md bg-attention px-3 py-1.5 text-sm font-medium text-platinum shadow-md hover:bg-accent"
        >
          ← Back to Products
        </button>
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-7 md:px-40 py-6 mt-[7.5rem]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Media */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl bg-[#d9dade] text-platinum p-4 sm:p-5 shadow-2xl">
                <div
                  className="relative overflow-hidden rounded-xl"
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <img
                    src={current.url}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                    alt={product.name}
                    onClick={openLightbox}
                    className="md:h-[40vw] h-[50vw] md:max-h-[360px] max-h-[460px] w-full object-cover rounded-xl cursor-zoom-in transition-transform duration-300 ease-out hover:scale-[1.02] shadow-2xl"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="hidden md:inline-flex z-20 absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral font-bold text-primary px-3 py-2 hover:bg-primary hover:text-platinum"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="hidden md:inline-flex z-20 absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral font-bold text-primary px-3 py-2 hover:bg-primary hover:text-platinum"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-3 right-4 text-xs bg-black/30 px-2 py-1 rounded-full">
                        {idx + 1}/{images.length}
                      </div>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {images.map((im, i) => (
                      <button
                        key={im.publicId || im.url}
                        onClick={() => setIdx(i)}
                        className={`h-14 w-16 overflow-hidden rounded border ${
                          i === idx ? "border-accent" : "border-platinum/30"
                        }`}
                      >
                        <img src={im.url} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-neutral bg-white p-5 shadow-xl">
                <h1 className="text-3xl font-semibold text-primary capitalize tracking-tight">
                  {product.name}
                </h1>

                {renderDescription(product.description)}

                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-base font-semibold text-primary">Specifications</h3>
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-primary/90">
                      {Object.entries(product.specs).map(([k, v]) => (
                        <li key={k}>
                          <span className="font-semibold">{k}:</span> {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={`/become-dealer?enquiryType=bulk&prefill=${encodeURIComponent(
                      `Product: ${product.name}` +
                      (product?.specs && Object.keys(product.specs).length
                        ? ` | Specs: ${Object.entries(product.specs)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(', ')}`
                        : '')
                    )}`}
                    className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-white hover:opacity-90"
                  >
                    Request Bulk Quote
                  </Link>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70"
          onClick={closeLightbox}
        >
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute right-4 top-4 z-[101] rounded-md bg-white/20 px-3 py-2 text-white hover:bg-white/30 text-lg"
          >
            ✕
          </button>

          <div
            className="absolute inset-0 flex items-center justify-center p-3"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => { lbStartX.current = e.touches?.[0]?.clientX ?? null; }}
            onTouchEnd={(e) => {
              if (lbStartX.current == null) return;
              const dx = e.changedTouches?.[0]?.clientX - lbStartX.current;
              lbStartX.current = null;
              if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); }
            }}
          >
            <div
              className="relative w-[80vw] max-w-3xl md:max-w-4xl h-[80vh] max-h-[90vh] overflow-hidden"
              onMouseMove={moveDrag}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
            >
              {images.length > 1 && (
                <>
                </>
              )}
              <div
                className="absolute inset-0 flex items-center justify-center overflow-hidden"
                onMouseDown={startDrag}
              >
                <img
                  src={current.url}
                  alt=""
                  className="max-h-full max-w-full select-none"
                  style={{
                    transform: `translate(${lbTx}px, ${lbTy}px) scale(${lbZoom})`,
                    transition: draggingRef.current ? "none" : "transform 150ms ease-out",
                  }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setLbZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)));
                    if (lbZoom <= 1) {
                      setLbTx(0);
                      setLbTy(0);
                    }
                  }}
                  className="rounded font-bold text-md bg-accent px-2 py-1 text-primary hover:bg-white/20"
                >
                  -
                </button>
                <span className="text-primary bg-neutral text-sm min-w-[3rem] text-center border rounded-xl">{Math.round(lbZoom * 100)}%</span>
                <button
                  onClick={() => {
                    setLbZoom((z) => Math.min(5, +(z + 0.2).toFixed(2)));
                  }}
                  className="rounded font-bold text-md bg-accent px-2 py-1 text-primary hover:bg-white/20"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    setLbZoom(1);
                    setLbTx(0);
                    setLbTy(0);
                  }}
                  className="rounded bg-accent px-2 py-1 text-primary hover:bg-white/20"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Minimal footer */}
      <footer className="bg-primary w-screen h-[4rem] text-platinum flex items-center justify-center font-semibold">Swasti@2025</footer>
    </div>
  );
}
