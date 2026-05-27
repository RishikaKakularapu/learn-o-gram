"use client";

import { useRef, useState } from "react";
import { ImagePlus, Pencil, X, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { DrawingPad } from "./DrawingPad";

const MAX_DIM = 1280;
const BUCKET = "card-images";

function fileToCompressedBlob(file: File): Promise<Blob> {
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
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
          "image/jpeg",
          0.82
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function uploadBlob(
  blob: Blob,
  ext: "jpg" | "png"
): Promise<string | null> {
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: ext === "png" ? "image/png" : "image/jpeg",
      upsert: false,
    });
  if (error) {
    alert(`Upload failed: ${error.message}`);
    return null;
  }
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
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
  const [uploading, setUploading] = useState(false);
  const [drawing, setDrawing] = useState(false);

  async function handleFile(f: File | null) {
    if (!f) return;
    if (f.size > 10_000_000) {
      alert("Image is larger than 10MB. Pick something smaller.");
      return;
    }
    setUploading(true);
    try {
      const blob = await fileToCompressedBlob(f);
      const url = await uploadBlob(blob, "jpg");
      if (url) onChange(url);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(`Could not load that image: ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleDrawing(blob: Blob) {
    setDrawing(false);
    setUploading(true);
    try {
      const url = await uploadBlob(blob, "png");
      if (url) onChange(url);
    } finally {
      setUploading(false);
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
      ) : uploading ? (
        <div className="w-full h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-xs">Uploading…</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted hover:text-text hover:border-accent transition-colors"
          >
            <ImagePlus size={20} />
            <span className="text-xs">Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setDrawing(true)}
            className="h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted hover:text-text hover:border-accent transition-colors"
          >
            <Pencil size={20} />
            <span className="text-xs">Draw</span>
          </button>
        </div>
      )}
      {helper && <div className="text-[11px] text-muted mt-1">{helper}</div>}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {drawing && (
        <DrawingPad
          onCancel={() => setDrawing(false)}
          onDone={handleDrawing}
        />
      )}
    </div>
  );
}
