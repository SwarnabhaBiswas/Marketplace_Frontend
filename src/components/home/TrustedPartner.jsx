import React from 'react';
import { m } from 'framer-motion';
import { fadeSlideUp } from '../../lib/motion';

export default function TrustedPartner() {
  return (
    <m.section
      className="container mx-auto px-10 md:px-4 py-12 max-w-6xl md:bg-primary border rounded-xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeSlideUp}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:px-10 ">
        {/* Left: Text */}
        <div>
          <m.h2 className="text-3xl sm:text-4xl font-extrabold md:text-platinum text-primary" variants={fadeSlideUp}>
            Your Trusted Electrical
            <br />
            Partner
          </m.h2>

          <m.p
            className="mt-10 md:text-platinum text-slate-800 text-lg leading-8"
            variants={fadeSlideUp}
            custom={0.06}
          >
            Our products that meet national and international standards and
            ensure the reliable operation of your systems.
          </m.p>

          <m.p
            className="mt-3 text-slate-800 md:text-platinum text-lg leading-8"
            variants={fadeSlideUp}
            custom={0.12}
          >
            This shows our ability to continuously offer products and services that meet
            customer, legal, and regulatory requirements in turn increasing customer
            satisfaction.
          </m.p>
        </div>

        {/* Right: Certifications (no background, only ISI, ISO and BSCIC/JAS-ANZ) */}
        <div>
          <div className="grid grid-cols-2 gap-8 justify-items-center items-center">
            {/* ISI */}
            <m.div className="flex flex-col items-center text-center md:bg-primary md:border-none bg-attention px-6 py-2 border rounded-xl" variants={fadeSlideUp} custom={0.1}>
              <img src="/cert-isi.svg" alt="ISI Accredited" className="h-20 w-auto" />
              <span className="mt-2 text-sm font-medium text-platinum">ISI Accredited</span>
            </m.div>

            {/* ISO */}
            <m.div className="flex flex-col items-center text-center bg-attention py-2 border rounded-xl md:bg-primary md:border-none" variants={fadeSlideUp} custom={0.14}>
              <img src="/cert-iso.svg" alt="ISO 9001:2015 Certified" className="h-[3.8rem] w-auto" />
              <span className="mt-2 text-sm font-medium text-platinum">ISO Certified</span>
            </m.div>

            {/* BSCIC / JAS-ANZ */}
            <m.div className="col-span-2 flex flex-col items-center text-center bg-attention px-2 py-2 border rounded-xl md:bg-primary md:border-none" variants={fadeSlideUp} custom={0.18}>
              <img src="/cert.png" alt="BSCIC / JAS-ANZ" className="h-16 w-auto" />
              <span className="mt-2 text-sm font-medium text-platinum">ISO Registered Company</span>
            </m.div>
          </div>
        </div>
      </div>
    </m.section>
  );
}

