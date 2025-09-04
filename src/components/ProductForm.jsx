import React, { useEffect, useState } from 'react';
import api from '../api/api';


const CLOUDINARY_PLACEHOLDER_URL = "/placeholder.svg";

const defaults = {
  name: '',
  slug: '',
  category: '',
  description: '',
  specs: {},
  images: [],
  brochureUrl: '',
};

export default function ProductForm({ initial, onSaved }) {
  const [form, setForm] = useState(() => ({ ...defaults, ...(initial || {}) }));
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm({ ...defaults, ...(initial || {}) });
  }, [initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      // get signature from server
      const sigRes = await api.get('/upload/sign');
      const { apiKey, cloudName, timestamp, signature } = sigRes.data;
      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', apiKey);
      fd.append('timestamp', timestamp);
      fd.append('signature', signature);
      // upload directly to cloudinary
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const r = await fetch(url, { method: 'POST', body: fd });
      const j = await r.json();
      if (!j.secure_url || !j.public_id) throw new Error('Invalid Cloudinary response');
      const img = { url: j.secure_url, publicId: j.public_id };
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), img],
      }));
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
    setUploading(false);
  }

  async function removeImage(publicId) {
    try {
      if (form._id) {
        // Edit mode: delete from Cloudinary and from product via backend
        await api.post(`/products/${form._id}/images/delete`, { publicId });
      }
      // In any case, update local state
      setForm(prev => ({
        ...prev,
        images: (prev.images || []).filter(img => img.publicId !== publicId)
      }));
    } catch (err) {
      console.error(err);
      alert('Failed to delete image');
    }
  }

  async function save() {
    try {
      if (form._id) {
        await api.put('/products/' + form._id, form);
      } else {
        await api.post('/products', form);
      }
      alert('Saved');
      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  }

  return (
    <div>
      <div className="grid gap-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setField('name', e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
        />
        <input
          placeholder="Slug"
          value={form.slug}
          onChange={e => setField('slug', e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={e => setField('category', e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setField('description', e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
        />
        <input
          placeholder="Brochure URL"
          value={form.brochureUrl}
          onChange={e => setField('brochureUrl', e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
        />
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-white hover:opacity-90">
            Upload Image
            <input type="file" onChange={handleFile} className="hidden" />
          </label>
          {uploading && <span className="text-sm text-slate-600">Uploading...</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.images || []).map((img) => (
            <div key={img.publicId} className="relative">
              <img
                src={img.url || CLOUDINARY_PLACEHOLDER_URL}
                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = CLOUDINARY_PLACEHOLDER_URL; }}
                className="h-20 w-28 rounded-md object-cover"
                alt=""
              />
              <button
                type="button"
                onClick={() => removeImage(img.publicId)}
                className="absolute right-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div>
          <button onClick={save} className="rounded-md bg-brand px-4 py-2 text-white">
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
