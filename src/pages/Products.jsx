import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

export default function Products(){
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [categories, setCategories] = useState([]);
  const [cat, setCat] = useState('all');
  const [searchParams] = useSearchParams();

  useEffect(()=>{
    async function loadCats(){
      try{
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      }catch(e){ console.error(e); }
    }
    loadCats();
    // set category from URL if provided
    const initialCat = searchParams.get('category');
    if (initialCat) setCat(initialCat);
  }, []);

  useEffect(()=>{
    async function load(){
      try{
        const params = { q };
        if (cat && cat !== 'all') params.category = cat;
        const res = await api.get('/products', { params });
        setProducts(res.data.data);
      }catch(err){ console.error(err); }
    }
    load();
  }, [q, cat]);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="sticky top-14 z-40 bg-white/90 backdrop-blur border-b">
            <div className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-semibold">Products</h1>
              <div className="flex items-center gap-2">
                <select value={cat} onChange={e=>setCat(e.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand">
                  <option value="all">All Categories</option>
                  {categories.map(c=> (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <div className="w-64 max-w-full">
                  <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
                </div>
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
