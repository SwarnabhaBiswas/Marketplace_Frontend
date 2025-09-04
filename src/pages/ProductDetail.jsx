import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

export default function ProductDetail(){
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get('/products/'+slug);
        setProduct(res.data.data);
      }catch(err){ console.error(err); }
    }
    load();
  }, [slug]);
  if(!product) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  const img = product.images?.[0]?.url || '/placeholder.svg';
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 w-full">
            <img src={img} onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src='/placeholder.svg'; }} alt={product.name} className="w-full rounded-lg object-cover" />
          </div>
          <div className="w-full lg:w-[420px]">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="mt-2 text-slate-700">{product.description}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.brochureUrl && (
                <a href={product.brochureUrl} className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-white hover:opacity-90" target="_blank" rel="noreferrer">Download Brochure</a>
              )}
              <Link to="/become-dealer" className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-white hover:opacity-90">Request Bulk Quote</Link>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">Specifications</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {product.specs && Object.entries(product.specs).map(([k,v]) => (
                  <li key={k}><span className="font-semibold">{k}:</span> {v}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
