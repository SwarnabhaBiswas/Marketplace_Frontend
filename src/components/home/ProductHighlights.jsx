import React from 'react';
import { m } from 'framer-motion';
import { fadeSlideUp } from '../../lib/motion';

// Icon components for Conduits
const ThermalIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CorrosionIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const WeightIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FlameIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14l4-4 3 3m-3-3l-3-3m1.5 1.5L14.5 12.5" />
  </svg>
);

const SmoothIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// Icon components for MS Accessories
const SwitchIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
  </svg>
);

const StudIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const QualityIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const HeavyDutyIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const LongLifeIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const conduitsFeatures = [
  {
    icon: <ThermalIcon />,
    title: "High thermal resistance from -5 degrees to 60 degrees",
    delay: 0.1
  },
  {
    icon: <CorrosionIcon />,
    title: "Corrosion free material",
    delay: 0.15
  },
  {
    icon: <WeightIcon />,
    title: "Light-weight and Easy to install",
    delay: 0.2
  },
  {
    icon: <FlameIcon />,
    title: "Resistant to Burning (Flame retardant)",
    delay: 0.25
  }
];

const msAccessories = [
  {
    icon: <SwitchIcon />,
    title: "Fit to any kind of switch",
    delay: 0.1
  },
  {
    icon: <StudIcon />,
    title: "Brass earth stud",
    delay: 0.15
  },
  {
    icon: <QualityIcon />,
    title: "Superior quality",
    delay: 0.2
  },
  {
    icon: <LongLifeIcon />,
    title: "Long life",
    delay: 0.3
  }
];

export default function ProductHighlights() {
  return (
    <m.section 
      className="py-16"
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, amount: 0.2 }} 
      variants={fadeSlideUp}
    >
      <div className="container mx-auto px-8 md:px-16">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 max-w-7xl mx-auto">
          
          {/* Conduits at a Glance Section */}
          <m.div className="flex flex-col" variants={fadeSlideUp}>
            <m.div className="text-center mb-12" variants={fadeSlideUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Conduits at a Glance
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto"></div>
            </m.div>

            <div className="grid grid-cols-1 gap-8 flex-1">
              {conduitsFeatures.map((feature, index) => (
                <m.div
                  key={index}
                  className="flex flex-col items-center text-center space-y-3"
                  variants={fadeSlideUp}
                  custom={feature.delay}
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      {feature.icon}
                    </div>
                  </div>
                  <p className="text-gray-700 text-base md:text-lg font-medium leading-relaxed px-2">
                    {feature.title}
                  </p>
                </m.div>
              ))}
            </div>
          </m.div>

          {/* MS Accessories Section */}
          <m.div className="flex flex-col" variants={fadeSlideUp}>
            <m.div className="text-center mb-12" variants={fadeSlideUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                MS Accessories
              </h2>
              <div className="w-24 h-1 bg-attention mx-auto"></div>
            </m.div>

            <div className="grid grid-cols-1 gap-8 flex-1">
              {msAccessories.map((accessory, index) => (
                <m.div
                  key={index}
                  className="flex flex-col items-center text-center space-y-3"
                  variants={fadeSlideUp}
                  custom={accessory.delay}
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-attention to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      {accessory.icon}
                    </div>
                  </div>
                  <p className="text-gray-700 text-base md:text-lg font-medium leading-relaxed px-2">
                    {accessory.title}
                  </p>
                </m.div>
              ))}
            </div>
          </m.div>

        </div>
      </div>
    </m.section>
  );
}
