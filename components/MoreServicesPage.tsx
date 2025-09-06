import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { SERVICES } from '../constants';

interface MoreServicesPageProps {
  onNavigate: (page: string) => void;
}

const MoreServicesPage: React.FC<MoreServicesPageProps> = ({ onNavigate }) => {
  const { t } = useTranslations();
  
  // A mock list of services, can be expanded in a real app
  const moreServices = SERVICES.slice(0, 8); 

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-halal-green">{t('moreServices.title')}</h1>
        <p className="text-lg text-gray-500 mt-2">{t('moreServices.subtitle')}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {moreServices.map(service => (
          <a
            key={service.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(service.id);
            }}
            className="flex flex-col items-center justify-center text-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square"
          >
            <div className="text-halal-green">
              {service.icon}
            </div>
            <span className="mt-2 text-sm font-semibold text-gray-700">{t(service.title)}</span>
          </a>
        ))}
         {/* Placeholder for upcoming services */}
        <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-100/50 rounded-2xl aspect-square border-2 border-dashed border-gray-300">
             <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
             </div>
             <span className="mt-2 text-sm font-semibold text-gray-500">{t('moreServices.comingSoon')}</span>
        </div>
      </div>
    </div>
  );
};

export default MoreServicesPage;