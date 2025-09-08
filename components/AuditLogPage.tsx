import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { getAuditLogs, clearAuditLogs, AuditLogEntry } from '../services/logService';

const AuditLogPage: React.FC = () => {
  const { t, language } = useTranslations();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const handleClearLogs = () => {
    if (window.confirm(t('auditLog.confirmClear'))) {
      clearAuditLogs();
      setLogs([]);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(language, {
        dateStyle: 'long',
        timeStyle: 'medium',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-halal-green dark:text-accent-gold">{t('auditLog.title')}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{t('auditLog.subtitle')}</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {logs.length > 0 ? (
          <>
            <div className="text-right mb-4">
              <button
                onClick={handleClearLogs}
                className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-full hover:bg-red-200 transition-colors text-sm"
              >
                {t('auditLog.clearLogButton')}
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border dark:border-gray-700 overflow-hidden">
              <div className="hidden sm:grid grid-cols-3 gap-4 p-4 font-bold text-gray-600 dark:text-gray-300 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div>{t('auditLog.actionHeader')}</div>
                <div className="text-center">{t('auditLog.auditorHeader')}</div>
                <div className="text-right">{t('auditLog.timestampHeader')}</div>
              </div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map(log => (
                  <li key={log.id} className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <p className="font-medium text-gray-800 dark:text-gray-100"><span className="sm:hidden font-bold">{t('auditLog.actionHeader')}: </span>{log.action}</p>
                    <p className="text-gray-600 dark:text-gray-400 sm:text-center"><span className="sm:hidden font-bold">{t('auditLog.auditorHeader')}: </span>{log.auditorName}</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm sm:text-right"><span className="sm:hidden font-bold">{t('auditLog.timestampHeader')}: </span>{formatDate(log.timestamp)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center p-12 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-gray-100">{t('auditLog.emptyStateTitle')}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{t('auditLog.emptyStateSubtitle')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogPage;