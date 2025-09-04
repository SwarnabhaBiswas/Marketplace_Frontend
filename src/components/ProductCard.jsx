import React from 'react';
import { Link } from 'react-router-dom';
export default function ProductCard({p}){
  const img = p.images?.[0]?.url || '/placeholder.svg';
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow">
      <Link to={'/product/'+p.slug}>
        <img
          src={img}
          alt={p.name}
          onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; }}
          className="h-44 w-full rounded-md object-cover"
        />
        <h3 className="mt-2 text-base font-semibold">{p.name}</h3>
        <p className="text-sm text-slate-600">{p.category}</p>
      </Link>
    </div>
  );
}
