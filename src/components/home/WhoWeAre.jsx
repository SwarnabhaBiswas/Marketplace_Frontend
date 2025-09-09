import React from 'react';
import { m } from 'framer-motion';
import { fadeSlideUp } from '../../lib/motion';

export default function WhoWeAre(){
  return (
    <m.section className="container mx-auto px-4 py-10 max-w-5xl" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeSlideUp}>
      <m.h2 className="text-[3rem] font-semibold" variants={fadeSlideUp} custom={0.05}>Who are we?</m.h2>
      <m.p className="mt-2 text-slate-700 max-w-3xl" variants={fadeSlideUp} custom={0.12}>
        Swasti manufactures premium quality conduits and accessories. Durable, certified and ready for large-scale supply. We support distributors and contractors with reliable volumes and consistent quality.
      </m.p>
      <m.div className="mt-3" variants={fadeSlideUp} custom={0.18}>
        <a href="/about" className="text-brand underline-offset-2 hover:underline">Learn more about us →</a>
      </m.div>
    </m.section>
  );
}

