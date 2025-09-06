import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <h1 className="text-3xl font-bold">About Swasti</h1>
          <p className="mt-3 text-slate-700 max-w-3xl">
            Swasti is a manufacturer of premium electrical conduits and accessories, committed to reliable
            infrastructure for homes, industry and public works. We focus on durability, certification, and
            on-time delivery at scale.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold">Company Profile</h2>
            <p className="mt-2 text-slate-700">
              With a strong manufacturing backbone and a pan-India network, Swasti delivers uPVC conduits,
              fittings and accessories that meet stringent quality benchmarks. Our team brings decades of
              product and process expertise to serve contractors, distributors and OEMs.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold">Our Plants</h2>
            <p className="mt-2 text-slate-700">
              Swasti operates modern production lines with in-house tooling and testing labs. Automated
              extrusion and precision molding ensure consistent quality and supply reliability.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold">Quality</h2>
            <p className="mt-2 text-slate-700">
              Every batch is tested for impact resistance, dimensional accuracy and long-term performance.
              Our quality systems emphasize traceability, documentation and continual improvement.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold">Founder’s Message</h2>
            <p className="mt-2 text-slate-700">
              "At Swasti, we believe dependable products build dependable relationships. We aim to be a
              trusted partner for our customers by delivering quality without compromise and service that
              stands behind every shipment."
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

