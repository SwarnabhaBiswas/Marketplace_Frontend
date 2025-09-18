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
  const [prodPage, setProdPage] = useState(1);
  const [prodTotalPages, setProdTotalPages] = useState(1);
  const [prodLoading, setProdLoading] = useState(false);
  const PROD_LIMIT = 12;
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

  async function fetchProductsPage(nextPage = 1) {
    if (prodLoading) return;
    setProdLoading(true);
    try {
      const res = await api.get("/products", {
        params: { page: nextPage, limit: PROD_LIMIT, _: Date.now() },
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = res.data?.data || [];
      const total = res.data?.total || 0;
      setProducts(data);
      setProdTotalPages(Math.max(1, Math.ceil(total / PROD_LIMIT)));
      setProdPage(nextPage);
    } catch (e) {
      console.error(e);
    }
    setProdLoading(false);
  }

  async function load() {
    try {
      const d = await api.get("/dealers");
      setDealers(d.data.data);
      await fetchProductsPage(1);
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
      await fetchProductsPage(prodPage);
    } catch {
      alert("Delete failed");
    }
  }

  if (checking) return <div className="p-5">Loading...</div>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-3 py-6 mt-20">
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
              <p className="text-gray-500">{prodLoading ? 'Loading…' : 'No products found.'}</p>
            ) : (
              <>
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

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => prodPage > 1 && fetchProductsPage(prodPage - 1)}
                    disabled={prodPage === 1 || prodLoading}
                    className="rounded-full px-3 py-1.5 text-sm bg-gray-200 text-gray-800 disabled:opacity-50"
                  >
                    ‹
                  </button>
                  {(() => {
                    const maxVisible = 5;
                    const pages = [];
                    const total = prodTotalPages;
                    const page = prodPage;
                    if (total <= maxVisible) {
                      for (let i = 1; i <= total; i++) pages.push(i);
                    } else {
                      let start = Math.max(1, page - 2);
                      let end = start + maxVisible - 1;
                      if (end > total) {
                        end = total;
                        start = end - maxVisible + 1;
                      }
                      for (let i = start; i <= end; i++) pages.push(i);
                    }
                    return pages.map((n) => (
                      <button
                        key={n}
                        onClick={() => fetchProductsPage(n)}
                        disabled={prodLoading}
                        className={`min-w-[2.25rem] rounded-full px-3 py-1.5 text-sm transition ${
                          page === n ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-600 hover:text-white'
                        }`}
                      >
                        {n}
                      </button>
                    ));
                  })()}
                  <button
                    onClick={() => prodPage < prodTotalPages && fetchProductsPage(prodPage + 1)}
                    disabled={prodPage === prodTotalPages || prodLoading}
                    className="rounded-full px-3 py-1.5 text-sm bg-gray-200 text-gray-800 disabled:opacity-50"
                  >
                    ›
                  </button>
                </div>
              </>
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
                      <div className="mt-1 text-sm text-gray-800">
                        <span className="font-semibold">Purpose:</span>{' '}
                        {d.enquiryType === 'bulk' ? (
                          <>
                            Buy in bulk{d.volumeBand ? ` — Qty: ${d.volumeBand}` : ''}{d.message ? ` — ${d.message}` : ''}
                          </>
                        ) : (
                          'To be a dealer'
                        )}
                      </div>
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
            <div className="w-[640px] max-w-[92vw] max-h-[85vh] overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
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
                onSaved={async () => {
                  setEditing(null);
                  await fetchProductsPage(prodPage);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
