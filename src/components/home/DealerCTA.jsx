import React from 'react';
import { m } from 'framer-motion';
import { fadeSlideUp } from '../../lib/motion';
import { Link } from 'react-router-dom';

export default function DealerCTA(){
  return (
    <m.section className="container mx-auto px-4 py-10 bg-[#DDDDDD] md:bg-transparent" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeSlideUp}>
      <div className="max-w-3xl mx-auto text-center">
        {/* Top handshake icon */}
        <img src="/handshake.svg" alt="Partner with Swasti" loading="lazy" decoding="async" className="mx-auto mb-4 h-20 w-20 opacity-90" />

        <m.h3 className="text-3xl md:text-5xl font-extrabold text-primary" variants={fadeSlideUp}>
          Grow Together <span className="text-accent">With Swasti!</span>
        </m.h3>
        <m.p className="mt-3 text-slate-700 md:text-lg" variants={fadeSlideUp} custom={0.08}>
          Become a Dealer
        </m.p>
        <m.div className="mt-6" variants={fadeSlideUp} custom={0.12}>
          <Link
            to="/become-dealer"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-attention/30"
          >
            CONNECT
            <span className="inline-block">›</span>
          </Link>
        </m.div>
      </div>
    </m.section>
  );
}

