import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <>
      <Header />
      <section className="hero">
        <div className="container">
          <h1 style={{fontSize:48, marginBottom:8}}>Perfect Partner For Your Wires and Cables</h1>
          <p style={{maxWidth:700}}>Swasti manufactures premium quality conduits and accessories. Durable, certified and ready for large-scale supply. Become a dealer to access bulk pricing.</p>
          <div style={{marginTop:16}}>
            <Link to="/products" className="btn" style={{marginRight:8}}>Explore Products</Link>
            <Link to="/become-dealer" className="btn">Become a Dealer</Link>
          </div>
        </div>
      </section>

      <div className="container" style={{padding:'32px 0'}}>
        <h2>Key Products</h2>
        <div style={{marginTop:16}}><Link to="/products">View Product Catalog</Link></div>
      </div>

      <Footer />
    </>
  );
}
