import React from 'react';
import { m } from 'framer-motion';
import { fadeSlideUp } from '../../lib/motion';
import { Link } from 'react-router-dom';

export default function DealerCTA(){
  return (
    <m.section className="container mx-auto px-4 py-8 max-w-5xl" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeSlideUp}>
      <div className="rounded-2xl bg-slate-200 p-8 text-center ring-1 ring-slate-100">
        <img src="/handshake.svg" alt="Handshake" loading="lazy" decoding="async" className="mx-auto mb-4 h-20 w-20 opacity-70" />
        <m.h3 className="text-2xl md:text-3xl font-bold text-primary" variants={fadeSlideUp} custom={0.06}>Become a dealer</m.h3>
        <m.p className="mt-2 text-slate-600" variants={fadeSlideUp} custom={0.12}>Become a channel partner and join our network of distributors and retailers.</m.p>
        <m.div variants={fadeSlideUp} custom={0.18}>
          <Link to="/become-dealer" className="mt-6 inline-flex items-center rounded-full bg-attention px-6 py-3 text-white hover:bg-orange-300 ">JOIN US</Link>
        </m.div>
      </div>
    </m.section>
  );
}

