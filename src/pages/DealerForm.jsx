import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import api from '../api/api';

export default function DealerForm(){
  const { register, handleSubmit } = useForm();
  async function onSubmit(data){
    try{
      await api.post('/dealers', data);
      alert('Submitted. We will contact you.');
    }catch(err){ console.error(err); alert('Failed'); }
  }
  return (
    <>
      <Header />
      <div className="container" style={{padding:'32px 0', maxWidth:800}}>
        <h1>Become a Dealer / Bulk Buyer</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Company Name</label>
            <input {...register('companyName')} className="form-input" />
          </div>
          <div>
            <label>Contact Person</label>
            <input {...register('contactName')} className="form-input" />
          </div>
          <div style={{display:'flex',gap:8}}>
            <input {...register('email')} placeholder="email" className="form-input" />
            <input {...register('phone')} placeholder="phone" className="form-input" />
          </div>
          <div>
            <label>Expected Volume</label>
            <input {...register('volumeBand')} className="form-input" />
          </div>
          <div>
            <label>Message</label>
            <textarea {...register('message')} className="form-input" />
          </div>
          <div style={{marginTop:8}}>
            <button className="btn">Submit</button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
