import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useSearch } from '../contexts/SearchContext';
import { useDebounce } from '../hooks/useDebounce';
import { useProducts } from '../hooks/useProducts';
import PriceRangeSlider from './PriceRangeSlider';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (scope: 'products' | 'certificates' | 'map', query: string) => void;
}

const productCategories = ['all', 'food', 'cosmetics', 'fashion', 'pharmaceuticals'];
const certificateStatuses = ['all', 'certified', 'expired', 'notCertified'];
const RECENT_SEARCHES_KEY = 'recentSearches';

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onSearch }) => {
    const { t } = useTranslations();
    const { products: allProducts } = useProducts();
    const { 
        setGlobalQuery, 
        setGlobalFilters, 
        searchScope, 
        setSearchScope,
        triggerGlobalSearch
    } = useSearch();

    const [localQuery, setLocalQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [localFilters, setLocalFilters] = useState<{
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        certStatus?: string;
    }>({});
    
    const inputRef = useRef<HTMLInputElement>(null);

    const popularSuggestions = useMemo(() => [
        t('search.suggestions.1'),
        t('search.suggestions.2'),
        t('search.suggestions.3'),
    ], [t]);
    
    const scopes = useMemo(() => [
        { id: 'all', labelKey: 'search.scopeAll' },
        { id: 'products', labelKey: 'search.scopeProducts' },
        { id: 'certificates', labelKey: 'search.scopeCertificates' },
        { id: 'map', labelKey: 'search.scopeMap' },
    ], []);

    // Load recent searches from localStorage on mount
    useEffect(() => {
        try {
            const savedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
            if (savedSearches) {
                setRecentSearches(JSON.parse(savedSearches));
            }
        } catch (error) {
            console.error("Failed to load recent searches:", error);
            setRecentSearches([]);
        }
    }, []);

    const { minPrice, maxPrice } = useMemo(() => {
        if (allProducts.length === 0) return { minPrice: 0, maxPrice: 100 };
        const prices = allProducts.map(p => p.price);
        return {
            minPrice: Math.floor(Math.min(...prices)),
            maxPrice: Math.ceil(Math.max(...prices)),
        };
    }, [allProducts]);
    
    useEffect(() => {
        setLocalFilters(prev => ({ ...prev, minPrice, maxPrice }));
    }, [minPrice, maxPrice]);
    
    // Focus management and escape key listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);


    const performSearch = (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        // Update recent searches
        const newRecent = [trimmedQuery, ...recentSearches.filter(s => s !== trimmedQuery)].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecent));

        setGlobalQuery(trimmedQuery);
        setGlobalFilters(localFilters);
        triggerGlobalSearch();

        // 1. Handle explicit scopes
        if (searchScope === 'products' || searchScope === 'certificates' || searchScope === 'map') {
            onSearch(searchScope, trimmedQuery);
            onClose();
            return;
        }

        // 2. Handle 'all' scope by inferring intent
        const lowerQuery = trimmedQuery.toLowerCase();
        const mapKeywords = ['near me', 'nearby', 'restaurant', 'food', 'mosque', 'masjid', 'shop', 'store', 'market', 'cafe', 'bakery', 'butcher', 'find', 'where is', 'location of', 'address of', 'di dekat saya', 'restoran', 'makanan', 'masjid', 'toko', 'pasar', 'kafe', 'roti', 'daging', 'cari', 'dimana', 'بالقرب مني', 'مطعم', 'طعام', 'مسجد', 'متجر', 'سوق', 'مقهى', 'مخبز', 'جزار', 'ابحث'];
        const isMapQuery = mapKeywords.some(keyword => lowerQuery.includes(keyword));
        
        if (isMapQuery) {
            onSearch('map', trimmedQuery);
        } else if (lowerQuery.includes('cert')) {
            onSearch('certificates', trimmedQuery);
        } else {
            onSearch('products', trimmedQuery); // Default
        }
        
        onClose();
    };

    const handleSearch = () => {
        performSearch(localQuery);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setLocalQuery(suggestion);
        performSearch(suggestion);
    };

    const handleClearHistory = (e: React.MouseEvent) => {
        e.stopPropagation();
        setRecentSearches([]);
        localStorage.removeItem(RECENT_SEARCHES_KEY);
    };
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[60] flex flex-col items-center p-4 sm:p-6"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-search-title"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl animate-fadein"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 flex items-center gap-4">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </span>
                        <label htmlFor="global-search-input" id="global-search-title" className="sr-only">{t('search.title')}</label>
                        <input
                            id="global-search-input"
                            ref={inputRef}
                            type="text"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder={t('header.searchPlaceholder')}
                            className="w-full py-3 pl-12 pr-4 text-gray-800 dark:text-gray-100 text-lg bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green dark:focus:ring-accent-gold"
                        />
                    </div>
                    <button onClick={onClose} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-halal-green dark:hover:text-accent-gold p-2 rounded-full">
                       {t('search.close')}
                    </button>
                </div>

                <div className="px-6 pb-4 border-b dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">{t('search.searchIn')}</span>
                        <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-full p-1 space-x-1 overflow-x-auto">
                            {scopes.map(scope => (
                                <button
                                    key={scope.id}
                                    onClick={() => setSearchScope(scope.id as any)}
                                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 whitespace-nowrap ${
                                        searchScope === scope.id
                                        ? 'bg-white dark:bg-gray-700 text-halal-green dark:text-gray-100 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
                                    }`}
                                >
                                    {t(scope.labelKey)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {localQuery.trim() === '' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">{t('search.recentSearches')}</h3>
                                    {recentSearches.length > 0 && (
                                        <button onClick={handleClearHistory} className="text-xs font-medium text-halal-green dark:text-accent-gold hover:underline">
                                            {t('search.clearHistory')}
                                        </button>
                                    )}
                                </div>
                                {recentSearches.length > 0 ? (
                                    <ul className="space-y-2">
                                        {recentSearches.map((search, index) => (
                                            <li key={index}>
                                                <button onClick={() => handleSuggestionClick(search)} className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    <span>{search}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">No recent searches.</p>
                                )}
                            </div>
                             <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('search.suggestions.title')}</h3>
                                <ul className="space-y-2">
                                    {popularSuggestions.map((suggestion, index) => (
                                        <li key={index}>
                                             <button onClick={() => handleSuggestionClick(suggestion)} className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                <span>{suggestion}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                             </div>
                        </div>
                    ) : (
                        <div>
                             {/* Autocomplete suggestions can be rendered here in the future */}
                             <p className="text-center text-gray-500 dark:text-gray-400 p-8">Press Enter to search for "{localQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GlobalSearch;