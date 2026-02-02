import React from 'react';
import { m } from 'framer-motion';
import { fadeSlideUp } from '../../lib/motion';
import { Link } from 'react-router-dom';

export default function LocateUs(){
  return (
    <m.section className="container mx-auto px-4 py-10 max-w-5xl" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeSlideUp}>
      <div className="rounded-lg border border-slate-200 bg-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <m.h3 className="text-xl font-semibold" variants={fadeSlideUp} custom={0.05}>Find a dealer</m.h3>
          <m.p className="text-slate-800" variants={fadeSlideUp} custom={0.12}>
            Find approved dealers near you on the interactive map. Search by PIN or city and get directions instantly.
          </m.p>
        </div>
        <m.div className="flex gap-3" variants={fadeSlideUp} custom={0.18}>
          <Link to="/dealers-map" className="rounded-md bg-attention px-4 py-2 text-white hover:bg-[#0d4175ff]">Open Map</Link>
        </m.div>
      </div>
    </m.section>
  );
}

