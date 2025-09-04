import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Support(){
  return (
    <>
      <Header />
      <div className="container" style={{ padding: '32px 0' }}>
        <h1>Customer Support</h1>
        <p style={{ marginTop: 8 }}>We’re here to help. Reach us using the details below:</p>
        <div style={{ marginTop: 16, lineHeight: 1.8 }}>
          <div><strong>Phone:</strong> +91-98765-43210</div>
          <div><strong>Email:</strong> support@swasti.com</div>
          <div><strong>Hours:</strong> Mon–Fri, 9:00 AM – 6:00 PM IST</div>
        </div>
      </div>
      <Footer />
    </>
  );
}

