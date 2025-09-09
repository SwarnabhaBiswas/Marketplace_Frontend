import React from 'react';
import { useLocation } from 'react-router-dom';

export default function WhatsAppFAB(){
  const { pathname } = useLocation();
  // Hide on admin routes
  if (pathname.startsWith('/admin')) return null;

  const href = 'https://wa.me/8210020803';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-3 md:bottom-20  right-4 z-[2000] inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 active:scale-95"
    >
      {/* WhatsApp SVG icon */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.5c-.27-.14-1.57-.77-1.81-.86-.24-.09-.42-.14-.6.14-.17.27-.69.86-.85 1.03-.16.17-.31.2-.58.07-.27-.14-1.12-.41-2.14-1.32-.79-.7-1.32-1.57-1.47-1.84-.16-.27-.02-.42.12-.55.12-.12.27-.31.41-.47.14-.16.19-.27.29-.46.1-.2.05-.34-.02-.48-.07-.14-.6-1.44-.82-1.97-.22-.52-.44-.45-.6-.45-.16 0-.34-.01-.52-.01-.18 0-.48.07-.73.34-.24.27-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.81.14.18 1.9 2.9 4.6 4.05.64.28 1.14.45 1.53.57.64.2 1.22.17 1.68.1.51-.08 1.57-.64 1.79-1.26.22-.62.22-1.15.15-1.26-.06-.11-.24-.18-.51-.32zM16.02 3C9.94 3 5 7.94 5 14.02c0 2.15.6 4.16 1.64 5.88L5 27l7.3-1.59c1.66.91 3.56 1.43 5.71 1.43 6.08 0 11.02-4.94 11.02-11.02C29.02 7.94 24.1 3 18.02 3h-2zM16 25.51c-1.97 0-3.8-.59-5.32-1.61l-.38-.25-4.34.95.92-4.23-.25-.39C5.62 18.45 5 16.71 5 14.98 5 9.46 9.46 5 15 5c5.52 0 10 4.46 10 9.98 0 5.52-4.46 10.53-10 10.53z"/>
      </svg>
    </a>
  );
}

