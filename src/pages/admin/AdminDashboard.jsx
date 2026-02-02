// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { updateDealerStatus, deleteDealer } from "../../api/api";
import api from "../../api/api";
import Header from "../../components/Header";
import ProductForm from "../../components/ProductForm";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MapPicker from "../../components/MapPicker";

export default function AdminDashboard() {
  const [dealers, setDealers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [checking, setChecking] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [prodPage, setProdPage] = useState(1);
  const [prodTotalPages, setProdTotalPages] = useState(1);
  const [prodLoading, setProdLoading] = useState(false);
  const [showAddDealer, setShowAddDealer] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [savingDealer, setSavingDealer] = useState(false);
  const [dealerError, setDealerError] = useState("");
  const [hasDealerCoords, setHasDealerCoords] = useState(false);
  const [newDealer, setNewDealer] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    orgType: "",
    gst: "",
    pan: "",
    years: "",
    territory: "",
    volumeBand: "",
    address: "",
    state: "",
    district: "",
    area: "",
    landmark: "",
    pincode: "",
    dealerLocation: { latitude: "", longitude: "", address: "" },
  });
  function handleMapLocationSelect(loc) {
    setNewDealer((prev) => ({
      ...prev,
      dealerLocation: {
        latitude: String(loc.latitude ?? ""),
        longitude: String(loc.longitude ?? ""),
        address: loc.formattedAddress || prev.dealerLocation.address,
      },
      state: loc.state || prev.state,
      district: loc.district || prev.district,
      area: loc.area || prev.area,
      address: loc.address || prev.address,
      landmark: loc.landmark || prev.landmark,
      pincode: loc.pincode || prev.pincode,
    }));
    setHasDealerCoords(true);
    setShowMapPicker(false);
  }
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Dealer Applications</h2>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => setShowAddDealer(true)}
              >
                + Add Dealer
              </button>
            </div>
            {dealers.length === 0 ? (
              <p className="text-gray-500">No dealer applications found.</p>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const approved = dealers.filter((d) => d.status === "Approved");
                  const rejected = dealers.filter((d) => d.status === "Rejected");
                  const terminated = dealers.filter((d) => d.status === "Terminated");
                  const sections = [
                    { title: "Approved", list: approved },
                    { title: "Rejected", list: rejected },
                    { title: "Terminated", list: terminated },
                  ];
                  return sections.map(({ title, list }) => (
                    <div key={title}>
                      <h3 className="text-lg font-semibold">{title}</h3>
                      {list.length === 0 ? (
                        <p className="text-gray-500">None</p>
                      ) : (
                        <div className="space-y-4">
                          {list.map((d) => (
                            <div
                              key={d._id}
                              className="rounded-lg border bg-gray-100 p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                            >
                              <div>
                                <h3 className="text-lg font-semibold">{d.companyName || d.contactName}</h3>
                                <p className="text-sm text-gray-700">{d.email}</p>
                                <p className="text-sm text-gray-700">Ph: {d.phone}</p>
                                <div className="mt-1 text-sm text-gray-800 space-y-0.5">
                                  {(d.address || d.area || d.district || d.state || d.landmark) && (
                                    <p>
                                      <span className="font-semibold">Address:</span>{' '}
                                      {[d.address, d.area, d.district, d.state].filter(Boolean).join(', ')}
                                      {d.landmark ? ` (Landmark: ${d.landmark})` : ''}
                                    </p>
                                  )}
                                </div>
                                <div className="mt-1 text-sm text-gray-800">
                                  <span className="font-semibold">Purpose:</span>{' '}
                                  {d.enquiryType === 'bulk' ? (
                                    <>Buy in bulk{d.volumeBand ? ` — Qty: ${d.volumeBand}` : ''}{d.message ? ` — ${d.message}` : ''}</>
                                  ) : (
                                    'To be a dealer'
                                  )}
                                </div>
                              </div>
                              <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end">
                                <span className="italic text-sm">{d.status}</span>
                                {title === "Approved" && (
                                  <div className="mt-2">
                                    <button
                                      disabled={deletingId === d._id}
                                      onClick={async () => {
                                        const ok = await Swal.fire({
                                          title: "Terminate dealership?",
                                          text: "This will mark the dealer as Terminated and send a termination email.",
                                          icon: "warning",
                                          showCancelButton: true,
                                          confirmButtonColor: "#dc2626",
                                          confirmButtonText: "Terminate",
                                        });
                                        if (!ok.isConfirmed) return;
                                        setDeletingId(d._id);
                                        try {
                                          await deleteDealer(d._id);
                                          await load();
                                          await Swal.fire({ title: "Terminated", text: "Dealer has been terminated.", icon: "success" });
                                        } catch (err) {
                                          const msg = err?.response?.data?.message || "Termination failed";
                                          await Swal.fire({ title: "Failed", text: msg, icon: "error" });
                                        } finally {
                                          setDeletingId(null);
                                        }
                                      }}
                                      className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                                    >
                                      {deletingId === d._id ? "Terminating…" : "Terminate"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ));
                })()}
                {/* Pending applications rendered above sections */}
                <div>
                  <h3 className="text-lg font-semibold">Pending</h3>
                  {dealers.filter((d) => d.status === "Pending").length === 0 ? (
                    <p className="text-gray-500">None</p>
                  ) : (
                    <div className="space-y-4">
                      {dealers.filter((d) => d.status === "Pending").map((d) => (
                        <div
                          key={d._id}
                          className="rounded-lg border bg-gray-100 p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <h3 className="text-lg font-semibold">{d.companyName || d.contactName}</h3>
                            <p className="text-sm text-gray-700">{d.email}</p>
                            <p className="text-sm text-gray-700">Ph: {d.phone}</p>
                            <div className="mt-1 text-sm text-gray-800 space-y-0.5">
                              {(d.address || d.area || d.district || d.state || d.landmark) && (
                                <p>
                                  <span className="font-semibold">Address:</span>{' '}
                                  {[d.address, d.area, d.district, d.state].filter(Boolean).join(', ')}
                                  {d.landmark ? ` (Landmark: ${d.landmark})` : ''}
                                </p>
                              )}
                            </div>
                            <div className="mt-1 text-sm text-gray-800">
                              <span className="font-semibold">Purpose:</span>{' '}
                              {d.enquiryType === 'bulk' ? (
                                <>Buy in bulk{d.volumeBand ? ` — Qty: ${d.volumeBand}` : ''}{d.message ? ` — ${d.message}` : ''}</>
                              ) : (
                                'To be a dealer'
                              )}
                            </div>
                          </div>
                          <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end">
                            <span className="italic text-sm">{d.status}</span>
                            <div className="mt-2 flex gap-2">
                              <button
                                disabled={approvingId === d._id}
                                onClick={async () => {
                                  setApprovingId(d._id);
                                  try {
                                    await updateDealerStatus(d._id, "Approved");
                                    await load();
                                    await Swal.fire({ title: "Approved", text: "Dealer approved successfully.", icon: "success" });
                                  } catch (err) {
                                    const msg = err?.response?.data?.message || "Approve failed";
                                    await Swal.fire({ title: "Failed", text: msg, icon: "error" });
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
                                    await Swal.fire({ title: "Rejected", text: "Dealer rejected.", icon: "success" });
                                  } catch (err) {
                                    const msg = err?.response?.data?.message || "Reject failed";
                                    await Swal.fire({ title: "Failed", text: msg, icon: "error" });
                                  } finally {
                                    setRejectingId(null);
                                  }
                                }}
                                className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                              >
                                {rejectingId === d._id ? "Rejecting…" : "Reject"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {showAddDealer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="w-[720px] max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">Add Dealer</h3>
                    <button
                      className="rounded-md border px-2 py-1 text-sm"
                      onClick={() => setShowAddDealer(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setDealerError("");
                    const lat = Number(newDealer.dealerLocation?.latitude);
                    const lng = Number(newDealer.dealerLocation?.longitude);
                    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                      setDealerError("Please select a valid location (latitude/longitude).");
                      return;
                    }
                    if (!newDealer.companyName && !newDealer.contactName) {
                      setDealerError("Provide Company Name or Contact Name.");
                      return;
                    }
                    (async () => {
                      setSavingDealer(true);
                      try {
                        const payload = { ...newDealer, enquiryType: "dealer" };
                        const created = await api.post("/dealers", payload);
                        const id = created?.data?.data?._id;
                        if (id) {
                          await updateDealerStatus(id, "Approved");
                        }
                        await Swal.fire({ title: "Dealer added", text: "The dealer has been added and approved.", icon: "success" });
                        setShowAddDealer(false);
                        setNewDealer({
                          companyName: "",
                          contactName: "",
                          email: "",
                          phone: "",
                          orgType: "",
                          gst: "",
                          pan: "",
                          years: "",
                          territory: "",
                          volumeBand: "",
                          address: "",
                          state: "",
                          district: "",
                          area: "",
                          landmark: "",
                          pincode: "",
                          dealerLocation: { latitude: "", longitude: "", address: "" },
                        });
                        await load();
                      } catch (err) {
                        const msg = err?.response?.data?.message || "Failed to add dealer.";
                        setDealerError(msg);
                        await Swal.fire({ title: "Failed", text: msg, icon: "error" });
                      } finally {
                        setSavingDealer(false);
                      }
                    })();
                  }} className="space-y-3">
                    {dealerError && (
                      <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-700 text-sm">{dealerError}</div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        value={newDealer.companyName}
                        onChange={(e) => setNewDealer({ ...newDealer, companyName: e.target.value })}
                        placeholder="Company Name"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <input
                        value={newDealer.contactName}
                        onChange={(e) => setNewDealer({ ...newDealer, contactName: e.target.value })}
                        placeholder="Contact Name"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <input
                        type="email"
                        value={newDealer.email}
                        onChange={(e) => setNewDealer({ ...newDealer, email: e.target.value })}
                        placeholder="Email"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <input
                        value={newDealer.phone}
                        onChange={(e) => setNewDealer({ ...newDealer, phone: e.target.value })}
                        placeholder="Phone"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        value={newDealer.state}
                        onChange={(e) => setNewDealer({ ...newDealer, state: e.target.value })}
                        placeholder="State"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <input
                        value={newDealer.district}
                        onChange={(e) => setNewDealer({ ...newDealer, district: e.target.value })}
                        placeholder="District"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <input
                        value={newDealer.area}
                        onChange={(e) => setNewDealer({ ...newDealer, area: e.target.value })}
                        placeholder="Area"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <input
                        value={newDealer.pincode}
                        onChange={(e) => setNewDealer({ ...newDealer, pincode: e.target.value })}
                        placeholder="Pincode"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <input
                        value={newDealer.landmark}
                        onChange={(e) => setNewDealer({ ...newDealer, landmark: e.target.value })}
                        placeholder="Landmark"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <input
                        value={newDealer.address}
                        onChange={(e) => setNewDealer({ ...newDealer, address: e.target.value })}
                        placeholder="Address"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    <section className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:px-4 md:py-4 space-y-3">
                      <div className="text-sm md:text-base font-semibold">Location</div>
                      <p className="text-xs text-slate-600">Select a location on map; coordinates and address will be captured.</p>

                      {hasDealerCoords ? (
                        <div className="space-y-2">
                          <div className="w-full rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-700 text-sm">✓ Location captured successfully</div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setShowMapPicker(true)}
                              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-brand px-3 py-2 text-xs md:text-sm text-brand hover:bg-brand hover:text-white"
                            >
                              Select from Map Again
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => setShowMapPicker(true)}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border-2 border-brand px-4 py-3 text-sm font-medium text-brand hover:bg-brand hover:text-white"
                          >
                            Select from Map
                          </button>
                        </div>
                      )}

                      {newDealer.dealerLocation.address && (
                        <div className="text-xs text-slate-600">{newDealer.dealerLocation.address}</div>
                      )}
                    </section>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddDealer(false)}
                        className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingDealer}
                        className="px-4 py-2 rounded-md bg-brand text-white hover:bg-opacity-90 disabled:opacity-60"
                      >
                        {savingDealer ? "Saving…" : "Save & Approve"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showMapPicker && (
              <MapPicker onLocationSelect={handleMapLocationSelect} onClose={() => setShowMapPicker(false)} />
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
