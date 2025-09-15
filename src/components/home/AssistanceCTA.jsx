import React from 'react';
import { m } from 'framer-motion';
import { fadeSlideUp } from '../../lib/motion';
import { Link } from 'react-router-dom';

export default function AssistanceCTA(){
  return (
    <m.section className="container mx-auto px-4 py-10 max-w-5xl " initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeSlideUp}>
      <div className="rounded-lg border border-slate-200 bg-slate-250 p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <m.h3 className="text-xl font-semibold" variants={fadeSlideUp} custom={0.05}>Need assistance?</m.h3>
          <m.p className="text-slate-600" variants={fadeSlideUp} custom={0.12}>Reach out to us for product guidance, quotes, and dealer partnerships.</m.p>
        </div>
        <m.div className="flex gap-3" variants={fadeSlideUp} custom={0.18}>
          <Link to="/support" className="rounded-md border px-4 py-2 bg-neutral text-primary hover:bg-white ">Contact Us</Link>
          <Link to="/become-dealer" className="rounded-md bg-accent px-4 py-2 text-white hover:bg-[#0d4175ff]">Business Enquiry</Link>
        </m.div>
      </div>
    </m.section>
  );
}

