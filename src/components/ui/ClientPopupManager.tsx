import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Copy, Check, ArrowRight, Mail, Gift, Tag, Percent, Truck, Bell, HeartHandshake } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Popup, PopupType } from '../../types/popup';
import {
  getSavedPopups,
  saveLead,
  isPopupDismissedForVisitor,
  markPopupDismissedForVisitor,
  recordPopupImpression,
  recordPopupClick
} from '../../utils/popupStorage';

export const ClientPopupManager: React.FC = () => {
  const { viewMode, setViewMode, setSelectedProductId, products, showToast, user } = useShop();
  const [activePopup, setActivePopup] = useState<Popup | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // Newsletter Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Tracking page views in session
  useEffect(() => {
    try {
      const views = parseInt(sessionStorage.getItem('omiaa_page_views') || '0', 10) + 1;
      sessionStorage.setItem('omiaa_page_views', views.toString());
    } catch (e) {
      // Ignore
    }
  }, [viewMode]);

  // Main Popup Selection Engine
  useEffect(() => {
    if (isOpen || activePopup) return; // Don't interrupt active modal

    const popups = getSavedPopups();
    const now = new Date();

    // Filter candidate popups
    const validPopups = popups.filter((p) => {
      if (!p.active) return false;

      // Date check
      if (p.startDate && new Date(p.startDate) > now) return false;
      if (p.endDate && new Date(p.endDate) < now) return false;

      // Time of day check (optional HH:mm)
      if (p.startTime || p.endTime) {
        const currentHours = now.getHours() * 60 + now.getMinutes();
        if (p.startTime) {
          const [sh, sm] = p.startTime.split(':').map(Number);
          if (currentHours < sh * 60 + sm) return false;
        }
        if (p.endTime) {
          const [eh, em] = p.endTime.split(':').map(Number);
          if (currentHours > eh * 60 + em) return false;
        }
      }

      // Page Target check
      if (p.pageTarget !== 'all') {
        if (p.pageTarget === 'home' && viewMode !== 'catalog') return false;
        if (p.pageTarget === 'products' && viewMode !== 'product-detail') return false;
        if (p.pageTarget === 'blog' && viewMode !== 'blog') return false;
        if (p.pageTarget === 'botanical' && viewMode !== 'botanical') return false;
        if (p.pageTarget === 'checkout' && viewMode !== 'checkout') return false;
        if (p.pageTarget === 'cart' && viewMode !== 'checkout') return false;
      }

      // Target Audience check
      const isLoggedIn = !!user?.email;
      if (p.targetAudience === 'visitors_only' && isLoggedIn) return false;
      if (p.targetAudience === 'logged_in' && !isLoggedIn) return false;

      // Visitor Dismissed frequency check
      if (isPopupDismissedForVisitor(p)) return false;

      return true;
    });

    if (validPopups.length === 0) return;

    // Sort by priority (lowest number = highest priority)
    validPopups.sort((a, b) => (a.priority || 5) - (b.priority || 5));

    const candidate = validPopups[0];

    // Setup Trigger listeners
    let triggerTimer: NodeJS.Timeout | null = null;

    const triggerPopupDisplay = () => {
      setActivePopup(candidate);
      setIsOpen(true);
      recordPopupImpression(candidate.id);
    };

    if (candidate.triggerType === 'on_load') {
      triggerTimer = setTimeout(triggerPopupDisplay, 1200);
    } else if (candidate.triggerType === 'delay_seconds') {
      const delayMs = (candidate.triggerValue || 3) * 1000;
      triggerTimer = setTimeout(triggerPopupDisplay, delayMs);
    } else if (candidate.triggerType === 'scroll_percent') {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        const targetPercent = candidate.triggerValue || 30;

        if (scrollPercent >= targetPercent) {
          window.removeEventListener('scroll', handleScroll);
          triggerPopupDisplay();
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } else if (candidate.triggerType === 'exit_intent') {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 10) {
          document.removeEventListener('mouseleave', handleMouseLeave);
          triggerPopupDisplay();
        }
      };
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    } else if (candidate.triggerType === 'page_views') {
      const pageViews = parseInt(sessionStorage.getItem('omiaa_page_views') || '1', 10);
      if (pageViews >= (candidate.triggerValue || 2)) {
        triggerTimer = setTimeout(triggerPopupDisplay, 800);
      }
    }

    return () => {
      if (triggerTimer) clearTimeout(triggerTimer);
    };
  }, [viewMode, isOpen, activePopup, user]);

  const handleClose = () => {
    if (activePopup) {
      markPopupDismissedForVisitor(activePopup.id);
    }
    setIsOpen(false);
    setTimeout(() => {
      setActivePopup(null);
      setIsSuccess(false);
      setName('');
      setEmail('');
    }, 300);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePopup) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const result = saveLead({
        name,
        email,
        popupId: activePopup.id,
        popupName: activePopup.name
      });

      setIsSubmitting(false);
      if (result.success) {
        setIsSuccess(true);
        showToast('Sucesso!', result.message, 'success');
      } else {
        showToast('Atenção', result.message, 'alert');
      }
    }, 400);
  };

  const handleCopyCoupon = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    showToast('Cupom Copiado!', `Código ${code} copiado para a área de transferência.`, 'success');
    if (activePopup) {
      recordPopupClick(activePopup.id);
    }
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  const handleButtonClick = () => {
    if (!activePopup) return;
    recordPopupClick(activePopup.id);

    if (activePopup.content.buttonLink === 'products') {
      setViewMode('catalog');
      handleClose();
    } else if (activePopup.content.buttonLink === 'blog') {
      setViewMode('blog');
      handleClose();
    } else if (activePopup.content.buttonLink === 'botanical') {
      setViewMode('botanical');
      handleClose();
    } else if (activePopup.content.featuredProductId) {
      setSelectedProductId(activePopup.content.featuredProductId);
      setViewMode('product-detail');
      handleClose();
    } else {
      handleClose();
    }
  };

  if (!isOpen || !activePopup) return null;

  const content = activePopup.content;
  const isNewsletter = activePopup.type === 'newsletter';
  const hasCoupon = activePopup.couponConfig && activePopup.couponConfig.code;
  const featuredProduct = activePopup.content.featuredProductId
    ? products.find((p) => p.id === activePopup.content.featuredProductId)
    : null;

  const getBadgeIcon = (type: PopupType) => {
    switch (type) {
      case 'newsletter': return <Mail className="w-4 h-4 text-[#C5A059]" />;
      case 'coupon': return <Tag className="w-4 h-4 text-[#C5A059]" />;
      case 'free_shipping': return <Truck className="w-4 h-4 text-[#C5A059]" />;
      case 'launch': return <Sparkles className="w-4 h-4 text-[#C5A059]" />;
      case 'promotion': return <Percent className="w-4 h-4 text-[#C5A059]" />;
      case 'featured_product': return <Gift className="w-4 h-4 text-[#C5A059]" />;
      case 'notice': return <Bell className="w-4 h-4 text-[#C5A059]" />;
      default: return <HeartHandshake className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#FCFAF7] rounded-3xl border border-[#E2D9C8] shadow-2xl overflow-hidden font-sans flex flex-col md:flex-row transform transition-all duration-500 animate-scaleUp"
        style={{
          backgroundColor: content.bgColor || '#FCFAF7',
          color: content.textColor || '#14281D'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Fechar pop-up"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#14281D] flex items-center justify-center border border-[#E2D9C8] shadow-md transition-all hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Optional Media Column */}
        {content.imageUrl && (
          <div className="md:w-5/12 relative h-48 md:h-auto overflow-hidden bg-[#14281D] shrink-0">
            <img
              src={content.imageUrl}
              alt={content.title}
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
          </div>
        )}

        {/* Content Column */}
        <div className={`p-6 md:p-8 flex-1 flex flex-col justify-between ${!content.imageUrl ? 'w-full' : ''}`}>
          
          <div>
            {/* Top Subtitle Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#14281D]/5 flex items-center justify-center border border-[#C5A059]/30">
                {getBadgeIcon(activePopup.type)}
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#C5A059]">
                {content.subtitle || 'OMIAÁ ALQUIMIA ANCESTRAL'}
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="font-serif font-bold text-2xl md:text-3xl text-[#14281D] leading-snug tracking-wide mb-3">
              {content.title}
            </h3>

            <p className="text-sm text-[#5A6B5D] font-light leading-relaxed mb-6">
              {content.description}
            </p>

            {/* Featured Product Snapshot if type === featured_product */}
            {featuredProduct && (
              <div className="mb-6 p-3 bg-white rounded-2xl border border-[#E2D9C8] flex items-center gap-3 shadow-2xs">
                <img src={featuredProduct.images[0]} alt={featuredProduct.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#14281D] truncate">{featuredProduct.name}</h4>
                  <p className="text-xs text-[#C5A059] font-bold">R$ {featuredProduct.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
            )}

            {/* Coupon Box if present */}
            {hasCoupon && !isSuccess && (
              <div className="mb-6 p-3.5 bg-[#14281D] text-[#FAF7F2] rounded-2xl border border-[#C5A059]/40 flex items-center justify-between gap-3 shadow-inner">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-semibold block">
                    CUPOM PROMOCIONAL
                  </span>
                  <span className="font-mono font-bold text-lg text-[#C5A059] tracking-wider">
                    {activePopup.couponConfig?.code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCoupon(activePopup.couponConfig!.code)}
                  className="px-3.5 py-2 rounded-xl bg-[#C5A059] text-[#14281D] font-bold text-xs hover:bg-[#d4b068] transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  {copiedCoupon ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCoupon ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Interactive Form or Action Button */}
          {isNewsletter ? (
            <div>
              {isSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-center animate-fadeIn">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2 animate-bounce" />
                  <h4 className="font-bold text-sm">Inscrição Confirmada!</h4>
                  <p className="text-xs text-emerald-700 mt-1 font-light">
                    Sua jornada de sabedoria herbal começou. {hasCoupon ? `Use o cupom ${activePopup.couponConfig?.code} no seu carrinho.` : ''}
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-4 px-5 py-2 rounded-xl bg-[#14281D] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider hover:bg-[#2C4837]"
                  >
                    Aproveitar Agora
                  </button>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9C8] text-xs font-sans text-[#14281D] focus:outline-none focus:border-[#C5A059] transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Seu melhor e-mail botânico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2D9C8] text-xs font-sans text-[#14281D] focus:outline-none focus:border-[#C5A059] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-5 rounded-xl bg-[#C5A059] hover:bg-[#d4b068] text-[#14281D] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-[#14281D] border-t-transparent" />
                    ) : (
                      <>
                        <span>{content.buttonText || 'Cadastrar Newsletter'}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={handleButtonClick}
                className="w-full py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group"
                style={{
                  backgroundColor: content.buttonColor || '#C5A059',
                  color: content.buttonTextColor || '#14281D'
                }}
              >
                <span>{content.buttonText || 'Aproveitar Oferta'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}

          <p className="text-[10px] text-[#8C7A5B] font-light text-center mt-3">
            Omiaá Alquimia • Respeitamos sua privacidade e livre arbítrio.
          </p>

        </div>
      </div>
    </div>
  );
};
