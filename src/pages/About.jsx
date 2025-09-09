import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { m } from 'framer-motion';
import { fadeSlideUp } from '../lib/motion';

export default function About(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* About hero */}
        <section className="bg-primary text-platinum">
          <div className="container mx-auto px-4 py-12 max-w-6xl mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              <div>
                <m.h1 className="text-4xl sm:text-5xl font-bold" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeSlideUp}>About Swasti</m.h1>
                <m.p className="mt-3 text-platinum/90 max-w-3xl" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeSlideUp} custom={0.08}>
                  Swasti is a manufacturer of premium electrical conduits and accessories, committed to reliable
                  infrastructure for homes, industry and public works. We focus on durability, certification, and
                  on-time delivery at scale.
                </m.p>
              </div>
              <m.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeSlideUp}>
                <img src="/about-illustration.svg" alt="About illustration" loading="lazy" decoding="async" className="w-full h-auto" />
              </m.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <m.section className="mt-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeSlideUp}>
            <m.h2 className="text-2xl font-semibold" variants={fadeSlideUp}>Company Profile</m.h2>
            <m.p className="mt-2 text-slate-700" variants={fadeSlideUp} custom={0.08}>
              With a strong manufacturing backbone and a pan-India network, Swasti delivers uPVC conduits,
              fittings and accessories that meet stringent quality benchmarks. Our team brings decades of
              product and process expertise to serve contractors, distributors and OEMs.
            </m.p>
          </m.section>

          <m.section id="plants" className="mt-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeSlideUp}>
            <m.h2 className="text-2xl font-semibold" variants={fadeSlideUp}>Our Plants</m.h2>
            <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: facility image */}
                <m.div className="relative" variants={fadeSlideUp}>
                  <img
                    src="/plant-facility.jpg"
                    alt="Swasti manufacturing facility"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src='/founder.svg'; }}
                  />
                </m.div>

                {/* Right: content */}
                <m.div className="p-6 sm:p-8" variants={fadeSlideUp} custom={0.08}>
                  <h3 className="text-xl font-extrabold text-attention">Infrastructure :</h3>
                  <p className="mt-3 text-slate-700">
                    At Swasti, we take pride in our state-of-the-art manufacturing infrastructure with in-house
                    tooling, testing and R&amp;D. Spread across a large campus, our lines are designed to fulfill
                    orders of every size while maintaining strict quality and safety standards.
                  </p>
                  <p className="mt-3 text-slate-700">
                    Our advanced facility is equipped with cutting-edge machinery and over two dozen dedicated
                    production lines. This capacity allows a broad product mix—from RIGID PVC pipes and SWR pipes
                    to elastomeric pipes and uPVC fittings—ensuring reliable supply for projects in housing,
                    industry and infrastructure.
                  </p>

                  <h4 className="mt-5 text-lg font-semibold">Production capacity</h4>
                  <div className="mt-2 space-y-2">
                    <details className="group rounded-lg border border-slate-200 bg-slate-50 p-3 open:bg-slate-50">
                      <summary className="flex list-none items-center justify-between text-slate-800">
                        <span className="font-medium">UPVC Pipes / CPVC Pipes / SWR Pipes / Plumbing Pipes</span>
                        <span className="text-sm text-slate-600">49866 MT</span>
                      </summary>
                    </details>
                    <details className="group rounded-lg border border-slate-200 bg-slate-50 p-3 open:bg-slate-50">
                      <summary className="flex list-none items-center justify-between text-slate-800">
                        <span className="font-medium">HDPE Pipe / Sprinkler</span>
                        <span className="text-sm text-slate-600">3942 MT</span>
                      </summary>
                    </details>
                    <details className="group rounded-lg border border-slate-200 bg-slate-50 p-3 open:bg-slate-50">
                      <summary className="flex list-none items-center justify-between text-slate-800">
                        <span className="font-medium">PVC Fitting</span>
                        <span className="text-sm text-slate-600">1832 MT</span>
                      </summary>
                    </details>
                  </div>
                </m.div>
              </div>
            </div>
          </m.section>

          <m.section id="quality" className="mt-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeSlideUp}>
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: text */}
                <m.div className="p-6 sm:p-8" variants={fadeSlideUp}>
                  <h3 className="text-2xl font-extrabold text-attention">Quality :</h3>
                  <p className="mt-3 text-slate-700">
                    We prioritize the quality of our manufactured products as a fundamental criterion that sets us apart in the market.
                    Our quality systems emphasize traceability and continual improvement — from raw material procurement to final dispatch.
                  </p>

                  <h4 className="mt-6 text-lg font-semibold">Product Quality Certificates :</h4>
                  <p className="mt-1 text-slate-700">We have earned the following quality certificates for our products:</p>
                  <div className="mt-3 space-y-2">
                    {[
                      ['IS 4985', 'for Potable Water in PVC Pipes'],
                      ['IS 4984', 'for potable water in HDPE Pipes'],
                      ['IS 13592', 'for Sewerage Pipe'],
                      ['IS 14151 Part I to Part II', 'for Sprinkler System for Irrigation'],
                      ['IS 15778', 'for Hot and cold Water system'],
                      ['IS 9537', 'for Conduits for electrical installation'],
                      ['IS 12786', 'for Lateral Pipes for Irrigation'],
                      ['IS 14333', 'for HDPE pipes for sewerage'],
                    ].map(([code, desc]) => (
                      <details key={code} className="group rounded-lg border border-slate-200 bg-slate-50 p-3 open:bg-slate-50">
                        <summary className="flex list-none items-center justify-between text-slate-800">
                          <span className="font-medium">{code}</span>
                          <span className="text-sm text-slate-600">{desc}</span>
                        </summary>
                      </details>
                    ))}
                  </div>
                </m.div>

                {/* Right: image */}
                <m.div className="relative" variants={fadeSlideUp} custom={0.08}>
                  <img
                    src="/iso-9001.jpg"
                    alt="ISO 9001 Quality Management"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src='/founder.svg'; }}
                  />
                </m.div>
              </div>
            </div>
          </m.section>

          <m.section id="founder" className="mt-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeSlideUp}>
            <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <m.img
                  src="/founder.svg"
                  alt="Founder"
                  loading="lazy"
                  decoding="async"
                  className="h-28 w-28 rounded-xl object-cover"
                  variants={fadeSlideUp}
                />
                <m.div variants={fadeSlideUp} custom={0.08} className="text-center sm:text-left">
                  <h3 className="text-2xl font-extrabold text-attention">Founder's Message</h3>
                  <p className="mt-2 text-lg text-slate-800">“ If there is passion in heart, nothing is impossible ”.</p>
                  
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

