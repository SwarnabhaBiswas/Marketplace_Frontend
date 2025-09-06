import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ImageCropperModal from './ImageCropperModal';

const CLOUDINARY_PLACEHOLDER_URL = "/placeholder.svg";

const defaults = {
  name: '',
  category: '',
  description: '',
  specs: {},
  images: []
};

export default function ProductForm({ initial, onSaved }) {
  const [form, setForm] = useState(() => ({ ...defaults, ...(initial || {}) }));
  const [uploading, setUploading] = useState(false);

  // cropping flow state
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [pendingIndex, setPendingIndex] = useState(0);
  const [uploadCfg, setUploadCfg] = useState(null); // { apiKey, cloudName, timestamp, signature }
  const ASPECT = 1; // square

  useEffect(() => {
    setForm({ ...defaults, ...(initial || {}) });
  }, [initial]);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

async function handleFile(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      // get signature
      const sigRes = await api.get('/upload/sign');
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
      alert('Upload init failed');
    }
  }

async function uploadCroppedBlob(blob) {
  const { apiKey, cloudName, timestamp, signature } = uploadCfg || {};
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const fd = new FormData();
  const file = new File([blob], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' });
  fd.append('file', file);
  fd.append('api_key', apiKey);
  fd.append('timestamp', timestamp);
  fd.append('signature', signature);
  const r = await fetch(url, { method: 'POST', body: fd });
  const j = await r.json();
  if (!j.secure_url || !j.public_id) throw new Error('Invalid Cloudinary response');
  const img = { url: j.secure_url, publicId: j.public_id };
  setForm(prev => ({ ...prev, images: [...(prev.images || []), img] }));
}

function closeCrop() {
  if (cropSrc) URL.revokeObjectURL(cropSrc);
  setCropSrc(null);
  setCropOpen(false);
}

async function handleCropped(blob) {
  try {
    await uploadCroppedBlob(blob);
  } catch (e) {
    console.error(e);
    alert('Upload failed');
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
  } else {
    // done
    closeCrop();
    setPendingFiles([]);
    setPendingIndex(0);
    setUploading(false);
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
      if (!form.name?.trim() || !form.category?.trim()) {
        alert('Please fill required fields: Name and Category');
        return;
      }
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
    <>
    <div>
      <div className="grid gap-3">
<input
          placeholder="Name*"
          value={form.name}
          onChange={e => setField('name', e.target.value)}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
        />
<input
          placeholder="Category*"
          value={form.category}
          onChange={e => setField('category', e.target.value)}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setField('description', e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
        />
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-white hover:opacity-90">
            Upload Images
            <input type="file" multiple onChange={handleFile} className="hidden" />
          </label>
          {uploading && <span className="text-sm text-slate-600">Processing...</span>}
          {pendingFiles.length > 0 && (
            <span className="text-sm text-slate-500">{pendingIndex+1}/{pendingFiles.length}</span>
          )}
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

      {cropOpen && cropSrc && (
        <ImageCropperModal
          src={cropSrc}
          aspect={ASPECT}
          onCancel={cancelCropping}
          onCropped={handleCropped}
          title="Crop image (1:1)"
        />
      )}
    </>
  );
}
