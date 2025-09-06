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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="sticky top-14 z-40 bg-white/90 backdrop-blur border-b">
            <div className="flex items-center justify-between gap-3 py-2">
              <h1 className="text-2xl font-semibold">Products</h1>
              <div className="w-64 max-w-full">
                <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map(p=> <ProductCard key={p._id} p={p} />)}
          </div>
        </div>
      </main>
    </div>
  );
}
