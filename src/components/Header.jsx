import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import api from '../api/api';

export default function Header(){
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { mounted = false; window.removeEventListener('scroll', onScroll); };
  }, []);

  async function doLogout() {
    if (!confirm('Are you sure you want to logout?')) return;
    try { await api.post('/auth/logout'); } catch {}
    setIsAdmin(false);
    nav('/');
    setOpen(false);
  }

  const linkBase = `text-[1.15rem] font-medium inline-flex h-12 items-center px-3 text-base text-primary relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-primary after:w-0 after:transition-[width] after:duration-300 hover:after:w-full`;
  const navClass = ({ isActive }) => `${linkBase} ${isActive ? 'text-orange-500 after:bg-attention' : ''}`;

  return (
    <header role="navigation" aria-label="Main" className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/60 backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-xl shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Left: Logo */}
          <div className='md:block'>
            <Link to="/"><img src='/logo.png' alt='logo' className="md:px-20 h-[2.5em] md:h-[4em]"></img></Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 md:px-20">
            <NavLink to="/" className={navClass}>Home</NavLink>
            <NavLink to="/products" className={navClass}>Products</NavLink>
            <NavLink to="/about" className={navClass}>About</NavLink>
            <NavLink to="/support" className={navClass}>Support</NavLink>
            <NavLink to="/become-dealer" className={navClass}>Business Enquiry</NavLink>
            {isAdmin ? (
              <>
                <NavLink to="/admin" className={navClass}>Dashboard</NavLink>
                <button onClick={doLogout} className={linkBase}>Logout</button>
              </>
            ) : (
              <NavLink to="/admin/login" className={navClass}>Admin Login</NavLink>
            )}
          </nav>

          {/* Mobile: mini nav + hamburger */}
          <div className="flex items-center gap-4 md:hidden ">
            <NavLink to="/products" className={({isActive})=>`text-base ${isActive?'text-accent':'text-primary'}`}>Products</NavLink>
            <NavLink to="/become-dealer" className={({isActive})=>`text-white inline-flex items-center rounded-full bg-attention px-3 py-1.5 font-medium ${isActive?'text-accent':'text-platinum text-primary'}`}>Business</NavLink>
            <button aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} className="inline-flex h-9 w-9 flex-col items-center justify-center rounded-md gap-1">
              <span className="block h-0.5 w-5 bg-primary"></span>
              <span className="block h-0.5 w-5 bg-primary"></span>
              <span className="block h-0.5 w-5 bg-primary"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {open && createPortal(
        <div className="fixed inset-0 z-[1000] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[80vw] bg-white text-primary shadow-2xl">
            <div className="flex items-center justify-between p-4">
              <div className="font-bold">Menu</div>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="hover:opacity-80">✕</button>
            </div>
            <nav className="p-4 flex flex-col gap-2">
              <NavLink to="/" onClick={() => setOpen(false)} className={({isActive})=>`px-2 py-2 rounded hover:bg-primary/5 ${isActive?'text-accent':'text-primary'}`}>Home</NavLink>
              <NavLink to="/products" onClick={() => setOpen(false)} className={({isActive})=>`px-2 py-2 rounded hover:bg-primary/5 ${isActive?'text-accent':'text-primary'}`}>Products</NavLink>
              <NavLink to="/become-dealer" onClick={() => setOpen(false)} className={({isActive})=>`px-2 py-2 rounded hover:bg-primary/5 ${isActive?'text-accent':'text-primary'}`}>Business</NavLink>
              <NavLink to="/about" onClick={() => setOpen(false)} className={({isActive})=>`px-2 py-2 rounded hover:bg-primary/5 ${isActive?'text-accent':'text-primary'}`}>About</NavLink>
              <NavLink to="/support" onClick={() => setOpen(false)} className={({isActive})=>`px-2 py-2 rounded hover:bg-primary/5 ${isActive?'text-accent':'text-primary'}`}>Support</NavLink>
              <a href="/#contact" onClick={() => setOpen(false)} className={`px-2 py-2 rounded hover:bg-primary/5 text-primary`}>Contact</a>
              {isAdmin ? (
                <>
                  <NavLink to="/admin" onClick={() => setOpen(false)} className={({isActive})=>`px-2 py-2 rounded hover:bg-primary/5 ${isActive?'text-accent':'text-primary'}`}>Dashboard</NavLink>
                  <button onClick={doLogout} className="text-left px-2 py-2 rounded hover:bg-primary/5 text-primary">Logout</button>
                </>
              ) : (
                <NavLink to="/admin/login" onClick={() => setOpen(false)} className={({isActive})=>`px-2 py-2 rounded hover:bg-primary/5 ${isActive?'text-accent':'text-primary'}`}>Admin</NavLink>
              )}
            </nav>
          </div>
        </div>, document.body)
      }
    </header>
  );
}
