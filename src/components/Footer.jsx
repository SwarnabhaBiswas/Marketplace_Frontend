import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer(){
  return (
<footer className="mt-auto bg-primary text-platinum">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-base font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/about" className="hover:underline">Who we are</Link></li>
              <li><Link to="/about" className="hover:underline">Founder Message</Link></li>
              <li><Link to="/about" className="hover:underline">Quality Policy</Link></li>
              <li><Link to="/about" className="hover:underline">Plant &amp; Machinery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold">Products</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/products?category=Pipes" className="hover:underline">Pipes</Link></li>
              <li><Link to="/products?category=Pipe%20%26%20Fittings" className="hover:underline">Pipe &amp; Fittings</Link></li>
              <li><Link to="/products" className="hover:underline">Discover all Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold">Help &amp; Support</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/support" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/become-dealer" className="hover:underline">Enquiry</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold">Investors</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Media</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Blogs</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-platinum/20 pt-4 text-xs flex flex-wrap items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Swasti</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
