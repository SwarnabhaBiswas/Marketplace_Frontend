import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

export default function ProductDetail(){
  const { slug } = useParams();
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

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/products/'+slug);
        setProduct(res.data.data);
        setIdx(0);
      }catch(err){ console.error(err); }
    }
    load();
  }, [slug]);

  // autoplay
  useEffect(() => {
    if (!product?.images || product.images.length <= 1) return;
    if (hover) return; // pause on hover
    const t = setInterval(() => {
      setIdx(i => (i + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(t);
  }, [product?.images, hover]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e){
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  if(!product) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  const images = (product.images && product.images.length ? product.images : [{ url: '/placeholder.svg' }]);
  const current = images[Math.min(idx, images.length - 1)];

  function prev(){ setIdx(i => (i - 1 + images.length) % images.length); }
  function next(){ setIdx(i => (i + 1) % images.length); }
  function onTouchStart(e){ touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e){
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); }
    touchStartX.current = null;
  }

  function openLightbox(){
    setLightboxOpen(true);
    setLbZoom(1); setLbTx(0); setLbTy(0);
  }
  function closeLightbox(){ setLightboxOpen(false); }

  function startDrag(e){
    if (lbZoom <= 1) return;
    draggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragStartOffsetRef.current = { x: lbTx, y: lbTy };
  }
  function moveDrag(e){
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setLbTx(dragStartOffsetRef.current.x + dx);
    setLbTy(dragStartOffsetRef.current.y + dy);
  }
  function endDrag(){ draggingRef.current = false; }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 w-full max-w-2xl mx-auto">
            <div
              className="relative overflow-hidden rounded-lg"
              onMouseEnter={()=>setHover(true)}
              onMouseLeave={()=>setHover(false)}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <img
                src={current.url}
                onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src='/placeholder.svg'; }}
                alt={product.name}
                onClick={openLightbox}
                className="h-64 sm:h-72 md:h-80 lg:h-96 w-full cursor-zoom-in object-cover transition-transform duration-300 ease-out hover:scale-110"
              />
              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded bg-black/40 px-2 py-1 text-white">‹</button>
                  <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-black/40 px-2 py-1 text-white">›</button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((im, i) => (
                  <button key={im.publicId || im.url} onClick={()=>setIdx(i)} className={`h-16 w-20 overflow-hidden rounded border ${i===idx ? 'border-brand' : 'border-slate-200'}`}>
                    <img src={im.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="w-full lg:w-[420px]">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="mt-2 text-slate-700">{product.description}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link to="/become-dealer" className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-white hover:opacity-90">Request Bulk Quote</Link>
            </div>
            {product.specs && (
              <div className="mt-4">
                <h3 className="text-lg font-medium">Specifications</h3>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {Object.entries(product.specs).map(([k,v]) => (
                    <li key={k}><span className="font-semibold">{k}:</span> {v}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      </main>
      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70" onClick={closeLightbox}>
          {/* Close (top-right of screen) */}
          <button
            aria-label="Close"
            onClick={(e)=>{ e.stopPropagation(); closeLightbox(); }}
            className="absolute right-4 top-4 z-[101] rounded-md bg-white/20 px-3 py-2 text-white hover:bg-white/30 text-lg"
          >
            ✕
          </button>

          {/* Modal center wrapper */}
          <div className="absolute inset-0 flex items-center justify-center p-3" onClick={(e)=>e.stopPropagation()}>
            <div className="relative w-[92vw] max-w-3xl md:max-w-4xl h-[80vh] max-h-[90vh] rounded-lg bg-black/90 shadow-2xl overflow-hidden" onMouseMove={moveDrag} onMouseUp={endDrag} onMouseLeave={endDrag}>
              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20">‹</button>
                  <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20">›</button>
                </>
              )}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden" onMouseDown={startDrag}>
                <img
                  src={current.url}
                  alt=""
                  className="max-h-full max-w-full select-none"
                  style={{ transform: `translate(${lbTx}px, ${lbTy}px) scale(${lbZoom})`, transition: draggingRef.current ? 'none' : 'transform 150ms ease-out' }}
                  onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src='/placeholder.svg'; }}
                />
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <button onClick={()=>{ setLbZoom(z=>Math.max(1, +(z-0.2).toFixed(2))); if (lbZoom<=1){ setLbTx(0); setLbTy(0);} }} className="rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20">-</button>
                <span className="text-white text-sm min-w-[3rem] text-center">{Math.round(lbZoom*100)}%</span>
                <button onClick={()=>{ setLbZoom(z=>Math.min(5, +(z+0.2).toFixed(2))); }} className="rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20">+</button>
                <button onClick={()=>{ setLbZoom(1); setLbTx(0); setLbTy(0); }} className="rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20">Reset</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
