import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
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
  if(!product) return <div>Loading...</div>;
  return (
    <>
      <Header />
      <div className="container" style={{padding:'32px 0'}}>
        <div style={{display:'flex',gap:24, alignItems:'flex-start'}}>
          <div style={{flex:1}}>
            <img src={product.images?.[0]?.url || 'https://via.placeholder.com/800x500'} alt={product.name} style={{width:'100%', borderRadius:8}} />
          </div>
          <div style={{width:420}}>
            <h1>{product.name}</h1>
            <p style={{color:'#444'}}>{product.description}</p>
            <div style={{marginTop:12}}>
              <a href={product.brochureUrl} className="btn" target="_blank">Download Brochure</a>
              <a href="/become-dealer" className="btn" style={{marginLeft:8}}>Request Bulk Quote</a>
            </div>
            <div style={{marginTop:16}}>
              <h3>Specifications</h3>
              <ul>
                {product.specs && Object.entries(product.specs).map(([k,v]) => <li key={k}><strong>{k}:</strong> {v}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
