import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

export default function Products(){
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/products', { params: { q } });
        setProducts(res.data.data);
      }catch(err){ console.error(err); }
    }
    load();
  }, [q]);
  return (
    <>
      <Header />
      <div className="container" style={{padding:'32px 0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h1>Products</h1>
          <div>
            <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} className="form-input" />
          </div>
        </div>
        <div style={{marginTop:20}} className="product-grid">
          {products.map(p=> <ProductCard key={p._id} p={p} />)}
        </div>
      </div>
      <Footer />
    </>
  );
}
