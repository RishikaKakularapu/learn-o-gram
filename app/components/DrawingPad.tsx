"use client";

import { useRef, useState } from "react";
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { X, Undo2, Redo2, Eraser, Pencil, Trash2, Check } from "lucide-react";

const PALETTE = [
  "#111111", // near-black
  "#ffffff", // white (for dark bg drawings if you ever invert)
  "#a855f7", // accent violet
  "#ec4899", // pink
  "#22d3ee", // cyan
  "#f59e0b", // amber
  "#34d399", // emerald
  "#ef4444", // red
];

export function DrawingPad({
  onCancel,
  onDone,
}: {
  onCancel: () => void;
  onDone: (pngBlob: Blob) => void;
}) {
  const ref = useRef<ReactSketchCanvasRef>(null);
  const [color, setColor] = useState("#111111");
  const [width, setWidth] = useState(4);
  const [erasing, setErasing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!ref.current || saving) return;
    setSaving(true);
    try {
      const dataUrl = await ref.current.exportImage("png");
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      onDone(blob);
    } finally {
      setSaving(false);
    }
  }

  function pickPen() {
    setErasing(false);
    ref.current?.eraseMode(false);
  }
  function pickEraser() {
    setErasing(true);
    ref.current?.eraseMode(true);
  }

  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="p-2 rounded-full hover:bg-surface2"
        >
          <X size={20} />
        </button>
        <div className="text-sm font-semibold">Draw</div>
        <button
          onClick={save}
          disabled={saving}
          className="px-3 py-1.5 rounded-full gradient-accent font-semibold text-sm inline-flex items-center gap-1 disabled:opacity-50"
        >
          <Check size={14} /> {saving ? "Saving…" : "Done"}
        </button>
      </div>

      <div className="flex-1 bg-white touch-none">
        <ReactSketchCanvas
          ref={ref}
          style={{ border: "none", width: "100%", height: "100%" }}
          strokeWidth={width}
          strokeColor={color}
          eraserWidth={width * 4}
          canvasColor="#ffffff"
          withTimestamp={false}
        />
      </div>

      <div className="border-t border-border bg-surface2 px-3 py-2 space-y-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={pickPen}
            aria-label="Pen"
            className={`p-2 rounded ${!erasing ? "bg-accent text-white" : "text-muted hover:text-text"}`}
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={pickEraser}
            aria-label="Eraser"
            className={`p-2 rounded ${erasing ? "bg-accent text-white" : "text-muted hover:text-text"}`}
          >
            <Eraser size={18} />
          </button>
          <button
            type="button"
            onClick={() => ref.current?.undo()}
            aria-label="Undo"
            className="p-2 rounded text-muted hover:text-text"
          >
            <Undo2 size={18} />
          </button>
          <button
            type="button"
            onClick={() => ref.current?.redo()}
            aria-label="Redo"
            className="p-2 rounded text-muted hover:text-text"
          >
            <Redo2 size={18} />
          </button>
          <button
            type="button"
            onClick={() => ref.current?.clearCanvas()}
            aria-label="Clear"
            className="p-2 rounded text-muted hover:text-pink-400 ml-auto"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  pickPen();
                }}
                aria-label={`Color ${c}`}
                className={`w-7 h-7 rounded-full border-2 transition-transform active:scale-90 ${
                  color === c && !erasing
                    ? "border-white scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <input
            type="range"
            min={1}
            max={24}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="flex-1 ml-2 accent-accent"
            aria-label="Stroke width"
          />
          <div
            className="rounded-full bg-text"
            style={{ width: width, height: width }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
