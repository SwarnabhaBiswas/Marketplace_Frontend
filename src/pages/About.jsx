import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { m } from 'framer-motion';
import { fadeSlideUp, fadeSlideLeft, fadeSlideRight, containerStagger } from '../lib/motion';

export default function About(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* About hero */}
        <section className="bg-primary text-platinum">
          <div className="container mx-auto px-4 py-12 max-w-6xl mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              <m.div variants={containerStagger(0.08)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <m.h1 className="text-4xl sm:text-5xl font-bold" variants={fadeSlideLeft}>About Swasti</m.h1>
                <m.p className="mt-3 text-platinum/90 max-w-3xl" variants={fadeSlideLeft} custom={0.08}>
                  Swasti delivers premium electrical conduits and accessories, committed to reliable
                  infrastructure for homes, industry and public works. We focus on durability, certification, and
                  on-time delivery at scale.
                </m.p>
              </m.div>
              <m.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeSlideRight}>
                <img src="/Banner_2.jpg" alt="About illustration" loading="lazy" decoding="async" className="w-full h-auto" />
              </m.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 max-w-6xl">
<m.section className="mt-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerStagger(0.08)}>
            <m.div variants={fadeSlideLeft}>
              <h2 className="text-2xl font-semibold">Company Profile</h2>
              <p className="mt-2 text-slate-700">
              Swasti delivers uPVC conduits,
              fittings and MS accessories that meet stringent quality benchmarks. Our team brings decades of
              product and process expertise to serve contractors & dealers.
              </p>
            </m.div>
          </m.section>

<m.section id="why-us" className="mt-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerStagger(0.08)}>
            <h2 className="text-2xl font-semibold">Why Us?</h2>
            <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: supporting image */}
                <m.div className="relative" variants={fadeSlideLeft}>
                  <img
                    src="/why-us.jpg"
                    alt="Swasti operations"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src='/founder.svg'; }}
                  />
                </m.div>

                {/* Right: why-us pointers */}
                <m.div className="p-6 sm:p-8" variants={fadeSlideRight} custom={0.08}>
                  <h3 className="text-xl font-extrabold text-attention">What sets us apart</h3>
                  <ul className="mt-4 space-y-3 text-slate-800">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-attention" />
                      <span>In compliance with IS:9537 Part III of the Bureau of Indian Standards.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-attention" />
                      <span>Outstanding value: high-quality products that deliver great return for your money.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-attention" />
                      <span>Trusted by leading real-estate developers who rely on our brand and commitment.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-attention" />
                      <span>Experienced and dedicated management team backing every engagement.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-attention" />
                      <span>Relentless focus on customer satisfaction at every touchpoint.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-attention" />
                      <span>Special care in packaging to ensure products arrive with zero defects.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-attention" />
                      <span>Dedicated logistics team for on-time delivery to your preferred location.</span>
                    </li>
                  </ul>
                </m.div>
              </div>
            </div>
          </m.section>

<m.section id="quality" className="mt-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerStagger(0.08)}>
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: text */}
                <m.div className="p-6 sm:p-8" variants={fadeSlideLeft}>
                  <h3 className="text-2xl font-extrabold text-attention">Quality :</h3>
                  <p className="mt-3 text-slate-700">
                    We prioritize the quality of our products as a fundamental criterion that sets us apart in the market.
                    Our quality systems emphasize traceability and continual improvement — from raw material procurement to final dispatch.
                  </p>

                  <h4 className="mt-6 text-lg font-semibold">Quality tests we perform</h4>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-800">
                    <li>Marking test</li>
                    <li>Dimension test</li>
                    <li>Construction test</li>
                    <li>Bending test</li>
                    <li>Compression test (during and after the load)</li>
                    <li>Impact test (mechanical properties)</li>
                    <li>Collapse test (mechanical properties)</li>
                  </ul>
                </m.div>

                {/* Right: image */}
                <m.div className="relative" variants={fadeSlideRight} custom={0.08}>
                  <img
                    src="/iso-9001.jpg"
                    alt="ISO 9001 Quality Management"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src='/quality.jpg'; }}
                  />
                </m.div>
              </div>
            </div>
          </m.section>

          {/* Passion & Professionalism card with video */}
<m.section id="craft" className="mt-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerStagger(0.08)}>
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: text */}
                <m.div className="p-6 sm:p-8" variants={fadeSlideLeft}>
                  <h3 className="text-2xl font-extrabold text-attention">Passion & Professionalism</h3>
                  <p className="mt-3 text-slate-700">
                    We put our heart into every product we make. From thoughtful design to rigorous testing, our
                    teams operate with craftsmanship, discipline and a customer-first mindset—so you can count on
                    consistent quality, reliable timelines and transparent communication.
                  </p>
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-attention" /> ISO-aligned processes</li>
                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-attention" /> Skilled, trained workforce</li>
                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-attention" /> On-time, in-full delivery</li>
                    <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-attention" /> Customer-first service</li>
                  </ul>
                </m.div>

                {/* Right: responsive video (replace /about.mp4 with your actual asset or embed) */}
                <m.div className="relative p-6 sm:p-8" variants={fadeSlideRight} custom={0.08}>
                  <div className="relative w-full overflow-hidden rounded-xl bg-black">
                    {/* 16:9 aspect ratio */}
                    <div className="pt-[56.25%]" />
                    <div className="absolute inset-0">
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        poster="/Banner_2.jpg"
                        className="h-full w-full rounded-xl object-contain"
                      >
                        <source src="/vid1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </m.div>
              </div>
            </div>
          </m.section>

<m.section id="founder" className="mt-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerStagger(0.08)}>
            <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-5">                <m.img
                  src="/founder.jpg"
                  alt="Founder"
                  loading="lazy"
                  decoding="async"
                  className="h-30 w-28 rounded-xl object-cover"
                  variants={fadeSlideLeft}
                />
                <m.div variants={fadeSlideRight} custom={0.08} className="text-center sm:text-left">
                  <h3 className="text-2xl font-extrabold text-attention">Founder's Message</h3>
                  <p className="mt-2 text-md text-slate-800">“ At Swasti Pipes, our vision has always been to deliver products that dealers and distributors can trust. We focus on consistency, durability, and timely supply, ensuring your business grows with ours. Together, we build partnerships that last as strong as our products. ”</p>
                  
                </m.div>
              </div>
            </div>
          </m.section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

