import React, { useState } from 'react';
import api from '../api/api';

const CLOUDINARY_PLACEHOLDER_URL = "https://res.cloudinary.com/dv9gqhdiy/image/upload/v1756923531/cld-sample-4.jpg";

export default function ProductForm({ initial, onSaved }) {
  const [form, setForm] = useState(
    initial || {
      name: '',
      slug: '',
      category: '',
      description: '',
      specs: {},
      images: [],
      brochureUrl: '',
    }
  );
  const [uploading, setUploading] = useState(false);

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
      <div style={{ display: 'grid', gap: 8 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setField('name', e.target.value)}
          className="form-input"
        />
        <input
          placeholder="Slug"
          value={form.slug}
          onChange={e => setField('slug', e.target.value)}
          className="form-input"
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={e => setField('category', e.target.value)}
          className="form-input"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setField('description', e.target.value)}
          className="form-input"
        />
        <input
          placeholder="Brochure URL"
          value={form.brochureUrl}
          onChange={e => setField('brochureUrl', e.target.value)}
          className="form-input"
        />
        <div>
          <label className="btn">
            Upload Image
            <input type="file" onChange={handleFile} style={{ display: 'none' }} />
          </label>
          {uploading && <span>Uploading...</span>}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(form.images || []).map((img) => (
            <img
              key={img.publicId}
              src={img.url || CLOUDINARY_PLACEHOLDER_URL}
              onError={e => { e.target.onerror = null; e.target.src = CLOUDINARY_PLACEHOLDER_URL; }}
              style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }}
              alt=""
            />
          ))}
        </div>
        <div>
          <button onClick={save} className="btn">
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
