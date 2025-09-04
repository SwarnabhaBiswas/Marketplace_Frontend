import React from 'react';
export default function Footer(){
  return (
    <footer style={{background:'#0f1724', color:'#fff', padding:'24px 0', marginTop:40}}>
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>© {new Date().getFullYear()} Swasti</div>
          <div>Contact: client@swasti.com</div>
        </div>
      </div>
    </footer>
  );
}
