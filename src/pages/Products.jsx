import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import api from "../api/api";
import { m } from "framer-motion";
import { fadeSlideUp } from "../lib/motion";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const initialCat = searchParams.get("category") || "all";
  const initialQ = searchParams.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [searchInput, setSearchInput] = useState(initialQ);
  const [categories, setCategories] = useState([]);
  const [cat, setCat] = useState(initialCat);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const reqId = React.useRef(0);

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadCats();
  }, []);

  // Keep filters in sync with URL query params (category, q)
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const urlCat = sp.get("category") || "all";
    const urlQ = sp.get("q") || "";

    if (urlCat !== cat) setCat(urlCat);
    if (urlQ !== q) {
      setQ(urlQ);
      setSearchInput(urlQ);
    }
  }, [location.search]);

  async function fetchPage(nextPage = 1) {
    const id = ++reqId.current;
    setLoadingPage(true);
    try {
      const params = { page: nextPage, limit: 12 };
      if (q) params.q = q;
      if (cat && cat !== "all") params.category = cat;
      const res = await api.get("/products", { params });
      if (id !== reqId.current) return; // ignore stale responses
      const data = res.data?.data || [];
      setProducts(data);
      const total = res.data?.total || 0;
      setTotalPages(Math.max(1, Math.ceil(total / 12)));
      setPage(nextPage);
    } catch (err) {
      if (id === reqId.current) console.error(err);
    } finally {
      if (id === reqId.current) setLoadingPage(false);
    }
  }

  useEffect(() => {
    fetchPage(1);
  }, [q, cat]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col bg-platinum">
      <Header />
      <main className="flex-1">
        {/* Hero banner */}
        <section className="bg-primary text-white py-20 mt-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-2 text-neutral">
              Explore Our Products
            </h1>
            <p className="text-platinum max-w-2xl mx-auto">
              Premium fittings, pipes, and electricals — designed for durability
              & reliability.
            </p>
          </div>
        </section>

        {/* Search + Filters */}
        <div className="container mx-auto px-4 -mt-8 relative z-20">
          <m.div
            className="rounded-2xl shadow-xl bg-white px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeSlideUp}
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={cat}
                onChange={(e) => {
                  const newCat = e.target.value;
                  setCat(newCat);
                  setSearchInput(""); // clear the input field
                  setQ(""); // clear the search query
                }}
                className="rounded-full bg-platinum text-primary border border-neutral px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-full sm:w-96 items-center gap-2">
              <input
                aria-label="Search products"
                placeholder="Search by name or category..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setQ(searchInput.trim());
                }}
                className="w-full rounded-full border border-neutral px-4 py-2 outline-none focus:ring-2 focus:ring-accent bg-platinum"
              />
              <button
                aria-label="Search"
                onClick={() => setQ(searchInput.trim())}
                className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-white hover:bg-primary transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  />
                </svg>
              </button>
            </div>
          </m.div>
        </div>

        {/* Products grid */}
        <div className="container mx-auto px-4 py-10">
          {products.length === 0 && !loadingPage ? (
            <div className="text-center text-gray-600">
              {q ? `No products found for "${q}".` : "No products available."}
              <div className="mt-4">
                <button
                  onClick={() => {
                    setSearchInput("");
                    setCat("all");
                    setQ("");
                    setPage(1);
                  }}
                  className="rounded-full bg-accent px-6 py-2 text-white hover:bg-primary transition"
                >
                  Explore All Products
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p, i) => (
                <m.div
                  key={p._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={fadeSlideUp}
                  custom={(i % 12) * 0.05}
                >
                  <ProductCard p={p} />
                </m.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="pb-12 flex items-center justify-center gap-2">
          <button
            onClick={() => page > 1 && fetchPage(page - 1)}
            disabled={page === 1}
            className="rounded-full px-3 py-1.5 text-sm bg-neutral text-primary disabled:opacity-50"
          >
            ‹
          </button>
          {(() => {
            const maxVisible = 5;
            const pages = [];
            const total = totalPages;
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
                onClick={() => fetchPage(n)}
                className={`min-w-[2.25rem] rounded-full px-3 py-1.5 text-sm transition ${
                  page === n
                    ? "bg-accent text-white"
                    : "bg-neutral text-primary hover:bg-accent hover:text-white"
                }`}
              >
                {n}
              </button>
            ));
          })()}
          <button
            onClick={() => page < totalPages && fetchPage(page + 1)}
            disabled={page === totalPages}
            className="rounded-full px-3 py-1.5 text-sm bg-neutral text-primary disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
