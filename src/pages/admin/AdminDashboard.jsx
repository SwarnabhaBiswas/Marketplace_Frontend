import React, { useEffect, useState } from "react";
import { updateDealerStatus } from "../../api/api";
import api from "../../api/api";
import Header from "../../components/Header";
import ProductForm from "../../components/ProductForm";

export default function AdminDashboard() {
  const [dealers, setDealers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    load();
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

  return (
    <>
      <Header />
      <div className="admin-panel container">
        <h1>Admin Dashboard</h1>
        <section style={{ marginTop: 20 }}>
          <h2>Products</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setEditing({});
              }}
              className="btn"
            >
              + Add Product
            </a>
            {products.map((p) => (
              <div key={p._id} style={{ width: 220 }} className="card">
                <img
                  src={
                    p.images?.[0]?.url || "https://via.placeholder.com/400x250"
                  }
                  alt={p.name}
                  style={{ width: "100%", height: 120, objectFit: "cover" }}
                />
                <div style={{ paddingTop: 8 }}>
                  <strong>{p.name}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2>Recent Dealer Applications</h2>
          <div style={{ marginTop: 12 }}>
            {dealers.map((d) => (
              <div
                key={d._id}
                className="card"
                style={{ marginBottom: 8, padding: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{d.companyName}</strong>
                    <div style={{ fontSize: 13 }}>
                      {d.email} • {d.phone}
                    </div>
                    <div style={{ marginTop: 6 }}>{d.message}</div>
                  </div>
                  <div>
                    <em>{d.status}</em>
                    {d.status === "Pending" && (
                      <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                        <button
                          onClick={async () => {
                            await updateDealerStatus(d._id, "Approved");
                            load();
                          }}
                          className="btn btn-sm bg-green-600 text-white"
                        >
                          Approve
                        </button>
                        <button
                          onClick={async () => {
                            await updateDealerStatus(d._id, "Rejected");
                            load();
                          }}
                          className="btn btn-sm bg-red-600 text-white"
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

        {editing && (
          <div style={{ marginTop: 24 }}>
            <h3>{editing._id ? "Edit Product" : "New Product"}</h3>
            <ProductForm
              initial={editing}
              onSaved={() => {
                setEditing(null);
                load();
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
