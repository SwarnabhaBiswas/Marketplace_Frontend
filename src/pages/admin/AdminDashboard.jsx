import React, { useEffect, useState } from "react";
import { updateDealerStatus } from "../../api/api";
import api from "../../api/api";
import Header from "../../components/Header";
import ProductForm from "../../components/ProductForm";
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [dealers, setDealers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [checking, setChecking] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get('/auth/me');
        if (me.data?.user?.role !== 'MASTER_ADMIN') {
          nav('/admin/login', { replace: true });
          return;
        }
        await load();
      } catch (err) {
        nav('/admin/login', { replace: true });
        return;
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  async function load() {
    try {
      const d = await api.get("/dealers");
      setDealers(d.data.data);
      const p = await api.get("/products");
      setProducts(p.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load - ensure you are logged in");
    }
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete('/products/' + id);
      load();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

if (checking) return <div className="p-5">Loading...</div>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <div className="sticky top-14 z-40 -mx-4 bg-white/90 backdrop-blur border-b">
          <div className="mx-4 py-2 flex gap-2">
            <button className={`rounded-md px-3 py-1.5 text-sm ${activeTab==='products' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`} onClick={()=>setActiveTab('products')}>Products</button>
            <button className={`rounded-md px-3 py-1.5 text-sm ${activeTab==='dealers' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`} onClick={()=>setActiveTab('dealers')}>Dealers</button>
          </div>
        </div>

        {activeTab === 'products' && (
          <section className="mt-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Products</h2>
              <button className="rounded-md bg-brand px-3 py-2 text-white" onClick={()=>setEditing({})}>+ Add Product</button>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm cursor-pointer hover:shadow-md"
                  onClick={()=> nav(`/product/${p.slug}`)}
                >
                  <img
                    src={p.images?.[0]?.url || '/placeholder.svg'}
                    alt={p.name}
                    className="h-36 w-full rounded-md object-cover"
                    onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; }}
                  />
                  <div className="pt-2">
                    <strong>{p.name}</strong>
                    <div className="mt-2 flex gap-2">
                      <button className="rounded-md border px-3 py-1.5 text-sm" onClick={(e)=>{ e.stopPropagation(); setEditing(p); }}>Edit</button>
                      <button className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white" onClick={(e)=>{ e.stopPropagation(); deleteProduct(p._id); }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'dealers' && (
          <section className="mt-6">
            <h2 className="text-xl font-medium">Dealer Applications</h2>
            <div className="mt-3 space-y-2">
              {dealers.map((d) => (
                <div
                  key={d._id}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>{d.companyName}</strong>
                      <div className="text-sm text-slate-600">
                        {d.email} • {d.phone}
                      </div>
                      <div className="mt-1">{d.message}</div>
                    </div>
                    <div className="text-sm">
                      <em>{d.status}</em>
                      {d.status === "Pending" && (
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={async () => {
                              await updateDealerStatus(d._id, "Approved");
                              load();
                            }}
                            className="rounded-md bg-green-600 px-3 py-1.5 text-white"
                          >
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              await updateDealerStatus(d._id, "Rejected");
                              load();
                            }}
                            className="rounded-md bg-red-600 px-3 py-1.5 text-white"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[640px] max-w-[92vw] rounded-lg bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="m-0 text-lg font-medium">{editing._id ? "Edit Product" : "New Product"}</h3>
                <button className="rounded-md border px-2 py-1 text-sm" onClick={()=>setEditing(null)}>✕</button>
              </div>
              <ProductForm
                initial={editing}
                onSaved={() => {
                  setEditing(null);
                  load();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
