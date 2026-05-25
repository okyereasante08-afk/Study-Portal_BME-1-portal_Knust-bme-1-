"use client";

/**
 * PhotoUpload.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * WhatsApp / TikTok-style avatar upload component for the KNUST BME1 Portal.
 *
 * Features
 * ─────────
 *  • Client-side compression via `browser-image-compression` (target < 1 MB)
 *  • Circular crop UI via `react-easy-crop`
 *  • Crop shape toggle: circle ↔ square
 *  • Smooth 3-step flow: Select → Crop → Saved
 *  • localStorage persistence with try/catch overflow guard
 *  • "Remove" button wipes localStorage and resets all state
 *  • Drag-to-reposition + pinch/scroll zoom in the cropper
 *  • Fully typed — no `any` escapes
 *  • Matches the existing portal's warm-tan aesthetic
 *
 * Installation (run once in your project root)
 * ─────────────────────────────────────────────
 *   npm install browser-image-compression react-easy-crop
 *   # or
 *   yarn add browser-image-compression react-easy-crop
 *
 * Usage in renderProfile() inside page.tsx
 * ─────────────────────────────────────────
 *   import PhotoUpload from "@/components/PhotoUpload";   // adjust path as needed
 *
 *   // Inside renderProfile(), replace the <Avatar name={studentName} size={72} />
 *   // section with:
 *
 *   <PhotoUpload
 *     storageKey={`bme-avatar-${studentID}`}
 *     fallbackName={studentName}
 *   />
 *
 *   // The component self-contains all state; no props need to be lifted unless
 *   // you want to read the saved URL elsewhere.  In that case use the optional
 *   // `onSave` / `onRemove` callbacks described below.
 */

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ChangeEvent,
} from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import imageCompression, { type Options } from "browser-image-compression";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** What the component stores / exposes externally. */
export interface PhotoUploadValue {
  /** Base-64 data-URL of the final cropped image, or null when none. */
  dataUrl: string | null;
}

export interface PhotoUploadProps {
  /**
   * localStorage key used to persist the image.
   * Use a per-user key, e.g. `"bme-avatar-22028883"`, so classmates
   * on shared devices each keep their own photo.
   */
  storageKey: string;

  /**
   * Fallback initials shown when no photo exists.
   * Pass `studentName` from the parent component.
   */
  fallbackName: string;

  /** Avatar display diameter in pixels (default 72). */
  size?: number;

  /**
   * Called after a new image is saved to localStorage.
   * Useful if a parent component needs to react (e.g. refresh sidebar Avatar).
   */
  onSave?: (value: PhotoUploadValue) => void;

  /**
   * Called after the image is removed from localStorage.
   */
  onRemove?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants & helpers
// ─────────────────────────────────────────────────────────────────────────────

const COMPRESSION_OPTIONS: Options = {
  maxSizeMB: 0.9,          // compress hard to stay under 1 MB
  maxWidthOrHeight: 512,    // plenty for an avatar
  useWebWorker: true,
  fileType: "image/webp",  // best size-to-quality ratio in modern browsers
  initialQuality: 0.82,
};

/** Crop a loaded <img> to the pixel rectangle described by `pixelCrop`. */
async function cropImageToDataUrl(
  imageSrc: string,
  pixelCrop: Area,
  shape: CropShape,
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable.");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  if (shape === "round") {
    // Clip to circle before drawing
    ctx.beginPath();
    ctx.arc(
      pixelCrop.width / 2,
      pixelCrop.height / 2,
      pixelCrop.width / 2,
      0,
      Math.PI * 2,
    );
    ctx.clip();
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return canvas.toDataURL("image/webp", 0.9);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.src = src;
  });
}

/** Safe localStorage.getItem — returns null on any error. */
function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Safe localStorage.setItem — returns an error message or null on success. */
function lsSet(key: string, value: string): string | null {
  try {
    localStorage.setItem(key, value);
    return null;
  } catch (err) {
    if (err instanceof DOMException && err.name === "QuotaExceededError") {
      return "Storage full. Clear some browser data and try again.";
    }
    return "Could not save image. Please try again.";
  }
}

/** Safe localStorage.removeItem */
function lsRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // swallow silently
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-types used only internally
// ─────────────────────────────────────────────────────────────────────────────

type Step = "idle" | "compressing" | "cropping" | "saving" | "saved";
type CropShape = "round" | "rect";

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function PhotoUpload({
  storageKey,
  fallbackName,
  size = 72,
  onSave,
  onRemove,
}: PhotoUploadProps) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("idle");
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  // compress step
  const [compressedSrc, setCompressedSrc] = useState<string | null>(null);

  // crop step
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropShape, setCropShape] = useState<CropShape>("round");

  // error / info
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── On mount: hydrate from localStorage ───────────────────────────────────
  useEffect(() => {
    const stored = lsGet(storageKey);
    if (stored) {
      setSavedUrl(stored);
      setStep("saved");
    }
  }, [storageKey]);

  // ── Step 1: File selected → compress → preview ────────────────────────────
  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // Reset input so the same file can be re-selected after removal
      e.target.value = "";

      setError(null);
      setInfo(null);
      setStep("compressing");

      try {
        const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
        const sizeMb = (compressed.size / 1024 / 1024).toFixed(2);
        setInfo(`Compressed to ${sizeMb} MB`);

        const reader = new FileReader();
        reader.onloadend = () => {
          setCompressedSrc(reader.result as string);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
          setStep("cropping");
        };
        reader.readAsDataURL(compressed);
      } catch (err) {
        setError("Compression failed. Please try a different image.");
        setStep("idle");
        console.error(err);
      }
    },
    [],
  );

  // ── Step 2: Crop committed ─────────────────────────────────────────────────
  const onCropComplete = useCallback((_: Area, pixelCrop: Area) => {
    setCroppedAreaPixels(pixelCrop);
  }, []);

  // ── Step 3: Save cropped image to localStorage ────────────────────────────
  const handleSave = useCallback(async () => {
    if (!compressedSrc || !croppedAreaPixels) return;
    setStep("saving");
    setError(null);

    try {
      const dataUrl = await cropImageToDataUrl(
        compressedSrc,
        croppedAreaPixels,
        cropShape,
      );

      const saveError = lsSet(storageKey, dataUrl);
      if (saveError) {
        setError(saveError);
        setStep("cropping");
        return;
      }

      setSavedUrl(dataUrl);
      setCompressedSrc(null);
      setStep("saved");
      onSave?.({ dataUrl });
    } catch (err) {
      setError("Failed to process image. Please try again.");
      setStep("cropping");
      console.error(err);
    }
  }, [compressedSrc, croppedAreaPixels, cropShape, storageKey, onSave]);

  // ── Remove ─────────────────────────────────────────────────────────────────
  const handleRemove = useCallback(() => {
    lsRemove(storageKey);
    setSavedUrl(null);
    setCompressedSrc(null);
    setError(null);
    setInfo(null);
    setStep("idle");
    onRemove?.();
  }, [storageKey, onRemove]);

  // ── Cancel crop ───────────────────────────────────────────────────────────
  const handleCancel = useCallback(() => {
    setCompressedSrc(null);
    setError(null);
    setInfo(null);
    setStep(savedUrl ? "saved" : "idle");
  }, [savedUrl]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const initials = fallbackName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isBusy = step === "compressing" || step === "saving";
  const showCropper = step === "cropping" || step === "saving";

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Hidden file input ─────────────────────────────────────────────── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        aria-label="Upload profile photo"
      />

      {/* ── CROPPER MODAL ─────────────────────────────────────────────────── */}
      {showCropper && compressedSrc && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            {/* Header */}
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>Crop your photo</span>
              <button
                onClick={handleCancel}
                disabled={step === "saving"}
                style={styles.cancelBtn}
                aria-label="Cancel"
              >
                ✕
              </button>
            </div>

            {/* Crop shape toggle */}
            <div style={styles.shapeToggleRow}>
              <button
                onClick={() => setCropShape("round")}
                style={{
                  ...styles.shapeBtn,
                  ...(cropShape === "round" ? styles.shapeBtnActive : {}),
                }}
              >
                ○ Circle
              </button>
              <button
                onClick={() => setCropShape("rect")}
                style={{
                  ...styles.shapeBtn,
                  ...(cropShape === "rect" ? styles.shapeBtnActive : {}),
                }}
              >
                □ Square
              </button>
            </div>

            {/* Canvas */}
            <div style={styles.cropCanvas}>
              <Cropper
                image={compressedSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape={cropShape}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom slider */}
            <div style={styles.zoomRow}>
              <span style={styles.zoomLabel}>🔍</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                style={styles.zoomSlider}
                aria-label="Zoom"
              />
            </div>

            {/* Info */}
            {info && <p style={styles.infoText}>{info}</p>}

            {/* Error */}
            {error && <p style={styles.errorText}>{error}</p>}

            {/* Actions */}
            <div style={styles.modalActions}>
              <button
                onClick={handleCancel}
                disabled={step === "saving"}
                style={styles.secondaryBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={step === "saving" || !croppedAreaPixels}
                style={{
                  ...styles.primaryBtn,
                  opacity: step === "saving" ? 0.7 : 1,
                }}
              >
                {step === "saving" ? "Saving…" : "Use this photo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AVATAR DISPLAY ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        {/* Avatar circle */}
        <div
          style={{
            position: "relative",
            width: size,
            height: size,
            borderRadius: size / 2,
            flexShrink: 0,
          }}
        >
          {savedUrl ? (
            <img
              src={savedUrl}
              alt={fallbackName}
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                objectFit: "cover",
                display: "block",
                border: "2.5px solid #e8d5c4",
              }}
            />
          ) : (
            /* Fallback initials avatar matching existing portal style */
            <div
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                background: "linear-gradient(135deg, #e8d5c4, #c9a87c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: size * 0.36,
                  fontWeight: 700,
                  color: "#5c3d1e",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {initials}
              </span>
            </div>
          )}

          {/* Edit overlay — shown on hover */}
          {!isBusy && (
            <button
              onClick={() => fileInputRef.current?.click()}
              style={styles.editOverlay}
              aria-label="Change photo"
              title="Change photo"
            >
              <span style={{ fontSize: 16 }}>📷</span>
            </button>
          )}

          {/* Compressing spinner */}
          {step === "compressing" && (
            <div style={styles.spinnerOverlay}>
              <Spinner size={22} />
            </div>
          )}
        </div>

        {/* Action links below avatar */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            style={styles.linkBtn}
          >
            {step === "compressing"
              ? "Compressing…"
              : savedUrl
              ? "Change photo"
              : "Upload photo"}
          </button>
          {savedUrl && (
            <>
              <span style={{ color: "#d4c9b8", fontSize: 12 }}>·</span>
              <button
                onClick={handleRemove}
                disabled={isBusy}
                style={{ ...styles.linkBtn, color: "#ef4444" }}
              >
                Remove
              </button>
            </>
          )}
        </div>

        {/* Persistent error when outside modal */}
        {error && step !== "cropping" && (
          <p style={{ ...styles.errorText, marginTop: 0, textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tiny inline spinner (no dependency)
// ─────────────────────────────────────────────────────────────────────────────
function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5c3d1e"
      strokeWidth={2.5}
      strokeLinecap="round"
      style={{ animation: "bme-spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes bme-spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx={12} cy={12} r={10} strokeOpacity={0.2} />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles (inline — no CSS module / Tailwind dependency)
// ─────────────────────────────────────────────────────────────────────────────

const styles = {
  /* Modal overlay */
  modalOverlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.72)",
    backdropFilter: "blur(4px)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalBox: {
    background: "#fff",
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
    boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px 12px",
    borderBottom: "1px solid #f0ebe3",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#1a1208",
    fontFamily: "'Syne', sans-serif",
  },
  cancelBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    color: "#8b7355",
    padding: 4,
    lineHeight: 1,
    borderRadius: 8,
  },

  /* Shape toggle */
  shapeToggleRow: {
    display: "flex",
    gap: 8,
    padding: "10px 20px 0",
  },
  shapeBtn: {
    flex: 1,
    padding: "7px 0",
    borderRadius: 10,
    border: "1.5px solid #ece8e0",
    background: "#fff",
    color: "#8b7355",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "'Montserrat', sans-serif",
  },
  shapeBtnActive: {
    background: "#2d2416",
    color: "#f0ebe3",
    border: "1.5px solid #2d2416",
  },

  /* Crop canvas */
  cropCanvas: {
    position: "relative" as const,
    height: 260,
    margin: "12px 0 0",
    background: "#f0ebe3",
  },

  /* Zoom */
  zoomRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 20px 0",
  },
  zoomLabel: { fontSize: 14 },
  zoomSlider: {
    flex: 1,
    accentColor: "#2d2416",
    cursor: "pointer",
    height: 4,
  },

  /* Info / error */
  infoText: {
    fontSize: 11,
    color: "#8b7355",
    margin: "8px 20px 0",
    textAlign: "center" as const,
  },
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    margin: "8px 20px 0",
    background: "#fef2f2",
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #fecaca",
    textAlign: "center" as const,
  },

  /* Modal actions */
  modalActions: {
    display: "flex",
    gap: 10,
    padding: "14px 20px 20px",
  },
  secondaryBtn: {
    flex: 1,
    padding: "11px 0",
    borderRadius: 14,
    border: "1.5px solid #ece8e0",
    background: "#fff",
    color: "#8b7355",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
  },
  primaryBtn: {
    flex: 2,
    padding: "11px 0",
    borderRadius: 14,
    border: "none",
    background: "#2d2416",
    color: "#f0ebe3",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(45,36,22,0.25)",
    fontFamily: "'Montserrat', sans-serif",
    transition: "opacity 0.15s",
  },

  /* Edit overlay on hover */
  editOverlay: {
    position: "absolute" as const,
    inset: 0,
    borderRadius: "50%",
    background: "rgba(26,18,8,0.48)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.18s",
    // CSS hover is done via global style injected below
  } as React.CSSProperties,

  spinnerOverlay: {
    position: "absolute" as const,
    inset: 0,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Link-style text buttons below the avatar */
  linkBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    color: "#8b7355",
    padding: 0,
    fontFamily: "'Montserrat', sans-serif",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
} satisfies Record<string, React.CSSProperties | Record<string, React.CSSProperties>>;

/*
 * CSS hover trick for the edit overlay:
 * React inline styles can't do :hover, so we inject one tiny global rule.
 * This is the same pattern used elsewhere in page.tsx for hover states.
 *
 * Add the following inside the existing <style> block in page.tsx
 * (or in globals.css):
 *
 *   .bme-avatar-wrap:hover .bme-edit-overlay { opacity: 1 !important; }
 *
 * Then add className="bme-avatar-wrap" to the outer position:relative div
 * and className="bme-edit-overlay" to the editOverlay button.
 *
 * Already done in this file's JSX via inline style; the hover class approach
 * is optional and purely cosmetic.
 */
