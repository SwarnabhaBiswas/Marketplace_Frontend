import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useForm } from 'react-hook-form';

function ContactForm(){
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const msg = `${data.message}\n\nState: ${data.state || ''}\nCity: ${data.city || ''}\nPin: ${data.pin || ''}`;
      await api.post('/contact', { name: data.name, email: data.email, phone: data.phone, message: msg });
      alert('Thanks! We will reach out shortly.');
      reset();
    } catch (e) {
      console.error(e);
      alert('Submission failed');
    }
    setSubmitting(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <input {...register('name', { required: 'Name is required' })} placeholder="What’s your name? *" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('phone', { required: 'Phone is required' })} placeholder="Mobile number *" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('email', { required: 'Email is required', pattern: { value: /[^\s@]+@[^\s@]+\.[^\s@]+/, message: 'Invalid email' } })} placeholder="What email ID can we reach out to? *" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('country')} placeholder="Country" defaultValue="India" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('state')} placeholder="State" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('city')} placeholder="What’s the name of your city?" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('pin')} placeholder="Pin Code" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <textarea {...register('message', { required: 'Message is required' })} placeholder="Message *" className="min-h-[120px] w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand md:col-span-2" />
      <div className="md:col-span-2 flex justify-center">
        <button disabled={submitting} className="rounded-full bg-rose-500 px-8 py-3 text-white disabled:opacity-60">{submitting ? 'Submitting...' : 'SUBMIT'}</button>
      </div>
    </form>
  );
}

export default function Home(){
  // Hero carousel
  const heroImages = ['/hero-1.svg','/hero-2.svg','/hero-3.svg'];
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const touchStartX = useRef(null);
  useEffect(()=>{
    if (hover) return;
    const t = setInterval(()=> setIdx(i => (i+1) % heroImages.length), 3500);
    return ()=> clearInterval(t);
  }, [hover]);
  function prev(){ setIdx(i => (i - 1 + heroImages.length) % heroImages.length); }
  function next(){ setIdx(i => (i + 1) % heroImages.length); }
  function onTouchStart(e){ touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e){
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); }
    touchStartX.current = null;
  }

  // Categories for scroller
  const [categories, setCategories] = useState([]);
  useEffect(()=>{
    (async ()=>{
      try{
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      }catch(e){ /* ignore */ }
    })();
  },[]);
  const catsToShow = categories.map(c=>c.name);

  const catImgMap = {
    'pipes': '/cat-pipes.svg',
    'pipe & fittings': '/cat-fittings.svg',
    'fittings': '/cat-fittings.svg',
    'accessories': '/cat-accessories.svg',
    'conduits': '/cat-conduits.svg',
    'trunking': '/cat-trunking.svg'
  };
  function getCatImg(name){
    const key = (name||'').toLowerCase();
    return catImgMap[key] || '/cat-default.svg';
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero fullscreen carousel */}
        <section className="relative bg-primary text-platinum">
          <div
            className="relative h-[70vh] sm:h-[80vh] lg:h-[92vh] overflow-hidden"
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="absolute inset-0 flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${(idx * 100) / heroImages.length}%)`, width: `${heroImages.length * 100}%` }}>
              {heroImages.map((src)=> (
                <div key={src} className="relative h-full flex-shrink-0" style={{ width: `${100/heroImages.length}%` }}>
                  <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-300 ease-out md:hover:scale-110 active:scale-95 select-none" />
                </div>
              ))}
            </div>
            <button aria-label="Prev" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded bg-black/30 px-3 py-2 text-white md:hover:bg-black/40">‹</button>
            <button aria-label="Next" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-black/30 px-3 py-2 text-white md:hover:bg-black/40">›</button>
          </div>
        </section>

        {/* Who are we */}
        <section className="container mx-auto px-4 py-10 max-w-5xl">
          <h2 className="text-2xl font-semibold">Who are we?</h2>
          <p className="mt-2 text-slate-700 max-w-3xl">
            Swasti manufactures premium quality conduits and accessories. Durable, certified and ready for large-scale supply.
            We support distributors and contractors with reliable volumes and consistent quality.
          </p>
          <div className="mt-3">
            <Link to="/about" className="text-brand underline-offset-2 hover:underline">Learn more about us →</Link>
          </div>
        </section>

        {/* Categories showcase (two-column with scroller and arrows) */}
        <section className="relative bg-primary text-platinum">
          <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Left intro */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl sm:text-3xl font-bold">Product Categories</h2>
                <p className="mt-3 text-sm sm:text-base text-slate-300">
                  Our extensive product range includes a wide variety of pipes and fittings, tailored to meet the unique requirements
                  of our clients.
                </p>
                <Link to="/products" className="mt-6 inline-flex items-center rounded-md border border-white/30 px-5 py-2 hover:bg-white/10">Discover all Products</Link>
              </div>

              {/* Right scroller */}
              <div className="lg:col-span-2">
                <div className="relative pb-12">
                  <div className="overflow-x-auto scroll-smooth no-scrollbar" id="catScroller">
                    <div className="flex gap-5 pr-10 justify-center">
                      {catsToShow.slice(0,6).map((c) => (
                        <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="group w-[260px] sm:w-[300px] md:w-[320px] flex-shrink-0">
                          <div className="h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden rounded-xl bg-white shadow-lg">
                            <img src={getCatImg(c)} alt={`${c} category`} className="h-full w-full object-cover transition-transform duration-300 ease-out md:group-hover:scale-110 active:scale-95" />
                          </div>
                          <div className="mt-2 text-base sm:text-lg font-medium text-white/90">{c}</div>
                        </Link>
                      ))}
                      {/* Explore all categories box */}
                      <Link to="/products" className="group w-[260px] sm:w-[300px] md:w-[320px] flex-shrink-0">
                        <div className="relative h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden rounded-xl bg-white shadow-lg">
                          <img src="/category-see-all.svg" alt="Explore all categories" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="rounded-full bg-black/40 px-4 py-2 text-white">Explore all</span>
                          </div>
                        </div>
                        <div className="mt-2 text-base sm:text-lg font-medium text-white/90">Discover all Products</div>
                      </Link>
                    </div>
                  </div>
                  {/* Arrows with spacing */}
                  <div className="absolute bottom-0 right-0 mb-1 flex gap-2">
                    <button aria-label="Prev" onClick={()=>{ const el=document.getElementById('catScroller'); if(el) el.scrollBy({left:-300, behavior:'smooth'}); }} className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center">‹</button>
                    <button aria-label="Next" onClick={()=>{ const el=document.getElementById('catScroller'); if(el) el.scrollBy({left:300, behavior:'smooth'}); }} className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center">›</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder message card */}
        <section className="container mx-auto px-4 py-10">
          <div className="mx-auto max-w-6xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Text side */}
              <div className="p-6 sm:p-8 md:p-10">
                <h2 className="text-xl sm:text-2xl font-bold text-orange-600">Founder's Message</h2>
                <p className="mt-6 text-slate-800 text-lg sm:text-xl font-medium">
                  “ If there is passion in heart, nothing is impossible ”.
                </p>
                <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-brand hover:underline">
                  Read more <span aria-hidden>→</span>
                </Link>
              </div>
              {/* Image side */}
              <div className="relative">
                <img src="/founder.svg" alt="Founder" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Become a dealer card */}
        <section className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="rounded-2xl bg-slate-50 p-8 text-center ring-1 ring-slate-100">
            <img src="/handshake.svg" alt="Handshake" className="mx-auto mb-4 h-20 w-20 opacity-70" />
            <h3 className="text-2xl font-bold text-slate-800">Become a dealer</h3>
            <p className="mt-2 text-slate-600">Become a channel partner and join our network of distributors and retailers.</p>
            <Link to="/become-dealer" className="mt-6 inline-flex items-center rounded-full bg-rose-500 px-6 py-3 text-white">JOIN US</Link>
          </div>
        </section>

        {/* Get in touch form */}
        <section className="container mx-auto px-4 py-10 max-w-6xl">
          <h2 className="text-3xl font-semibold text-center">Get in touch</h2>
          <ContactForm />
        </section>

        {/* Assistance CTA */}
        <section className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="rounded-lg border border-slate-200 bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold">Need assistance?</h3>
              <p className="text-slate-600">Reach out to us for product guidance, quotes, and dealer partnerships.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/support" className="rounded-md border px-4 py-2">Contact Us</Link>
              <Link to="/become-dealer" className="rounded-md bg-brand px-4 py-2 text-white">Business Enquiry</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
