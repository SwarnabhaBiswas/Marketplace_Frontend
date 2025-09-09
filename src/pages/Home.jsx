import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/home/Hero";
import WhoWeAre from "../components/home/WhoWeAre";
import CategoriesSection from "../components/home/CategoriesSection";
import FounderSection from "../components/home/FounderSection";
import DealerCTA from "../components/home/DealerCTA";
import GetInTouch from "../components/home/GetInTouch";
import AssistanceCTA from "../components/home/AssistanceCTA";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <WhoWeAre />
        <CategoriesSection />
        <FounderSection />
        <DealerCTA />
        <GetInTouch />
        <AssistanceCTA />
      </main>
      <Footer />
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Swasti', url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com' })}
      </script>
    </div>
  );
}