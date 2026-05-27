"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

const MAX_BYTES = 700_000; // ~700KB raw; data URL ~30% larger. Keeps localStorage healthy.
const MAX_DIM = 1280;

function fileToCompressedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read image"));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not available"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ImagePicker({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value?: string;
  onChange: (next: string | undefined) => void;
  helper?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  async function handleFile(f: File | null) {
    if (!f) return;
    if (f.size > 8_000_000) {
      alert("Image is larger than 8MB. Pick something smaller.");
      return;
    }
    try {
      const dataUrl = await fileToCompressedDataUrl(f);
      if (dataUrl.length > MAX_BYTES * 1.4) {
        // still huge after compression
        alert("Image is too large even after compression. Try a smaller one.");
        return;
      }
      onChange(dataUrl);
    } catch {
      alert("Could not load that image.");
    }
  }

  return (
    <div>
      <label className="text-xs text-muted block mb-1">{label}</label>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={value} alt="" className="w-full h-32 object-cover" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="w-full h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted hover:text-text hover:border-accent transition-colors"
        >
          <ImagePlus size={20} />
          <span className="text-xs">Choose image</span>
        </button>
      )}
      {helper && <div className="text-[11px] text-muted mt-1">{helper}</div>}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
