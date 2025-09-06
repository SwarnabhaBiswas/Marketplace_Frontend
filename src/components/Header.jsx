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
    <header className="sticky top-0 z-50 bg-brand text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo */}
          <div className="font-extrabold text-lg">
            <Link to="/">Swasti</Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/products" className="hover:opacity-90">Products</Link>
            <Link to="/support" className="hover:opacity-90">Support</Link>
            <Link to="/become-dealer" className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20">Business Enquiry</Link>
            {isAdmin ? (
              <>
                <Link to="/admin" className="text-sm opacity-90 hover:opacity-100">Dashboard</Link>
                <button onClick={doLogout} className="text-sm opacity-80 hover:opacity-100">Logout</button>
              </>
            ) : (
              <Link to="/admin/login" className="text-sm opacity-80 hover:opacity-100">Admin Login</Link>
            )}
          </nav>

          {/* Mobile: mini nav + hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <Link to="/products" className="text-sm hover:opacity-90">Products</Link>
            <Link to="/become-dealer" className="text-sm inline-flex items-center rounded-md bg-white/10 px-2.5 py-1.5 font-medium hover:bg-white/20">Business Enquiry</Link>
            <button aria-label="Open menu" onClick={() => setOpen(true)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 hover:bg-white/10">
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
              {/* Keep Support/Contact/Admin links in sidebar */}
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
