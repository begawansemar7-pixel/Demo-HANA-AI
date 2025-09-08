import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';

// Re-using the Certificate interface, it has all we need
interface Certificate {
  id: string;
  product: string;
  producer: string;
  status: 'Certified' | 'Not Certified';
  expiry: string; // YYYY-MM-DD format or 'N/A'
}

// Re-using the same dummy data as the main certificate checker for consistency
const initialDummyData: Certificate[] = [
  { id: 'ID1234567890123', product: 'Instant Noodles', producer: 'Sedaap Food Inc.', status: 'Certified', expiry: '2025-10-22' },
  { id: 'ID9876543210987', product: 'Beauty Cream', producer: 'Wardah Beauty', status: 'Certified', expiry: '2026-01-15' },
  { id: 'ID1122334455667', product: 'Halal Beef Sausage', producer: 'So Good Foods', status: 'Certified', expiry: '2024-12-31' },
  { id: 'IDEXP1234567890', product: 'Expired Cheese', producer: 'Old Dairy Farm', status: 'Certified', expiry: '2022-01-01' },
  { id: 'ID7788990011223', product: 'Moisturizing Lipstick', producer: 'Wardah Beauty', status: 'Not Certified', expiry: 'N/A' },
  { id: 'ID2468013579246', product: 'Organic Green Tea', producer: 'SariWangi', status: 'Certified', expiry: '2025-08-10' },
  { id: 'ID1357924680135', product: 'UHT Full Cream Milk', producer: 'Cimory', status: 'Certified', expiry: '2025-02-20' },
];

type EffectiveStatusKey = 'certified' | 'expired' | 'notCertified' | 'invalidDate';

const getEffectiveStatusKey = (cert: Pick<Certificate, 'status' | 'expiry'>): EffectiveStatusKey => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(cert.expiry);

    if (cert.status === 'Certified') {
        if (isNaN(expiryDate.getTime())) return 'invalidDate';
        if (expiryDate < today) return 'expired';
        return 'certified';
    }
    return 'notCertified';
};

const StatusBadge: React.FC<{
  status: 'Certified' | 'Not Certified';
  expiry: string;
  t: (key: string) => string;
}> = ({ status, expiry, t }) => {
    const statusKey = getEffectiveStatusKey({ status, expiry });
    let badgeText = '';
    let badgeClasses = '';
    let icon = null;

    switch (statusKey) {
        case 'certified':
            badgeText = t('certCheck.statusCertified');
            badgeClasses = 'bg-green-100 text-green-800';
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            break;
        case 'expired':
            badgeText = t('certCheck.statusExpired');
            badgeClasses = 'bg-orange-100 text-orange-800';
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            break;
        case 'notCertified':
            badgeText = t('certCheck.statusNotCertified');
            badgeClasses = 'bg-red-100 text-red-800';
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            break;
        case 'invalidDate':
        default:
            badgeText = t('certCheck.statusInvalidDate');
            badgeClasses = 'bg-gray-100 text-gray-800';
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }

    return (
      <div className={`px-4 py-2 text-md font-bold rounded-full ${badgeClasses} inline-flex items-center justify-center`}>
        {icon}
        <span>{badgeText}</span>
      </div>
    );
};

interface HalalVerificationPageProps {
  onNavigate: (page: string) => void;
}

const HalalVerificationPage: React.FC<HalalVerificationPageProps> = ({ onNavigate }) => {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [noResultFound, setNoResultFound] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setResult(null);
    setNoResultFound(false);

    // Simulate API call
    setTimeout(() => {
      const lowercasedTerm = searchTerm.toLowerCase();
      const found = initialDummyData.find(cert => 
        cert.product.toLowerCase().includes(lowercasedTerm) || 
        cert.id.toLowerCase() === lowercasedTerm
      );

      if (found) {
        setResult(found);
      } else {
        setNoResultFound(true);
      }
      setLoading(false);
    }, 1000);
  };

  const renderResult = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-20">
            <div className="w-12 h-12 border-4 border-halal-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (result) {
      return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border animate-fadein">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{t('halalVerification.resultTitle')}</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
                <span className="font-semibold text-gray-500">{t('halalVerification.statusLabel')}</span>
                <StatusBadge status={result.status} expiry={result.expiry} t={t} />
            </div>
             <div>
                <p className="font-semibold text-gray-500">{t('certCheck.productLabel')}</p>
                <p className="text-lg text-gray-800 font-bold">{result.product}</p>
            </div>
             <div>
                <p className="font-semibold text-gray-500">{t('halalVerification.producerLabel')}</p>
                <p className="text-lg text-gray-800">{result.producer}</p>
            </div>
            {result.expiry !== 'N/A' && (
              <div>
                  <p className="font-semibold text-gray-500">{t('halalVerification.expiryLabel')}</p>
                  <p className="text-lg text-gray-800">{result.expiry}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    if (noResultFound) {
      return (
        <div className="text-center p-8 bg-gray-100/50 rounded-2xl animate-fadein">
          <p className="text-gray-600">{t('halalVerification.noResults')}</p>
        </div>
      );
    }

    return (
       <div className="text-center p-8 bg-gray-100/50 rounded-2xl">
          <p className="text-gray-600">{t('halalVerification.initialPrompt')}</p>
        </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-halal-green">{t('halalVerification.title')}</h1>
        <p className="text-lg text-gray-500 mt-2">{t('halalVerification.subtitle')}</p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                    <label htmlFor="product-verification-search" className="sr-only">{t('halalVerification.searchPlaceholder')}</label>
                    <input
                        id="product-verification-search"
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={t('halalVerification.searchPlaceholder')}
                        className="w-full py-3 pl-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green transition-shadow shadow-sm"
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    className="h-12 w-full sm:w-auto px-8 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center flex-shrink-0"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <span>{t('halalVerification.searchButton')}</span>
                    )}
                </button>
            </div>
        </form>

        <div className="text-center my-6">
            <button 
                onClick={() => onNavigate('scan-barcode')}
                className="px-6 py-3 bg-white text-halal-green font-semibold rounded-full hover:bg-gray-100 transition-colors border border-gray-300 shadow-sm flex items-center gap-2 mx-auto"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6.586 4.414l-1-1m-10-10l-1-1m17 0l-1 1M12 20v-1M4 12H2m14.586-4.414l1-1m-10 10l1-1M4 4l1 1m15 15l-1-1" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h6v6H9z" />
                </svg>
                <span>{t('halalVerification.scanButton')}</span>
            </button>
        </div>

        {renderResult()}
      </div>
    </div>
  );
};

export default HalalVerificationPage;
