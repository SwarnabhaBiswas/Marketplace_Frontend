// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { updateDealerStatus } from "../../api/api";
import api from "../../api/api";
import Header from "../../components/Header";
import ProductForm from "../../components/ProductForm";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const [dealers, setDealers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [checking, setChecking] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get("/auth/me");
        if (me.data?.user?.role !== "MASTER_ADMIN") {
          nav("/admin/login", { replace: true });
          return;
        }
        await load();
      } catch {
        nav("/admin/login", { replace: true });
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
    } catch {
      await Swal.fire({
        title: "Failed to load",
        text: "Ensure you are logged in.",
        icon: "error",
      });
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete("/products/" + id);
      load();
    } catch {
      alert("Delete failed");
    }
  }

  if (checking) return <div className="p-5">Loading...</div>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-3 py-6 mt-16">
        {/* Title + Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold mb-3 md:mb-0">Admin Dashboard</h1>
          <div className="flex gap-2">
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "products"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "dealers"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("dealers")}
            >
              Dealers
            </button>
          </div>
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Products</h2>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => setEditing({})}
              >
                + Add Product
              </button>
            </div>

            {products.length === 0 ? (
              <p className="text-gray-500">No products found.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="rounded-lg border bg-white shadow hover:shadow-md transition p-3 flex flex-col"
                  >
                    {/* Product Image */}
                    <div className="relative h-36 w-full mb-3">
                      <img
                        src={p.images?.[0]?.url || "/placeholder.svg"}
                        alt={p.name}
                        className="h-full w-full object-cover rounded-md"
                        onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                      />
                    </div>

                    {/* Product Info */}
                    <h3 className="text-lg font-semibold mb-2">{p.name}</h3>

                    {/* Action Buttons */}
                    <div className="mt-auto flex gap-2">
                      <button
                        className="flex-1 rounded-md border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-600 hover:text-white"
                        onClick={() => setEditing(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="flex-1 rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                        onClick={() => deleteProduct(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* DEALERS TAB */}
        {activeTab === "dealers" && (
          <section>
            <h2 className="text-xl font-medium mb-4">Dealer Applications</h2>
            {dealers.length === 0 ? (
              <p className="text-gray-500">No dealer applications found.</p>
            ) : (
              <div className="space-y-4">
                {dealers.map((d) => (
                  <div
                    key={d._id}
                    className="rounded-lg border bg-gray-100 p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    {/* Dealer Info */}
                    <div>
                      <h3 className="text-lg font-semibold">{d.companyName}</h3>
                      <p className="text-sm text-gray-700">{d.email}</p>
                      <p className="text-sm text-gray-700">Ph: {d.phone}</p>
                      {d.message && <p className="mt-1">{d.message}</p>}
                    </div>

                    {/* Status + Actions */}
                    <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end">
                      <span className="italic text-sm">{d.status}</span>
                      {d.status === "Pending" && (
                        <div className="mt-2 flex gap-2">
                          <button
                            disabled={approvingId === d._id}
                            onClick={async () => {
                              setApprovingId(d._id);
                              try {
                                await updateDealerStatus(d._id, "Approved");
                                await load();
                              } finally {
                                setApprovingId(null);
                              }
                            }}
                            className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-60"
                          >
                            {approvingId === d._id ? "Approving…" : "Approve"}
                          </button>
                          <button
                            disabled={rejectingId === d._id}
                            onClick={async () => {
                              setRejectingId(d._id);
                              try {
                                await updateDealerStatus(d._id, "Rejected");
                                await load();
                              } finally {
                                setRejectingId(null);
                              }
                            }}
                            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            {rejectingId === d._id ? "Rejecting…" : "Reject"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* PRODUCT FORM MODAL */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[640px] max-w-[92vw] rounded-lg bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">
                  {editing._id ? "Edit Product" : "New Product"}
                </h3>
                <button
                  className="rounded-md border px-2 py-1 text-sm"
                  onClick={() => setEditing(null)}
                >
                  ✕
                </button>
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
