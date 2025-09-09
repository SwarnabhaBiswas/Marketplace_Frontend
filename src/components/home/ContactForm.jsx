import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/api';
import Swal from 'sweetalert2';

export default function ContactForm(){
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const msg = `${data.message}\n\nState: ${data.state || ''}\nCity: ${data.city || ''}\nPin: ${data.pin || ''}`;
      await api.post('/contact', { name: data.name, email: data.email, phone: data.phone, message: msg });
      await Swal.fire({ title: 'Thank you!', text: 'We will reach out shortly.', icon: 'success', confirmButtonText: 'OK' });
      reset();
    } catch (e) {
      console.error(e);
      await Swal.fire({ title: 'Submission failed', text: 'Please try again later.', icon: 'error', confirmButtonText: 'OK' });
    }
    setSubmitting(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-busy={submitting ? 'true' : 'false'} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-200 px-3 py-5 md:px-6 md:py-10">
      <input {...register('name', { required: 'Name is required' })} placeholder="What’s your name? *" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('phone', { required: 'Phone is required' })} placeholder="Mobile number *" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('email', { required: 'Email is required', pattern: { value: /[^\s@]+@[^\s@]+\.[^\s@]+/, message: 'Invalid email' } })} placeholder="What email ID can we reach out to? *" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('country')} placeholder="Country" defaultValue="India" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('state')} placeholder="State" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('city')} placeholder="What’s the name of your city?" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <input {...register('pin')} placeholder="Pin Code" className="w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand" />
      <textarea {...register('message', { required: 'Message is required' })} placeholder="Message *" className="min-h-[120px] w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-brand md:col-span-2" />
      <div className="md:col-span-2 flex justify-center">
        <button disabled={submitting} className="rounded-full bg-attention px-8 py-3 text-white disabled:opacity-60 inline-flex items-center gap-2 hover:bg-orange-300">
          {submitting && <span className="h-4 w-4 rounded-full bg-gradient-to-tr from-accent to-attention p-[1px] animate-spin-slow"><span className="block h-full w-full rounded-full bg-transparent"></span></span>}
          {submitting ? 'Submitting…' : 'SUBMIT'}
        </button>
      </div>
    </form>
  );
}

