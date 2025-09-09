import React, { useCallback, useMemo, useState } from 'react';
import Cropper from 'react-easy-crop';

// Utility: create a cropped blob from source image and crop area
async function getCroppedBlob(imageSrc, cropPixels, mimeType = 'image/jpeg', quality = 0.92) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );
  return await new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

export default function ImageCropperModal({ src, onCancel,aspect, onCropped, title = 'Crop image', busy = false }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedPixels(croppedAreaPixels);
  }, []);

  const doConfirm = useCallback(async () => {
    if (!croppedPixels) return;
    const blob = await getCroppedBlob(src, croppedPixels, 'image/jpeg', 0.92);
    onCropped(blob);
  }, [croppedPixels, src, onCropped]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-[720px] max-w-[95vw] rounded-lg bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
            <button onClick={onCancel} className="rounded-md border px-2 py-1 text-sm" disabled={busy}>✕</button>
        </div>
        <div className="relative h-[60vh] min-h-[360px] w-full bg-slate-100 overflow-hidden rounded">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={true}
            restrictPosition={false}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Zoom</span>
            <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e)=>setZoom(parseFloat(e.target.value))} />
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel} className="rounded-md border px-3 py-2 text-sm" disabled={busy}>Cancel</button>
            <button onClick={doConfirm} disabled={busy} className={`rounded-md px-3 py-2 text-sm text-white ${busy ? 'bg-brand cursor-not-allowed' : 'bg-brand'}`}>
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent"></span>
                  Uploading…
                </span>
              ) : (
                'Use Image'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

