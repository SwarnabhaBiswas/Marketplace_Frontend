import React from 'react';
import { Link } from 'react-router-dom';
export default function Header(){
  return (
    <header className="header">
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div className="logo">Swasti</div>
        <nav className="nav">
          <Link to="/products">Products</Link>
          <Link to="/become-dealer" className="btn">Become a Dealer</Link>
        </nav>
      </div>
    </header>
  );
}
