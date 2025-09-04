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
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{width:420, padding:24, borderRadius:8, boxShadow:'0 6px 24px rgba(0,0,0,0.1)'}}>
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{display:'grid', gap:12}}>
          <input {...register('email')} placeholder="Email" className="form-input" />
          <input {...register('password')} type="password" placeholder="Password" className="form-input" />
          <button className="btn">Login</button>
        </form>
      </div>
    </div>
  );
}
