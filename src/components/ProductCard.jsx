import React from 'react';
import { Link } from 'react-router-dom';
export default function ProductCard({p}){
  const img = p.images?.[0]?.url || 'https://res.cloudinary.com/dv9gqhdiy/image/upload/v1756923531/cld-sample-4.jpg';
  return (
    <div className="card">
      <Link to={'/product/'+p.slug}>
        <img src={img} alt={p.name} style={{width:'100%', height:180, objectFit:'cover', borderRadius:6}} />
        <h3 style={{marginTop:8}}>{p.name}</h3>
        <p style={{fontSize:13,color:'#555'}}>{p.category}</p>
      </Link>
    </div>
  );
}
