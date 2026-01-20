import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/home/Hero";
import WhoWeAre from "../components/home/WhoWeAre";
import CategoriesSection from "../components/home/CategoriesSection";
import ProductHighlights from "../components/home/ProductHighlights";
import DealerCTA from "../components/home/DealerCTA";
import LocateUs from "../components/home/LocateUs";
import GetInTouch from "../components/home/GetInTouch";
import AssistanceCTA from "../components/home/AssistanceCTA";
import ScrollToTop from "../components/ScrollToTop";
import TrustedPartner from "../components/home/TrustedPartner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 smooth-transform">
        <section id="hero" >
          <Hero />
        </section>
        <section id="about" className="section-spacing">
          <WhoWeAre />
        </section>
        <section id="categories" className="section-spacing">
          <CategoriesSection />
        </section>
        <section id="products" className="section-spacing">
          <ProductHighlights />
        </section>
        <section id="locate-us" className="section-spacing">
          <LocateUs />
        </section>
        <section id="dealers" className="section-spacing">
          <DealerCTA />
        </section>

        {/* Trusted Partner section (certifications) */}
        <section id="trusted-partner" className="section-spacing">
          <TrustedPartner />
        </section>

        <section id="contact" className="section-spacing">
          <GetInTouch />
        </section>
        <section id="support" className="section-spacing">
          <AssistanceCTA />
        </section>
      </main>
      <Footer />
      <ScrollToTop />
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Swasti', url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com' })}
      </script>
    </div>
  );
}
