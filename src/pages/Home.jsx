import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <>
      <Header />
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Perfect Partner For Your Wires and Cables</h1>
          <p className="max-w-2xl text-slate-200">Swasti manufactures premium quality conduits and accessories. Durable, certified and ready for large-scale supply. Become a dealer to access bulk pricing.</p>
          <div className="mt-4 flex gap-3">
            <Link to="/products" className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-white hover:opacity-90">Explore Products</Link>
            <Link to="/become-dealer" className="inline-flex items-center rounded-md bg-white text-slate-900 px-4 py-2 hover:bg-slate-200">Become a Dealer</Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold">Key Products</h2>
        <div className="mt-3">
          <Link to="/products" className="text-brand underline-offset-2 hover:underline">View Product Catalog</Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
