import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const SupplierVerificationPage: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-halal-green">{t('supplierVerification.title')}</h1>
        <p className="text-lg text-gray-500 mt-2">{t('supplierVerification.subtitle')}</p>
      </div>
      
      <div className="max-w-2xl mx-auto text-center p-8 bg-gray-100/50 rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="mt-4 text-gray-600">{t('supplierVerification.placeholder')}</p>
      </div>
    </div>
  );
};

export default SupplierVerificationPage;
