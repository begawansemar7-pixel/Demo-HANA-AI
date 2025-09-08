import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const MonitoringDashboardPage: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-halal-green dark:text-accent-gold">{t('monitoringDashboard.title')}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{t('monitoringDashboard.subtitle')}</p>
      </div>
      
      <div className="max-w-2xl mx-auto text-center p-8 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m6 0v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{t('monitoringDashboard.placeholder')}</p>
      </div>
    </div>
  );
};

export default MonitoringDashboardPage;