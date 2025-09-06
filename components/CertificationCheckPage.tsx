import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import Pagination from './Pagination';
import InputField from './InputField';
import { useSearch } from '../contexts/SearchContext';
import { useDebounce } from '../hooks/useDebounce';

interface Certificate {
  id: string;
  product: string;
  producer: string;
  status: 'Certified' | 'Not Certified';
  expiry: string; // YYYY-MM-DD format or 'N/A'
}

// Dummy data for search results
const initialDummyData: Certificate[] = [
  { id: 'ID1234567890123', product: 'Instant Noodles', producer: 'Sedaap Food Inc.', status: 'Certified', expiry: '2025-10-22' },
  { id: 'ID9876543210987', product: 'Beauty Cream', producer: 'Wardah Beauty', status: 'Certified', expiry: '2026-01-15' },
  { id: 'ID1122334455667', product: 'Halal Beef Sausage', producer: 'So Good Foods', status: 'Certified', expiry: '2024-12-31' },
  { id: 'IDEXP1234567890', product: 'Expired Cheese', producer: 'Old Dairy Farm', status: 'Certified', expiry: '2022-01-01' },
  { id: 'ID7788990011223', product: 'Moisturizing Lipstick', producer: 'Wardah Beauty', status: 'Not Certified', expiry: 'N/A' },
  { id: 'ID2468013579246', product: 'Organic Green Tea', producer: 'SariWangi', status: 'Certified', expiry: '2025-08-10' },
  { id: 'ID1357924680135', product: 'UHT Full Cream Milk', producer: 'Cimory', status: 'Certified', expiry: '2025-02-20' },
  { id: 'ID8642097531864', product: 'Spicy Chicken Nuggets', producer: 'So Good Foods', status: 'Certified', expiry: '2024-11-05' },
  { id: 'ID9753186420975', product: 'Facial Cleanser', producer: 'Wardah Beauty', status: 'Certified', expiry: '2026-05-30' },
  { id: 'ID1928374655647', product: 'Soy Sauce', producer: 'ABC Foods', status: 'Certified', expiry: '2027-01-01' },
];

const ITEMS_PER_PAGE = 5;

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
  withTooltip?: boolean;
}> = ({ status, expiry, t, withTooltip = false }) => {
    const statusKey = getEffectiveStatusKey({ status, expiry });
    let badgeText = '';
    let badgeClasses = '';
    let tooltipText = '';

    switch (statusKey) {
        case 'certified':
            badgeText = t('certCheck.statusCertified');
            badgeClasses = 'bg-green-100 text-green-800';
            tooltipText = t('certCheck.tooltips.statusCertified');
            break;
        case 'expired':
            badgeText = t('certCheck.statusExpired');
            badgeClasses = 'bg-orange-100 text-orange-800';
            tooltipText = t('certCheck.tooltips.statusExpired');
            break;
        case 'notCertified':
            badgeText = t('certCheck.statusNotCertified');
            badgeClasses = 'bg-red-100 text-red-800';
            tooltipText = t('certCheck.tooltips.statusNotCertified');
            break;
        case 'invalidDate':
        default:
            badgeText = t('certCheck.statusInvalidDate');
            badgeClasses = 'bg-gray-100 text-gray-800';
            tooltipText = t('certCheck.tooltips.statusInvalidDate');
    }

    const badge = <span className={`px-3 py-1 text-xs font-bold rounded-full ${badgeClasses}`}>{badgeText}</span>;

    if (withTooltip) {
      return (
          <div className="relative group flex justify-center sm:justify-end">
              {badge}
              <span className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg text-center">
                  {tooltipText}
              </span>
          </div>
      );
    }
    
    return badge;
};

const CertificateDetailModal: React.FC<{
  certificate: Certificate;
  onClose: () => void;
  t: (key: string) => string;
}> = ({ certificate, onClose, t }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadein"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-halal-green">{t('certCheck.modalDetailTitle')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-500">{t('certCheck.certIdLabel')}</label>
            <p className="text-gray-800 font-mono bg-gray-100 p-2 rounded-md mt-1">{certificate.id}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-500">{t('certCheck.productLabel')}</label>
            <p className="text-gray-800 mt-1">{certificate.product}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-500">{t('certCheck.producerLabel')}</label>
            <p className="text-gray-800 mt-1">{certificate.producer}</p>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-500">{t('certCheck.statusLabel')}</label>
            <StatusBadge status={certificate.status} expiry={certificate.expiry} t={t} />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-500">{t('certCheck.expiryDate')}</label>
            <p className="text-gray-800 font-medium">{certificate.expiry}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-b-2xl text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 transition-colors"
          >
            {t('certCheck.closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddCertificateModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAdd: (cert: Certificate) => void;
    t: (key: string) => string;
}> = ({ isOpen, onClose, onAdd, t }) => {
    const [formData, setFormData] = useState({ id: '', product: '', producer: '', expiry: '' });
    const [status, setStatus] = useState<'Certified' | 'Not Certified'>('Certified');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            setFormData({ id: '', product: '', producer: '', expiry: '' });
            setStatus('Certified');
            setErrors({});
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.id.trim()) newErrors.id = t('certCheck.errorCertNumberRequired');
        if (!formData.product.trim()) newErrors.product = t('certCheck.errorProductRequired');
        if (!formData.producer.trim()) newErrors.producer = t('certCheck.errorProducerRequired');
        if (!formData.expiry) {
            newErrors.expiry = t('certCheck.errorDateRequired');
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiryDate = new Date(formData.expiry);
            if (isNaN(expiryDate.getTime())) {
                newErrors.expiry = t('certCheck.errorInvalidFormat');
            } else if (expiryDate < today) {
                newErrors.expiry = t('certCheck.errorDateInPast');
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onAdd({ ...formData, status });
            onClose();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadein" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold text-halal-green">{t('certCheck.modalTitle')}</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <InputField
                            id="certNumber"
                            name="id"
                            label={t('certCheck.certNumberLabel')}
                            value={formData.id}
                            onChange={handleChange}
                            error={errors.id}
                            placeholder={t('certCheck.certNumberPlaceholder')}
                            required
                        />
                        <InputField
                            id="product"
                            name="product"
                            label={t('certCheck.productLabel')}
                            value={formData.product}
                            onChange={handleChange}
                            error={errors.product}
                            placeholder={t('certCheck.productPlaceholder')}
                            required
                        />
                        <InputField
                            id="producer"
                            name="producer"
                            label={t('certCheck.producerLabel')}
                            value={formData.producer}
                            onChange={handleChange}
                            error={errors.producer}
                            placeholder={t('certCheck.producerPlaceholder')}
                            required
                        />
                         <InputField
                            id="expiry"
                            name="expiry"
                            label={t('certCheck.expiryLabel')}
                            type="date"
                            value={formData.expiry}
                            onChange={handleChange}
                            error={errors.expiry}
                            required
                        />
                         <div>
                            <label className="block text-sm font-medium text-gray-700">{t('certCheck.statusLabel')}</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'Certified' | 'Not Certified')}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-halal-green"
                            >
                                <option value="Certified">{t('certCheck.statusCertified')}</option>
                                <option value="Not Certified">{t('certCheck.statusNotCertified')}</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-b-2xl flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 transition-colors">
                            {t('certCheck.cancelButton')}
                        </button>
                        <button type="submit" className="px-6 py-2 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors">
                            {t('certCheck.saveButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const CertificationCheckPage: React.FC = () => {
    const { t } = useTranslations();
    const [certificates, setCertificates] = useState<Certificate[]>(initialDummyData); 
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [appliedFilters, setAppliedFilters] = useState({ term: '', start: '', end: '', status: '' });
    const [searchResults, setSearchResults] = useState<Certificate[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
    const { globalQuery, globalFilters, searchScope, isGlobalSearch, clearGlobalSearch } = useSearch();
    const isInitialLoad = useRef(true);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);


    // Sync with global search context
    useEffect(() => {
        if (isGlobalSearch && (searchScope === 'all' || searchScope === 'certificates')) {
            setSearchTerm(globalQuery); // Sync input field with global query
            setAppliedFilters(prev => ({
                ...prev,
                term: globalQuery,
                status: globalFilters.certStatus || ''
            }));
             // Clear the global search flag after applying it
            clearGlobalSearch();
        }
    }, [isGlobalSearch, searchScope, globalQuery, globalFilters, clearGlobalSearch]);

    // Effect for debounced live search
    useEffect(() => {
        // This syncs the debounced search term with the applied filters,
        // triggering the main filtering logic automatically as the user types.
        setAppliedFilters(prev => ({
            ...prev,
            term: debouncedSearchTerm,
        }));
    }, [debouncedSearchTerm]);


    useEffect(() => {
        if (showSuccessBanner) {
            const timer = setTimeout(() => {
                setShowSuccessBanner(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessBanner]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setAppliedFilters(prev => ({
            ...prev,
            term: searchTerm,
            start: startDate,
            end: endDate,
        }));
    };
    
    const handleClearFilters = () => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setAppliedFilters({ term: '', start: '', end: '', status: '' });
    };


    useEffect(() => {
        const { term, start, end, status } = appliedFilters;
        const isFilterActive = term.trim() || start || end || status;
        
        // On initial load with no filters, do nothing (show prompt)
        if (isInitialLoad.current && !isFilterActive) {
            isInitialLoad.current = false;
            return;
        }

        setLoading(true);
        setCurrentPage(1);
        
        const lowercasedTerm = term.toLowerCase();
        const startDateObj = start ? new Date(start) : null;
        if(startDateObj) startDateObj.setUTCHours(0, 0, 0, 0);
        
        const endDateObj = end ? new Date(end) : null;
        if(endDateObj) endDateObj.setUTCHours(23, 59, 59, 999);

        const filtered = certificates.filter(cert => {
            const matchesSearch = !term.trim() ||
                cert.id.toLowerCase().includes(lowercasedTerm) ||
                cert.product.toLowerCase().includes(lowercasedTerm) ||
                cert.producer.toLowerCase().includes(lowercasedTerm);

            if (!matchesSearch) return false;
            
            const effectiveStatus = getEffectiveStatusKey(cert);
            if(status && status !== 'all' && effectiveStatus !== status) {
                return false;
            }

            const hasDateFilter = startDateObj || endDateObj;
            if (!hasDateFilter) return true;
            
            if (cert.expiry === 'N/A' || isNaN(new Date(cert.expiry).getTime())) {
                return false;
            }

            const expiryDate = new Date(cert.expiry);
            
            const matchesStartDate = !startDateObj || expiryDate >= startDateObj;
            const matchesEndDate = !endDateObj || expiryDate <= endDateObj;

            return matchesStartDate && matchesEndDate;
        });

        setTimeout(() => {
            setSearchResults(filtered);
            setLoading(false);
        }, 500); // Simulate network delay
    }, [certificates, appliedFilters]);

    const handleAddCertificate = (newCertificate: Certificate) => {
        const updatedCerts = [newCertificate, ...certificates];
        setCertificates(updatedCerts);
        handleClearFilters();
        setShowSuccessBanner(true);
    };

    const handleExportCSV = () => {
        if (!searchResults || searchResults.length === 0) {
            return;
        }

        const headers = ['Certificate ID', 'Product Name', 'Producer Name', 'Status', 'Expiry Date'];
        
        const statusKeyMap: Record<EffectiveStatusKey, string> = {
            'certified': t('certCheck.statusCertified'),
            'expired': t('certCheck.statusExpired'),
            'notCertified': t('certCheck.statusNotCertified'),
            'invalidDate': t('certCheck.statusInvalidDate')
        };

        const rows = searchResults.map(cert => {
            const statusKey = getEffectiveStatusKey(cert);
            const statusText = statusKeyMap[statusKey];
            
            const escapeCSV = (field: string) => `"${String(field).replace(/"/g, '""')}"`;

            return [
                escapeCSV(cert.id),
                escapeCSV(cert.product),
                escapeCSV(cert.producer),
                escapeCSV(statusText),
                escapeCSV(cert.expiry)
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const today = new Date().toISOString().split('T')[0];
        
        link.setAttribute('href', url);
        link.setAttribute('download', `halal_certificates_export_${today}.csv`);
        document.body.appendChild(link);
        
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const totalPages = searchResults ? Math.ceil(searchResults.length / ITEMS_PER_PAGE) : 0;
    const paginatedResults = searchResults 
        ? searchResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) 
        : [];

    
    const EmptyState = () => (
        <div className="text-center p-12 bg-gray-100/50 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="mt-6 text-2xl font-bold text-gray-800">{t('certCheck.emptyStateTitle')}</h2>
            <p className="mt-2 text-gray-600">{t('certCheck.emptyStateSubtitle')}</p>
            <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 px-8 py-3 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors shadow-lg hover:shadow-xl"
            >
                {t('certCheck.addFirstCertificate')}
            </button>
        </div>
    );

    const renderResults = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center p-20">
                    <div className="w-12 h-12 border-4 border-halal-green border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }
    
        if (searchResults === null) {
            return (
                <div className="text-center p-12 bg-gray-100/50 rounded-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <p className="mt-4 text-gray-600">{t('certCheck.initialPrompt')}</p>
                </div>
            );
        }

        if (searchResults.length > 0) {
            return (
                <div className="space-y-4">
                    <div className="px-4 text-sm font-semibold text-gray-500 hidden sm:grid grid-cols-3 gap-4">
                        <span>Product / Producer</span>
                        <span className="text-center">Expiry Date</span>
                        <span className="text-right">Status</span>
                    </div>
                    {paginatedResults.map(cert => (
                        <div 
                            key={cert.id}
                            onClick={() => setSelectedCertificate(cert)}
                            className="p-4 bg-white rounded-xl shadow-sm border hover:shadow-md hover:border-halal-green transition-all duration-200 cursor-pointer flex flex-col sm:grid sm:grid-cols-3 sm:items-center gap-4"
                        >
                            <div>
                                <p className="font-bold text-gray-800">{cert.product}</p>
                                <p className="text-sm text-gray-500">{cert.producer}</p>
                                <p className="sm:hidden text-xs text-gray-400 mt-2 font-mono">{cert.id}</p>
                            </div>
                            <div className="relative group text-center">
                                <p className="text-sm font-medium text-gray-600">{cert.expiry}</p>
                                <span className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg text-center">
                                    {t('certCheck.tooltips.expiryDate')}
                                </span>
                            </div>
                            <div className="sm:text-right w-full sm:w-auto">
                                <StatusBadge status={cert.status} expiry={cert.expiry} t={t} withTooltip={true} />
                            </div>
                        </div>
                    ))}
                    {totalPages > 1 && searchResults && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalResults={searchResults.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                      />
                    )}
                </div>
            );
        }

        return (
            <div className="text-center p-12 bg-gray-100/50 rounded-2xl">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l.01.01" />
                </svg>
                <h2 className="mt-6 text-2xl font-bold text-gray-800">{t('certCheck.noResultsTitle')}</h2>
                <p className="mt-2 text-gray-600">{t('certCheck.noResults')}</p>
            </div>
        );
    }


    return (
        <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
            {/* Success Banner */}
            <div className={`fixed top-28 left-1/2 -translate-x-1/2 z-50 w-full max-w-md transition-all duration-300 ${showSuccessBanner ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg text-center">
                    {t('certCheck.addSuccessMessage')}
                </div>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-halal-green">{t('certCheck.title')}</h1>
                <p className="text-lg text-gray-500 mt-2">{t('certCheck.subtitle')}</p>
            </div>

            {certificates.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    <div className={`max-w-2xl mx-auto mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border transition-opacity ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <form onSubmit={handleSearch}>
                             {/* Main Search Bar */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-grow">
                                    <label htmlFor="main-cert-search" className="sr-only">{t('certCheck.searchPlaceholder')}</label>
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </span>
                                    <input
                                        id="main-cert-search"
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        placeholder={t('certCheck.searchPlaceholder')}
                                        className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green transition-shadow shadow-sm disabled:bg-gray-100"
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
                                        <span>{t('certCheck.searchButton')}</span>
                                    )}
                                </button>
                            </div>

                             {/* Advanced Filters Toggle */}
                            <div className="text-center mt-4">
                                <button type="button" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="text-sm font-semibold text-halal-green hover:text-green-700 p-2">
                                    Advanced Filters {showAdvancedFilters ? '▲' : '▼'}
                                </button>
                            </div>

                            {/* Advanced Filters Section */}
                            {showAdvancedFilters && (
                                <div className="mt-4 border-t pt-4 animate-fadein">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1 ml-2">{t('certCheck.startDateLabel')}</label>
                                            <input
                                                id="startDate"
                                                type="date"
                                                value={startDate}
                                                onChange={e => setStartDate(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green bg-white disabled:bg-gray-100"
                                                disabled={loading}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1 ml-2">{t('certCheck.endDateLabel')}</label>
                                            <input
                                                id="endDate"
                                                type="date"
                                                value={endDate}
                                                onChange={e => setEndDate(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green bg-white disabled:bg-gray-100"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center mt-6">
                                        <button
                                            type="button"
                                            onClick={handleClearFilters}
                                            className="px-8 py-2 bg-white text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-colors border border-gray-300 disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {t('certCheck.clearFiltersButton')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="text-center mb-8 flex flex-wrap justify-center items-center gap-4">
                        <button onClick={() => setIsModalOpen(true)} className="text-halal-green font-semibold hover:text-green-700 transition-colors">
                            + {t('certCheck.addCertificate')}
                        </button>
                        <button
                            onClick={handleExportCSV}
                            disabled={!searchResults || searchResults.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {t('certCheck.exportButton')}
                        </button>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {renderResults()}
                    </div>
                </>
            )}
            
            {selectedCertificate && (
                <CertificateDetailModal
                    certificate={selectedCertificate}
                    onClose={() => setSelectedCertificate(null)}
                    t={t}
                />
            )}

            <AddCertificateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddCertificate}
                t={t}
            />
        </div>
    );
};

export default CertificationCheckPage;