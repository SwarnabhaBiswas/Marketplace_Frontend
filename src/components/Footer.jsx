import React from 'react';
import { Link } from 'react-router-dom';

// Social Media Icons
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 7.041.072 6.094.13 5.42.333 4.836.63c-.608.236-1.124.55-1.636 1.063C2.687 2.206 2.373 2.722 2.137 3.33c-.297.584-.5 1.258-.558 2.205C1.52 6.483 1.507 6.89 1.507 10.51s.013 4.027.072 4.975c.058.947.26 1.621.558 2.205.236.608.55 1.124 1.063 1.636.513.513 1.029.827 1.637 1.063.584.297 1.258.5 2.205.558.948.059 1.355.072 4.975.072s4.027-.013 4.975-.072c.947-.058 1.621-.26 2.205-.558.608-.236 1.124-.55 1.636-1.063.513-.513.827-1.029 1.063-1.637.297-.584.5-1.258.558-2.205.059-.948.072-1.355.072-4.975s-.013-4.027-.072-4.975c-.058-.947-.26-1.621-.558-2.205-.236-.608-.55-1.124-1.063-1.636C19.294 1.187 18.778.873 18.17.637c-.584-.297-1.258-.5-2.205-.558C14.017.013 13.61 0 10.017 0h2zm-.017 5.838a4.672 4.672 0 100 9.344 4.672 4.672 0 000-9.344zm0 7.7a3.028 3.028 0 110-6.056 3.028 3.028 0 010 6.056zm5.93-7.882a1.092 1.092 0 11-2.184 0 1.092 1.092 0 012.184 0z" clipRule="evenodd" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" clipRule="evenodd" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
  </svg>
);

const PinterestIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.653 1.219-5.653s-.219-.438-.219-1.087c0-1.018.653-1.775 1.567-1.775.719 0 1.097.543 1.097 1.191 0 .719-.457 1.775-.697 2.761-.199.855.438 1.567 1.191 1.567 1.434 0 2.543-1.523 2.543-3.679 0-1.917-1.331-3.299-3.368-3.299-2.543 0-4.175 1.894-4.175 4.175 0 .855.199 1.775.543 2.285a.362.362 0 01.105.457c-.105.438-.199.855-.457.855-.219 0-.457-.105-.657-.219-1.009-.543-1.567-2.199-1.567-3.679 0-2.979 2.199-5.653 6.374-5.653 3.368 0 5.653 2.199 5.653 5.109 0 3.299-1.894 5.653-4.61 5.653-.855 0-1.671-.438-1.956-.855l-.543 2.005c-.199.855-.719 1.775-1.087 2.285 1.171.219 2.285.438 3.679.438 6.622 0 11.987-5.367 11.987-11.987C24.004 5.367 18.639.001 12.017.001z" />
  </svg>
);

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
              <li><Link to="/products?category=Rigid%20PVC%20Conduit" className="hover:underline">Rigid PVC Conduit</Link></li>
              <li><Link to="/products?category=PVC%20Conduit%20Accessories" className="hover:underline">PVC Conduit Accessories</Link></li>
              <li><Link to="/products?category=Circular%20Box" className="hover:underline">Circular Box</Link></li>
              <li><Link to="/products?category=Modular%20Box" className="hover:underline">Modular Box</Link></li>
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
        </div>
        <div className="mt-8 border-t border-platinum/20 pt-6">
          {/* Social Media Links */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/share/1AfJX8c1p3/" 
                aria-label="Facebook"
                className="text-platinum/70 hover:text-white hover:scale-110 transition-all duration-200"
              >
                <FacebookIcon />
              </a>
              <a 
                href="https://x.com/SwastiPipes?t=yefsLz--NxYLLzY_r5ksyA&s=09" 
                aria-label="Twitter"
                className="text-platinum/70 hover:text-white hover:scale-110 transition-all duration-200"
              >
                <TwitterIcon />
              </a>
              <a 
                href="https://www.instagram.com/swasti__india?igsh=aG1rZndmZjZ4OGNr"
                aria-label="Instagram"
                className="text-platinum/70 hover:text-white hover:scale-110 transition-all duration-200"
              >
                <InstagramIcon />
              </a>
              <a 
                href="https://www.linkedin.com/company/swasti-india-private-limited/" 
                aria-label="LinkedIn"
                className="text-platinum/70 hover:text-white hover:scale-110 transition-all duration-200"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
          
          {/* Copyright and Links */}
          <div className="text-xs flex flex-wrap items-center justify-between gap-3 mt-6 md:mt-0">
            <div>© {new Date().getFullYear()} Swasti</div>
            <div className="flex items-center gap-4">
              {/* <a href="#" className="hover:underline">Privacy Policy</a> */}
              {/* <a href="#" className="hover:underline">Terms &amp; Conditions</a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
