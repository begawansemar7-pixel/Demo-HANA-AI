import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { getAuditLogs, clearAuditLogs, AuditLogEntry } from '../services/logService';

const AuditLogPage: React.FC = () => {
  const { t, language } = useTranslations();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const handleToggleExpand = (logId: string) => {
    setExpandedLogId(prevId => (prevId === logId ? null : logId));
  };

  const handleClearLogs = () => {
    if (window.confirm(t('auditLog.confirmClear'))) {
      clearAuditLogs();
      setLogs([]);
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;

    const headers = [
        t('auditLog.actionHeader'),
        t('auditLog.auditorHeader'),
        t('auditLog.lphHeader'),
        t('auditLog.contactHeader'),
        t('auditLog.timestampHeader'),
        'Entity Type',
        'Entity ID',
        'Details'
    ];
    
    const escapeCSV = (field: any) => {
        if (field === null || field === undefined) return '""';
        const str = String(field);
        return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = logs.map(log => 
      [
        escapeCSV(log.action),
        escapeCSV(log.auditorName),
        escapeCSV(log.auditorDetails?.lph),
        escapeCSV(log.auditorDetails?.contact),
        escapeCSV(formatDate(log.timestamp)),
        escapeCSV(log.entityType),
        escapeCSV(log.entityId),
        escapeCSV(log.details ? JSON.stringify(log.details) : ''),
      ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_log_${today}.csv`);
    document.body.appendChild(link);
    
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            <div className="text-right mb-4 flex justify-end gap-4">
               <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t('auditLog.exportButton')}
              </button>
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
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map(log => {
                  const isExpanded = expandedLogId === log.id;
                  const hasDetails = log.entityType || log.entityId || log.auditorDetails || (log.details && Object.keys(log.details).length > 0);

                  return (
                    <div key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                      <div
                        className={`w-full p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left items-center ${hasDetails ? 'cursor-pointer' : ''}`}
                        onClick={() => hasDetails && handleToggleExpand(log.id)}
                        role={hasDetails ? 'button' : undefined}
                        aria-expanded={isExpanded}
                        aria-controls={`details-${log.id}`}
                      >
                        <p className="font-medium text-gray-800 dark:text-gray-100"><span className="sm:hidden font-bold">{t('auditLog.actionHeader')}: </span>{log.action}</p>
                        <p className="text-gray-600 dark:text-gray-400 sm:text-center"><span className="sm:hidden font-bold">{t('auditLog.auditorHeader')}: </span>{log.auditorName}</p>
                        <div className="flex items-center sm:justify-end">
                            <p className="text-gray-500 dark:text-gray-500 text-sm sm:text-right flex-grow">{formatDate(log.timestamp)}</p>
                            {hasDetails && (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-4 text-gray-500 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            )}
                        </div>
                      </div>
                      {isExpanded && hasDetails && (
                        <div id={`details-${log.id}`} className="px-6 pb-4 animate-fadein">
                          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600 space-y-2 text-sm">
                            <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2">Additional Details</h4>
                            {log.auditorDetails && (
                              <>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-2">
                                  <strong className="text-gray-600 dark:text-gray-300 col-span-1">{t('auditLog.lphHeader')}:</strong>
                                  <span className="text-gray-800 dark:text-gray-100 col-span-2">{log.auditorDetails.lph}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-2">
                                  <strong className="text-gray-600 dark:text-gray-300 col-span-1">{t('auditLog.contactHeader')}:</strong>
                                  <span className="text-gray-800 dark:text-gray-100 col-span-2">{log.auditorDetails.contact}</span>
                                </div>
                              </>
                            )}
                            {log.entityType && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-2 pt-2 mt-2 border-t dark:border-gray-600">
                                <strong className="text-gray-600 dark:text-gray-300 col-span-1">Entity Type:</strong>
                                <span className="text-gray-800 dark:text-gray-100 col-span-2">{log.entityType}</span>
                              </div>
                            )}
                            {log.entityId && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-2">
                                <strong className="text-gray-600 dark:text-gray-300 col-span-1">Affected Entity:</strong>
                                <span className="text-gray-800 dark:text-gray-100 col-span-2">{log.entityId}</span>
                              </div>
                            )}
                            {log.details && Object.keys(log.details).length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-2 pt-2 mt-2 border-t dark:border-gray-600">
                                    <strong className="text-gray-600 dark:text-gray-300 col-span-1">Change Details:</strong>
                                    <div className="col-span-2 space-y-2">
                                    {Object.entries(log.details).map(([key, value]) => {
                                        const isChangeObject = typeof value === 'object' && value !== null && 'newValue' in value && 'oldValue' in value;

                                        return (
                                            <div key={key} className="flex items-start sm:items-center gap-2">
                                                <span className="font-semibold capitalize flex-shrink-0">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                                {isChangeObject && (value as any).oldValue !== (value as any).newValue ? (
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <del className="text-red-600 dark:text-red-300 bg-red-100/60 dark:bg-red-900/40 px-2 py-0.5 rounded-md decoration-2">
                                                            {String((value as any).oldValue)}
                                                        </del>
                                                        <span className="text-gray-500 dark:text-gray-400 font-bold">&rarr;</span>
                                                        <strong className="text-green-700 dark:text-green-300 bg-green-100/60 dark:bg-green-900/40 px-2 py-0.5 rounded-md">
                                                            {String((value as any).newValue)}
                                                        </strong>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-800 dark:text-gray-100">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                    </div>
                                </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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