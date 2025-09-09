import React from 'react';
import { m } from 'framer-motion';
import { fadeSlideUp } from '../../lib/motion';
import ContactForm from './ContactForm';

export default function GetInTouch(){
  return (
    <m.section id="contact" className="container mx-auto px-4 py-10 max-w-6xl scroll-mt-24" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeSlideUp}>
      <m.h2 className="text-3xl md:text-4xl font-semibold text-center" variants={fadeSlideUp} custom={0.05}>Get in touch</m.h2>
      <ContactForm />
    </m.section>
  );
}

