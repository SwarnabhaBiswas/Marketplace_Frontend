import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ p }) {
  const img = p.images?.[0]?.url || "/placeholder.svg";

  return (
    <Link
      to={`/product/${p.slug}`}
      className="group block rounded-2xl overflow-hidden shadow-md bg-white hover:shadow-2xl transition-all duration-300"
    >
      <div className="h-48 w-full overflow-hidden relative">
        <img
          src={img}
          alt={p.name}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.svg";
          }}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* <span className="absolute top-3 left-3 bg-attention text-white text-xs font-medium px-3 py-1 rounded-full shadow-md opacity-90">
          New
        </span> */}
      </div>
      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors capitalize">
          {p.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 capitalize">{p.category}</p>
        <button className="mt-3 inline-block rounded-full bg-attention px-4 py-1.5 text-xs font-medium text-white hover:bg-[#ff974c] transition">
          View Details
        </button>
      </div>
    </Link>
  );
}
