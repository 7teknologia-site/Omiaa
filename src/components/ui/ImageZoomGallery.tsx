import React, { useState, useRef } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ProductBadge } from './ProductBadge';

interface ImageZoomGalleryProps {
  images: string[];
  productName: string;
  badges?: string[];
  discountPercent?: number;
  stock: number;
}

export const ImageZoomGallery: React.FC<ImageZoomGalleryProps> = ({
  images,
  productName,
  badges = [],
  discountPercent,
  stock
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIdx] || images[0] || '';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setMousePos({ x, y });
  };

  const handlePrevImage = () => {
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Main Image Viewport with Hover Zoom */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
        className="relative aspect-square bg-[#FAF7F2] rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs cursor-zoom-in group transition-all"
      >
        {/* Badges Container */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 max-w-[80%] pointer-events-none">
          {stock <= 0 ? (
            <ProductBadge badge="Esgotado" size="md" />
          ) : (
            <>
              {stock <= 3 && <ProductBadge badge={`Poucas Unidades (${stock})`} size="md" />}
              {badges.map((b, idx) => (
                <ProductBadge key={idx} badge={b} discountPercent={discountPercent} size="md" />
              ))}
            </>
          )}
        </div>

        {/* Hover Zoom Instruction Chip */}
        <div className="absolute bottom-4 right-4 z-20 bg-[#14281D]/80 backdrop-blur-md text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          <ZoomIn className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Passe o mouse para zoom</span>
        </div>

        {/* Normal Base Image */}
        <img
          src={activeImage}
          alt={productName}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isZooming ? 'opacity-0 sm:opacity-100' : 'opacity-100'
          }`}
        />

        {/* Magnified High-Res Layer on Mouse Move */}
        {isZooming && (
          <div
            className="absolute inset-0 z-10 pointer-events-none hidden sm:block"
            style={{
              backgroundImage: `url(${activeImage})`,
              backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
              backgroundSize: '250%',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
      </div>

      {/* Gallery Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 transition-all ${
                activeIdx === idx
                  ? 'border-[#14281D] ring-2 ring-[#C5A059] shadow-sm scale-105'
                  : 'border-[#E2D9C8] opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${productName} - vista ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all z-50"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-6 p-3 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center p-2 relative">
            <img
              src={activeImage}
              alt={productName}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white/80 font-serif text-sm mt-4 text-center">
              {productName} • Imagem {activeIdx + 1} de {images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
