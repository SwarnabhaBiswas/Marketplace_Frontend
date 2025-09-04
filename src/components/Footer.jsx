import React from 'react';
export default function Footer(){
  return (
    <footer className="mt-10 bg-brand py-6 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>© {new Date().getFullYear()} Swasti</div>
          <div>Contact: client@swasti.com</div>
        </div>
      </div>
    </footer>
  );
}
