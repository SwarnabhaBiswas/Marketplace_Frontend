import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { m } from "framer-motion";
import { fadeSlideUp } from "../lib/motion";

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-platinum">
          <div className="container mx-auto px-4 py-12 max-w-6xl mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              <div>
                <m.h1
                  className="text-4xl sm:text-5xl font-bold"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeSlideUp}
                >
                  Get in touch<span className="text-attention">.</span>
                </m.h1>
                <m.p
                  className="mt-3 text-slate-200 max-w-xl"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeSlideUp}
                  custom={0.08}
                >
                  Want to get in touch? We'd love to hear from you. Here's how
                  you can reach us.
                </m.p>
              </div>
              <m.div
                className="relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeSlideUp}
              >
                <img
                  src="/support.jpg"
                  alt="Support illustration"
                  loading="lazy"
                  decoding="async"
                  className="w-40 h-40 md:w-80 md:h-80"
                />
              </m.div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <div className="container mx-auto px-4 py-10 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Talk to Sales */}
              <m.div
                className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeSlideUp}
              >
                <div className="flex items-start gap-4">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary flex-shrink-0"
                  >
                    <path
                      d="M6.6 10.8a15.9 15.9 0 006.6 6.6l2.2-2.2c.2-.2.5-.3.8-.2 1 .3 2.1.5 3.2.5.4 0 .8.3.8.8v3.5c0 .4-.4.8-.8.8C10.8 20.6 3.4 13.2 3.4 3.8c0-.4.3-.8.8-.8H7.7c.4 0 .8.3.8.8 0 1.1.2 2.2.5 3.2.1.3 0 .6-.2.8L6.6 10.8z"
                      fill="currentColor"
                    />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      Talk to Sales
                    </h3>
                    <p className="mt-2 text-slate-700">
                      Interested in Swasti products? Pick up the phone to chat
                      with a member of our sales team.
                    </p>
                    <div className="mt-4 ">
                      <a href="tel:02269645648" className="text-primary">Call 022-69645648</a>
                      <p className="mt-3">Email- <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support@swastipipes.com" target="_blank" className="text-primary  ">support@swastipipes.com</a></p>

                    </div>
                  </div>
                </div>
              </m.div>

              {/* Contact Support */}
              <m.div
                className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeSlideUp}
                custom={0.06}
              >
                <div className="flex items-start gap-4">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary flex-shrink-0"
                  >
                    <path
                      d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-5 5V6z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      Contact Customer Support
                    </h3>
                    <p className="mt-2 text-slate-700">
                      Share your query here without any hassle and hesitation.
                      Don’t worry we’re here for you.
                    </p>
                    <div className="mt-4">
                      <a
                        href="/#contact"
                        className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-white"
                      >
                        Contact Support
                      </a>
                    </div>
                  </div>
                </div>
              </m.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
