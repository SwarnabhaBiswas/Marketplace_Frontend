import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Header(){
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/auth/me');
        if (mounted && res.data?.user?.role === 'MASTER_ADMIN') setIsAdmin(true);
      } catch {
        if (mounted) setIsAdmin(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function doLogout() {
    if (!confirm('Are you sure you want to logout?')) return;
    try { await api.post('/auth/logout'); } catch {}
    setIsAdmin(false);
    nav('/');
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-primary text-platinum">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo */}
          <div className="font-extrabold text-lg">
            <Link to="/">Swasti</Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/products" className="inline-flex h-10 items-center px-3 text-base text-neutral hover:text-platinum">Products</Link>
            <Link to="/about" className="inline-flex h-10 items-center px-3 text-base text-neutral hover:text-platinum">About</Link>
            <Link to="/support" className="inline-flex h-10 items-center px-3 text-base text-neutral hover:text-platinum">Support</Link>
            <Link to="/become-dealer" className="inline-flex h-10 items-center rounded-md bg-accent/20 px-4 text-base font-medium text-platinum hover:bg-accent/30">Business Enquiry</Link>
            {isAdmin ? (
              <>
                <Link to="/admin" className="inline-flex h-10 items-center px-3 text-base text-neutral hover:text-platinum">Dashboard</Link>
                <button onClick={doLogout} className="inline-flex h-10 items-center px-3 text-base text-neutral hover:text-platinum">Logout</button>
              </>
            ) : (
              <Link to="/admin/login" className="inline-flex h-10 items-center px-3 text-base text-neutral hover:text-platinum">Admin Login</Link>
            )}
          </nav>

          {/* Mobile: mini nav + hamburger */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/products" className="text-base text-neutral hover:text-platinum">Products</Link>
            <Link to="/become-dealer" className="text-base inline-flex items-center rounded-md bg-accent/20 px-3 py-1.5 font-medium text-platinum">Business Enquiry</Link>
            <button aria-label="Open menu" onClick={() => setOpen(true)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-platinum/30">
              <span className="block h-0.5 w-5 bg-white"></span>
              <span className="block h-0.5 w-5 bg-white mt-1"></span>
              <span className="block h-0.5 w-5 bg-white mt-1"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[80vw] bg-white text-slate-900 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="font-bold">Menu</div>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-slate-600 hover:text-slate-900">✕</button>
            </div>
            <nav className="p-4 flex flex-col gap-2">
              {/* Keep About/Support/Admin links in sidebar */}
              <Link to="/about" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-slate-100">About</Link>
              <Link to="/support" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-slate-100">Support</Link>
              {isAdmin ? (
                <>
                  <Link to="/admin" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-slate-100">Dashboard</Link>
                  <button onClick={doLogout} className="text-left px-2 py-2 rounded hover:bg-slate-100">Logout</button>
                </>
              ) : (
                <Link to="/admin/login" onClick={() => setOpen(false)} className="px-2 py-2 rounded hover:bg-slate-100">Admin Login</Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
