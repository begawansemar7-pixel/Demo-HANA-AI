import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface MapPageProps {
  query: string;
}

const MapPage: React.FC<MapPageProps> = ({ query }) => {
  const { t } = useTranslations();
  const [isMapLoading, setIsMapLoading] = useState(true);

  // Reset loading state if the query changes
  useEffect(() => {
    setIsMapLoading(true);
  }, [query]);

  // Ensure the query is a string before encoding
  const searchQuery = query || '';
  // Using a keyless Google Maps embed URL
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`;

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-halal-green">{t('mapPage.title')}</h1>
        <p className="text-lg text-gray-500 mt-2">{t('mapPage.subtitle', { query: searchQuery })}</p>
      </div>
      <div className="aspect-w-16 aspect-h-9 rounded-2xl shadow-xl overflow-hidden border bg-gray-200">
        <style>{`
          .aspect-w-16 { position: relative; padding-bottom: 56.25%; }
          .aspect-h-9 { }
          .aspect-w-16 > iframe, .aspect-w-16 > .map-loader { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        `}</style>
        
        {/* Skeleton Loader */}
        {isMapLoading && (
          <div className="map-loader bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 13v-6.5m6 3.5V7" />
              </svg>
              <p className="mt-2 text-gray-500 font-semibold">{t('mapPage.loading')}</p>
            </div>
          </div>
        )}

        <iframe
          title={t('mapPage.mapTitle', { query: searchQuery })}
          src={mapSrc}
          style={{ border: 0 }}
          onLoad={() => setIsMapLoading(false)}
          className={`transition-opacity duration-500 ${isMapLoading ? 'opacity-0' : 'opacity-100'}`}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default MapPage;