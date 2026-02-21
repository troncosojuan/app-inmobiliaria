"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import type { PropertyImage } from "@app-inmobiliaria/db";

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 4));
      if (e.key === "-") {
        setZoom((z) => {
          const nz = Math.max(z - 0.5, 1);
          if (nz === 1) setPan({ x: 0, y: 0 });
          return nz;
        });
      }
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox, prev, next]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-muted">
        <Maximize2 className="h-16 w-16 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div
          role="button"
          tabIndex={0}
          className="group relative aspect-[16/9] cursor-pointer overflow-hidden rounded-2xl bg-muted focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
          onClick={() => setLightboxOpen(true)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLightboxOpen(true); } }}
        >
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt || title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority={currentIndex === 0}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Maximize2 className="h-6 w-6" />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 shadow-lg backdrop-blur transition-all hover:bg-card"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 shadow-lg backdrop-blur transition-all hover:bg-card"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs text-white backdrop-blur">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setCurrentIndex(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all ${
                  i === currentIndex
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-60 hover:opacity-100"
                }`}
                aria-label={`Ver foto ${i + 1}`}
              >
                <Image src={img.url} alt={img.alt || `Foto ${i + 1}`} fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
            <button
              onClick={() => {
                setZoom((z) => Math.min(z + 0.5, 4));
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setZoom((z) => {
                  const nz = Math.max(z - 0.5, 1);
                  if (nz === 1) setPan({ x: 0, y: 0 });
                  return nz;
                });
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="mx-1 text-xs text-white/60">{Math.round(zoom * 100)}%</span>
            <button
              onClick={closeLightbox}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
            {currentIndex + 1} / {images.length}
            {zoom > 1 && <span className="ml-2 text-white/60">Arrastrá para mover</span>}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="flex h-full w-full items-center justify-center overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
          >
            <div
              className="relative max-h-[85vh] max-w-[90vw] transition-transform duration-150"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              }}
            >
              <Image
                src={images[currentIndex].url}
                alt={images[currentIndex].alt || title}
                width={1400}
                height={900}
                className="h-auto max-h-[85vh] w-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
