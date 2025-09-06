import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import PromotionDetailModal from './PromotionDetailModal';
import type { Promotion } from '../types';

const promotionIds = [1, 2, 3];

const Promotions: React.FC = () => {
  const { t } = useTranslations();
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenModal = (id: number) => {
    const videoUrlKey = `home.promotions.items.${id}.videoUrl`;
    const videoUrlValue = t(videoUrlKey);

    const promoDetails: Promotion = {
        id,
        title: t(`home.promotions.items.${id}.title`),
        description: t(`home.promotions.items.${id}.description`),
        details: t(`home.promotions.items.${id}.details`),
        terms: t(`home.promotions.items.${id}.terms`),
        expiry: t(`home.promotions.items.${id}.expiry`),
        cta: t(`home.promotions.items.${id}.cta`),
    };

    if (videoUrlValue && videoUrlValue.startsWith('http')) {
        promoDetails.videoUrl = videoUrlValue;
    }

    setSelectedPromo(promoDetails);
  };

  const handleCloseModal = () => {
    setSelectedPromo(null);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? promotionIds.length - 1 : prev - 1));
  };

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % promotionIds.length);
  }, []);
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
        handleNext();
    }, 5000);
  }, [handleNext]);

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay]);


  return (
    <>
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">{t('home.promotions.title')}</h2>
        <div 
            className="relative rounded-2xl shadow-lg overflow-hidden group"
            onMouseEnter={stopAutoPlay}
            onMouseLeave={startAutoPlay}
        >
          <div 
              className="flex transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {promotionIds.map(id => {
              const title = t(`home.promotions.items.${id}.title`);
              const description = t(`home.promotions.items.${id}.description`);
              const cta = t(`home.promotions.items.${id}.cta`);
              return (
                <div 
                    key={id} 
                    onClick={() => handleOpenModal(id)} 
                    className="w-full flex-shrink-0 cursor-pointer relative h-80 md:h-96"
                    role="button"
                    aria-label={`View details for promotion: ${title}`}
                >
                  <img 
                    src={`https://picsum.photos/seed/promo${id}/1200/600`} 
                    alt={title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-4xl font-bold text-white max-w-md leading-tight">{title}</h3>
                    <p className="text-md md:text-lg text-white/90 mt-4 max-w-md">{description}</p>
                    <div className="mt-6">
                      <div className="bg-accent-gold text-halal-green font-bold py-3 px-6 rounded-full text-sm hover:opacity-90 transition-opacity inline-block pointer-events-none">
                        {cta}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
           <button 
                onClick={handlePrev} 
                className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center z-10"
                aria-label="Previous promotion"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
                onClick={handleNext} 
                className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center z-10"
                aria-label="Next promotion"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {promotionIds.map((_, index) => (
              <button 
                key={index} 
                onClick={() => goToSlide(index)} 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'}`}
                aria-label={`Go to promotion ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>
      {selectedPromo && (
        <PromotionDetailModal
            promotion={selectedPromo}
            isOpen={!!selectedPromo}
            onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Promotions;
