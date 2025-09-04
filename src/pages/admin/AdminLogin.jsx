import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin(){
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();

  async function onSubmit(data){
    try{
      await api.post('/auth/login', data);
      nav('/admin');
    }catch(err){
      console.error(err);
      alert('Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[420px] max-w-[92vw] rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3">
          <input {...register('email')} placeholder="Email" className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          <input {...register('password')} type="password" placeholder="Password" className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          <button className="rounded-md bg-brand px-4 py-2 text-white">Login</button>
        </form>
      </div>
    </div>
  );
}
