import React, { useState, useEffect, useMemo } from 'react';
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
    const debouncedQuery = useDebounce(localQuery, 300);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [localFilters, setLocalFilters] = useState<{
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        certStatus?: string;
    }>({});

    const allSuggestions = useMemo(() => [
        t('search.suggestions.1'),
        t('search.suggestions.2'),
        t('search.suggestions.3'),
    ], [t]);

    useEffect(() => {
        if (debouncedQuery.trim()) {
            const lowercasedQuery = debouncedQuery.toLowerCase();
            const matchingSuggestions = allSuggestions.filter(s => 
                s.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredSuggestions(matchingSuggestions);
        } else {
            setFilteredSuggestions([]);
        }
    }, [debouncedQuery, allSuggestions]);
    
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

    const performSearch = (query: string) => {
        if (!query.trim()) return;

        setGlobalQuery(query);
        setGlobalFilters(localFilters);
        triggerGlobalSearch();

        // 1. Handle explicit scopes
        if (searchScope === 'products' || searchScope === 'certificates' || searchScope === 'map') {
            onSearch(searchScope, query);
            onClose();
            return;
        }

        // 2. Handle 'all' scope by inferring intent
        const lowerQuery = query.toLowerCase();
        const mapKeywords = [
            'near me', 'nearby', 'restaurant', 'food', 'mosque', 'masjid', 'shop', 
            'store', 'market', 'cafe', 'bakery', 'butcher', 'find', 'where is', 
            'location of', 'address of', 'di dekat saya', 'restoran', 'makanan', 
            'masjid', 'toko', 'pasar', 'kafe', 'roti', 'daging', 'cari', 'dimana',
            'بالقرب مني', 'مطعم', 'طعام', 'مسجد', 'متجر', 'سوق', 'مقهى', 'مخبز', 'جزار', 'ابحث'
        ];
        const isMapQuery = mapKeywords.some(keyword => lowerQuery.includes(keyword));
        
        if (isMapQuery) {
            onSearch('map', query);
        } else if (lowerQuery.includes('cert')) {
            onSearch('certificates', query);
        } else {
            onSearch('products', query); // Default
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

    const handleClear = () => {
        setLocalQuery('');
        setLocalFilters({ minPrice, maxPrice });
        setSearchScope('all');
    }
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex justify-center p-4 pt-[15vh]"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-fit animate-fadein"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b">
                    <div className="relative">
                        <input
                            type="text"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder={t('header.searchPlaceholder')}
                            className="w-full py-3 pl-12 pr-4 text-gray-800 text-lg bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green"
                            autoFocus
                        />
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        
                        {/* Suggestions dropdown: Shows popular when empty, autocomplete when typing */}
                        {localQuery.trim() === '' ? (
                             <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border z-10 animate-fadein">
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-700 mb-3">{t('search.suggestions.title')}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {allSuggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-halal-green hover:text-white transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             </div>
                        ) : filteredSuggestions.length > 0 && (
                            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border z-10 animate-fadein">
                                <ul className="py-1 max-h-40 overflow-y-auto">
                                    {filteredSuggestions.map((suggestion, index) => (
                                        <li key={index}>
                                            <button 
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                {suggestion}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column: Scopes */}
                        <div className="md:border-r pr-6">
                             <h3 className="font-semibold text-gray-700 mb-3">{t('search.searchIn')}</h3>
                             <div className="space-y-2">
                                {(['all', 'products', 'certificates', 'map'] as const).map(scope => (
                                     <button 
                                        key={scope}
                                        onClick={() => setSearchScope(scope)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${searchScope === scope ? 'bg-halal-green text-white font-bold' : 'hover:bg-gray-100'}`}
                                    >
                                        {t(`search.scope${scope.charAt(0).toUpperCase() + scope.slice(1)}`)}
                                    </button>
                                ))}
                             </div>
                        </div>

                        {/* Right Column: Filters */}
                        <div className="md:col-span-2">
                             <h3 className="font-semibold text-gray-700 mb-3">{t('search.filters')}</h3>
                             <div className="space-y-4">
                                { (searchScope === 'all' || searchScope === 'products') && (
                                    <div className="animate-fadein">
                                        <label htmlFor="category-filter" className="text-sm font-medium text-gray-600">{t('search.category')}</label>
                                        <select 
                                            id="category-filter"
                                            value={localFilters.category || 'all'}
                                            onChange={(e) => setLocalFilters(prev => ({...prev, category: e.target.value}))}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-halal-green"
                                        >
                                            {productCategories.map(cat => (
                                                <option key={cat} value={cat}>{t(`marketplace.categories.${cat}`)}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                { (searchScope === 'all' || searchScope === 'products') && (
                                     <div className="animate-fadein">
                                        <label className="text-sm font-medium text-gray-600">{t('marketplace.priceRange')}</label>
                                        <PriceRangeSlider
                                            min={minPrice}
                                            max={maxPrice}
                                            value={{min: localFilters.minPrice ?? minPrice, max: localFilters.maxPrice ?? maxPrice}}
                                            onChange={(range) => setLocalFilters(prev => ({...prev, minPrice: range.min, maxPrice: range.max }))}
                                        />
                                     </div>
                                )}
                                { (searchScope === 'all' || searchScope === 'certificates') && (
                                     <div className="animate-fadein">
                                        <label htmlFor="status-filter" className="text-sm font-medium text-gray-600">{t('search.certificationStatus')}</label>
                                        <select 
                                            id="status-filter"
                                            value={localFilters.certStatus || 'all'}
                                            onChange={(e) => setLocalFilters(prev => ({...prev, certStatus: e.target.value}))}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-halal-green"
                                        >
                                            {certificateStatuses.map(status => (
                                                 <option key={status} value={status}>
                                                    {status === 'all' ? t('home.news.categories.all') : t(`certCheck.status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
                                                 </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                { searchScope === 'map' && (
                                     <div className="text-center text-gray-500 p-4 animate-fadein">
                                         {t('search.noFiltersForMap')}
                                     </div>
                                )}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-b-2xl flex justify-between items-center">
                     <button onClick={handleClear} className="text-sm font-semibold text-gray-600 hover:text-halal-green">
                        {t('search.clearAll')}
                     </button>
                     <button 
                        onClick={handleSearch}
                        className="px-8 py-3 bg-halal-green text-white font-bold rounded-full hover:bg-opacity-90 transition-colors"
                     >
                        {t('search.searchButton')}
                     </button>
                </div>
            </div>
        </div>
    )
}

export default GlobalSearch;