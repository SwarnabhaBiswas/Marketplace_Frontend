import React, { useEffect, useState } from "react";
import api from "../api/api";
import ImageCropperModal from "./ImageCropperModal";
import Swal from "sweetalert2";

const CLOUDINARY_PLACEHOLDER_URL = "/placeholder.svg";

const defaults = {
  name: "",
  category: "",
  description: "",
  specs: {},
  images: [],
};

export default function ProductForm({ initial, onSaved }) {
  const [form, setForm] = useState(() => ({ ...defaults, ...(initial || {}) }));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [specRows, setSpecRows] = useState([]);

  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [pendingIndex, setPendingIndex] = useState(0);
  const [uploadCfg, setUploadCfg] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false); 
  const ASPECT = 4/3; 

  useEffect(() => {
    setForm({ ...defaults, ...(initial || {}) });
  }, [initial]);

  // Initialize spec rows from incoming form/initial
  useEffect(() => {
    const src = (initial && initial.specs) || form.specs || {};
    const rows = Object.entries(src).map(([k, v]) => ({
      k,
      v: String(v ?? ""),
    }));
    setSpecRows(rows.length ? rows : [{ k: "", v: "" }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

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

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function addSpecRow() {
    setSpecRows((prev) => [...prev, { k: "", v: "" }]);
  }
  function updateSpecRow(i, field, value) {
    setSpecRows((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row))
    );
  }
  function removeSpecRow(i) {
    setSpecRows((prev) =>
      prev.filter((_, idx) => idx !== i).length
        ? prev.filter((_, idx) => idx !== i)
        : [{ k: "", v: "" }]
    );
  }

  function specRowsToObject(rows) {
    const out = {};
    rows.forEach(({ k, v }) => {
      const key = String(k || "").trim();
      if (!key) return;
      out[key] = String(v ?? "").trim();
    });
    return out;
  }

  async function handleFile(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      // get signature
      const sigRes = await api.get("/upload/sign");
      setUploadCfg(sigRes.data);
      setPendingFiles(files);
      setPendingIndex(0);
      const first = files[0];
      const url = URL.createObjectURL(first);
      setCropSrc(url);
      setCropOpen(true);
    } catch (err) {
      console.error(err);
      setUploading(false);
      await Swal.fire({
        title: "Upload failed to start",
        text: "Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  async function uploadCroppedBlob(blob) {
    const { apiKey, cloudName, timestamp, signature } = uploadCfg || {};
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const fd = new FormData();
    const file = new File([blob], `cropped_${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    fd.append("file", file);
    fd.append("api_key", apiKey);
    fd.append("timestamp", timestamp);
    fd.append("signature", signature);
    const r = await fetch(url, { method: "POST", body: fd });
    const j = await r.json();
    if (!j.secure_url || !j.public_id)
      throw new Error("Invalid Cloudinary response");
    const img = { url: j.secure_url, publicId: j.public_id };
    setForm((prev) => ({ ...prev, images: [...(prev.images || []), img] }));
  }

  function closeCrop() {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setCropOpen(false);
  }

  async function handleCropped(blob) {
    try {
      setConfirmBusy(true);
      await uploadCroppedBlob(blob);
    } catch (e) {
      console.error(e);
      await Swal.fire({
        title: "Upload failed",
        text: "Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    // proceed to next file if any
    const nextIndex = pendingIndex + 1;
    if (nextIndex < pendingFiles.length) {
      // open next image
      if (cropSrc) URL.revokeObjectURL(cropSrc);
      const nxt = pendingFiles[nextIndex];
      const url = URL.createObjectURL(nxt);
      setPendingIndex(nextIndex);
      setCropSrc(url);
      setCropOpen(true);
      setConfirmBusy(false);
    } else {
      // done
      closeCrop();
      setPendingFiles([]);
      setPendingIndex(0);
      setUploading(false);
      setConfirmBusy(false);
    }
  }

  function cancelCropping() {
    // abort entire batch
    closeCrop();
    setPendingFiles([]);
    setPendingIndex(0);
    setUploading(false);
  }

  async function removeImage(publicId) {
    try {
      if (form._id) {
        // Edit mode: delete from Cloudinary and from product via backend
        await api.post(`/products/${form._id}/images/delete`, { publicId });
      }
      // In any case, update local state
      setForm((prev) => ({
        ...prev,
        images: (prev.images || []).filter((img) => img.publicId !== publicId),
      }));
    } catch (err) {
      console.error(err);
      await Swal.fire({
        title: "Delete failed",
        text: "Could not remove the image.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  async function save() {
    try {
      if (!form.name?.trim() || !form.category?.trim()) {
        await Swal.fire({
          title: "Required fields missing",
          text: "Please fill Name and Category.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
      setSaving(true);
      const payload = { ...form, specs: specRowsToObject(specRows) };
      if (form._id) {
        await api.put("/products/" + form._id, payload);
      } else {
        await api.post("/products", payload);
      }
      await Swal.fire({
        title: "Saved",
        icon: "success",
        confirmButtonText: "OK",
      });
      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      await Swal.fire({
        title: "Save failed",
        text: "Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div aria-busy={uploading || saving ? "true" : "false"}>
        <div className="grid gap-3">
          <input
            placeholder="Name*"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
          />
          <div>
            <label className="block text-sm font-medium">
              Category<span className="text-red-600">*</span>
            </label>
            <div className="mt-1 flex items-center gap-2">
              <select
                value={form.category || ""}
                onChange={(e) => setField("category", e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
                {form.category &&
                  !categories.find((c) => c.name === form.category) && (
                    <option value={form.category}>{form.category}</option>
                  )}
              </select>
              <button
                type="button"
                className="rounded-md border px-3 py-2 text-sm bg-attention text-platinum"
                onClick={() => {
                  setAddingCategory(true);
                  setNewCategory("");
                }}
              >
                Add
              </button>
            </div>

            {addingCategory && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                />
                <button
                  type="button"
                  className="rounded-md bg-brand px-3 py-2 text-white"
                  onClick={async () => {
                    const name = newCategory.trim();
                    if (!name) return;
                    try {
                      const res = await api.post("/categories", { name });
                      const catDoc = res.data.data;
                      setCategories((prev) => {
                        const exists = prev.find((c) => c._id === catDoc._id);
                        return exists
                          ? prev
                          : [...prev, catDoc].sort((a, b) =>
                              a.name.localeCompare(b.name)
                            );
                      });
                      setField("category", catDoc.name);
                      setAddingCategory(false);
                    } catch (e) {
                      console.error(e);
                      await Swal.fire({
                        title: "Failed to add category",
                        icon: "error",
                        confirmButtonText: "OK",
                      });
                    }
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="rounded-md border px-3 py-2 text-sm"
                  onClick={() => setAddingCategory(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <textarea
            placeholder={
              "Description (Tip: use numbered bullets, e.g.\n1. First point\n2. Second point)"
            }
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand min-h-[120px]"
          />
          <p className="text-xs text-slate-500">
            If you start lines with 1. 2. 3. they will render as a numbered list
            on the product page. Otherwise, text is shown as a paragraph.
          </p>
          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">
                Specifications
              </label>
              <button
                type="button"
                onClick={addSpecRow}
                className="text-sm rounded-md bg-neutral px-2 py-1 hover:bg-neutral/60"
              >
                + Add
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {specRows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center"
                >
                  <input
                    value={row.k}
                    onChange={(e) => updateSpecRow(i, "k", e.target.value)}
                    placeholder="Name (e.g., Material)"
                    className="sm:col-span-2 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                  />
                  <input
                    value={row.v}
                    onChange={(e) => updateSpecRow(i, "v", e.target.value)}
                    placeholder="Value (e.g., uPVC)"
                    className="sm:col-span-3 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
                  />
                  <div className="sm:col-span-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeSpecRow(i)}
                      className="text-xs rounded-md border px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <label className="inline-flex items-center rounded-md bg-attention px-3 py-2 text-white hover:opacity-90">
              Upload Images
              <input
                type="file"
                multiple
                onChange={handleFile}
                className="hidden"
              />
            </label>
            {uploading && (
              <span className="text-sm text-slate-600">Processing...</span>
            )}
            {pendingFiles.length > 0 && (
              <span className="text-sm text-slate-500">
                {pendingIndex + 1}/{pendingFiles.length}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.images || []).map((img) => (
              <div key={img.publicId} className="relative">
                <img
                  src={img.url || CLOUDINARY_PLACEHOLDER_URL}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = CLOUDINARY_PLACEHOLDER_URL;
                  }}
                  className="h-20 w-28 rounded-md object-cover"
                  alt=""
                />
                <button
                  type="button"
                  onClick={() => removeImage(img.publicId)}
                  className="absolute right-1.5 top-1.5 rounded px-2 py-2 text-red text-2xl"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-1">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-md bg-brand px-4 py-2 text-white disabled:opacity-60 inline-flex items-center gap-2"
            >
              {saving && (
                <span className="h-4 w-4 rounded-full bg-gradient-to-tr from-accent to-attention p-[1px] animate-spin-slow">
                  <span className="block h-full w-full rounded-full bg-transparent"></span>
                </span>
              )}
              {saving ? "Saving…" : "Save Product"}
            </button>
          </div>
        </div>
      </div>

      {cropOpen && cropSrc && (
        <ImageCropperModal
          src={cropSrc}
          aspect={ASPECT}
          onCancel={cancelCropping}
          onCropped={handleCropped}
          title="Crop image"
          busy={confirmBusy}
        />
      )}
    </>
  );
}
