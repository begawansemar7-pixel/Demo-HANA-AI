import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from '../hooks/useTranslations';

// Define the structure for a carousel slide
interface HeroSlide {
  id: string;
  type: 'announcement' | 'ad';
  titleKey: string;
  subtitleKey: string;
  ctaKey?: string;
  imageUrlSeed: string;
}

// Combine announcements and ads into a single, interleaved data structure
const heroSlides: HeroSlide[] = [
  { id: 'anno-1', type: 'announcement', titleKey: 'home.hero.announcements.1.title', subtitleKey: 'home.hero.announcements.1.subtitle', imageUrlSeed: 'banner1' },
  { id: 'ad-1', type: 'ad', titleKey: 'home.hero.ads.1.title', subtitleKey: 'home.hero.ads.1.brand', ctaKey: 'home.hero.ads.1.cta', imageUrlSeed: 'ad1' },
  { id: 'anno-2', type: 'announcement', titleKey: 'home.hero.announcements.2.title', subtitleKey: 'home.hero.announcements.2.subtitle', imageUrlSeed: 'banner2' },
  { id: 'ad-2', type: 'ad', titleKey: 'home.hero.ads.2.title', subtitleKey: 'home.hero.ads.2.brand', ctaKey: 'home.hero.ads.2.cta', imageUrlSeed: 'ad2' },
  { id: 'anno-3', type: 'announcement', titleKey: 'home.hero.announcements.3.title', subtitleKey: 'home.hero.announcements.3.subtitle', imageUrlSeed: 'banner3' },
  { id: 'ad-3', type: 'ad', titleKey: 'home.hero.ads.3.title', subtitleKey: 'home.hero.ads.3.brand', ctaKey: 'home.hero.ads.3.cta', imageUrlSeed: 'ad3' },
  { id: 'ad-4', type: 'ad', titleKey: 'home.hero.ads.4.title', subtitleKey: 'home.hero.ads.4.brand', ctaKey: 'home.hero.ads.4.cta', imageUrlSeed: 'ad4' },
];

const Hero: React.FC = () => {
  const { t } = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % heroSlides.length);
  }, []);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

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
    <section 
      className="container mx-auto px-4 py-8"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      aria-roledescription="carousel"
      aria-label="Announcements and Advertisements"
    >
      <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg group">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div 
                key={slide.id} 
                className="w-full h-full flex-shrink-0 relative"
                aria-hidden={index !== currentIndex}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${heroSlides.length}`}
            >
              <img 
                src={`https://picsum.photos/seed/${slide.imageUrlSeed}/1200/500`} 
                alt={t(slide.titleKey)} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-8 md:p-12 flex flex-col justify-center items-start text-left">
                <div className="max-w-md">
                  <p className={`text-sm font-semibold uppercase tracking-wider ${slide.type === 'ad' ? 'text-accent-gold' : 'text-white/80'}`}>
                    {slide.type === 'ad' ? t(slide.subtitleKey) : t('carousel.announcement')}
                  </p>
                  <h2 className="text-2xl md:text-4xl font-bold font-poppins text-white mt-2">
                    {t(slide.titleKey)}
                  </h2>
                  {slide.type === 'announcement' && (
                    <p className="mt-2 text-md md:text-lg text-white/90">{t(slide.subtitleKey)}</p>
                  )}
                  {slide.ctaKey && (
                     <button className="mt-6 bg-accent-gold text-halal-green font-bold py-3 px-6 rounded-full text-sm hover:opacity-90 transition-opacity">
                        {t(slide.ctaKey)}
                     </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={handlePrev} 
          className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center z-10"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button 
          onClick={handleNext} 
          className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center z-10"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10" role="tablist" aria-label="Slideshow controls">
          {heroSlides.map((_, index) => (
            <button 
              key={index} 
              onClick={() => goToSlide(index)} 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'}`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={currentIndex === index}
              role="tab"
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
