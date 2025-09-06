import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Support(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold">Customer Support</h1>
          <p className="mt-2 text-slate-600">We’re here to help. Reach us using the details below:</p>
          <div className="mt-4 space-y-2">
            <div><span className="font-medium">Phone:</span> +91-98765-43210</div>
            <div><span className="font-medium">Email:</span> support@swasti.com</div>
            <div><span className="font-medium">Hours:</span> Mon–Fri, 9:00 AM – 6:00 PM IST</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

