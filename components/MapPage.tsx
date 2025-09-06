import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface MapPageProps {
  query: string;
}

const MapPage: React.FC<MapPageProps> = ({ query }) => {
  const { t } = useTranslations();

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
      <div className="aspect-w-16 aspect-h-9 rounded-2xl shadow-xl overflow-hidden border">
        <style>{`
          .aspect-w-16 { position: relative; padding-bottom: 56.25%; }
          .aspect-h-9 { }
          .aspect-w-16 > iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        `}</style>
        <iframe
          title={t('mapPage.mapTitle', { query: searchQuery })}
          src={mapSrc}
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default MapPage;