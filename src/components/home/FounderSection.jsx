import React from 'react';
import { m } from 'framer-motion';
import { fadeSlideUp } from '../../lib/motion';
import { Link } from 'react-router-dom';

export default function FounderSection(){
  return (
    <m.section className="container mx-auto px-4 py-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeSlideUp}>
      <div className="mx-auto max-w-6xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 sm:p-8 md:p-10">
            <m.h2 className="text-xl sm:text-2xl font-bold text-attention" variants={fadeSlideUp} custom={0.05}>Founder's Message</m.h2>
            <m.p className="mt-6 text-slate-800 text-lg sm:text-xl font-medium" variants={fadeSlideUp} custom={0.12}>“ If there is passion in heart, nothing is impossible ”.</m.p>
            
          </div>
          <div className="relative">
            <img src="/founder.png" alt="Founder" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </m.section>
  );
}

