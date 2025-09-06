import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import api from '../api/api';

export default function DealerForm(){
  const { register, handleSubmit, formState: { errors }, watch } = useForm({ defaultValues: { enquiryType: 'dealer' } });
  const enquiryType = watch('enquiryType');
  const isBulk = enquiryType === 'bulk';
  async function onSubmit(data){
    try{
      await api.post('/dealers', data);
      alert('Submitted. We will contact you.');
    }catch(err){ console.error(err); alert('Failed'); }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-semibold">Business Enquiry</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input {...register('companyName')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div>
            <label className="block text-sm font-medium">Name<span className="text-red-600">*</span></label>
            <input {...register('contactName', { required: 'Name is required' })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
            {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <label className="block text-sm font-medium">Email<span className="text-red-600">*</span></label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /[^\s@]+@[^\s@]+\.[^\s@]+/, message: 'Enter a valid email' }
                })}
                placeholder="email"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Phone<span className="text-red-600">*</span></label>
              <input
                {...register('phone', {
                  required: 'Phone is required',
                  minLength: { value: 7, message: 'Phone seems too short' }
                })}
                placeholder="phone"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Address block */}
          {/* Enquiry type */}
          <div>
            <label className="block text-sm font-medium">I want to</label>
            <select
              {...register('enquiryType')}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="dealer">Be a dealer</option>
              <option value="bulk">Buy in bulk</option>
            </select>
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-medium">Address</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input {...register('state', { required: 'State is required' })} placeholder="State*" className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
              </div>
              <div>
                <input {...register('district', { required: 'District is required' })} placeholder="District*" className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
                {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>}
              </div>
              <input {...register('area')} placeholder="Area" className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand sm:col-span-2" />
              <div className="sm:col-span-2">
                <input {...register('address', { required: 'Address is required' })} placeholder="Address*" className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
              </div>
              <input {...register('landmark')} placeholder="Landmark" className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand sm:col-span-2" />
            </div>
          </div>

          {isBulk && (
            <div>
              <label className="block text-sm font-medium">Expected Volume<span className="text-red-600">*</span></label>
              <input
                {...register('volumeBand', { validate: (v)=> (isBulk ? !!v?.trim() : true) || 'Expected volume is required' })}
                placeholder="e.g., 1000 units/month"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
              />
              {errors.volumeBand && <p className="mt-1 text-sm text-red-600">{errors.volumeBand.message}</p>}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea {...register('message')} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div className="pt-2">
            <button className="rounded-md bg-brand px-4 py-2 text-white">Submit</button>
          </div>
        </form>
      </div>
      </main>
      <Footer />
    </div>
  );
}
