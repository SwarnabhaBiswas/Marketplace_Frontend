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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-semibold">Become a Dealer / Bulk Buyer</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input {...register('companyName')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium">Contact Person</label>
            <input {...register('contactName')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input {...register('email')} placeholder="email" className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
            <input {...register('phone')} placeholder="phone" className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium">Expected Volume</label>
            <input {...register('volumeBand')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea {...register('message')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div className="pt-2">
            <button className="rounded-md bg-brand px-4 py-2 text-white">Submit</button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
