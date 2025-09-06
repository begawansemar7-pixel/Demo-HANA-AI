import React, { useState, useMemo, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useBasket } from '../hooks/useBasket';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';
import { useCurrency } from '../hooks/useCurrency';
import PriceRangeSlider from './PriceRangeSlider';
import StarRating from './StarRating';
import QuickViewModal from './QuickViewModal';
import Pagination from './Pagination';
import { useSearch } from '../contexts/SearchContext';
import { useDebounce } from '../hooks/useDebounce';

const categories = ['all', 'food', 'cosmetics', 'fashion', 'pharmaceuticals'];
const ITEMS_PER_PAGE = 8;

interface MarketplacePageProps {
    onProductSelect: (id: number) => void;
}

const ProductCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
        <div className="h-40 sm:h-56 bg-gray-200"></div>
        <div className="p-4 flex flex-col flex-grow">
            <div className="flex-grow">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="mt-auto pt-4">
                <div className="h-5 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    </div>
);


const MarketplacePage: React.FC<MarketplacePageProps> = ({ onProductSelect }) => {
    const { t } = useTranslations();
    const { basketItems, addToBasket, updateQuantity } = useBasket();
    const { products: allProducts, loading } = useProducts();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('default');
    const { formatPrice } = useCurrency();
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { globalQuery, globalFilters, searchScope, isGlobalSearch, clearGlobalSearch } = useSearch();
    const [showFilters, setShowFilters] = useState(false);
    
    // Calculate min/max price for the slider
    const { minPrice, maxPrice } = useMemo(() => {
        if (allProducts.length === 0) {
            return { minPrice: 0, maxPrice: 100 }; // Default values
        }
        const prices = allProducts.map(p => p.price);
        return {
            minPrice: Math.floor(Math.min(...prices)),
            maxPrice: Math.ceil(Math.max(...prices)),
        };
    }, [allProducts]);
    
    // State for price range filter
    const [localPriceRange, setLocalPriceRange] = useState({ min: minPrice, max: maxPrice });
    const debouncedPriceRange = useDebounce(localPriceRange, 400);


    // Effect to reset price range when products data or its derived min/max changes
    useEffect(() => {
        setLocalPriceRange({ min: minPrice, max: maxPrice });
    }, [minPrice, maxPrice]);
    
    // Sync with global search context
    useEffect(() => {
        if (isGlobalSearch && (searchScope === 'all' || searchScope === 'products')) {
            setSearchTerm(globalQuery);
            if (globalFilters.category && globalFilters.category !== 'all') {
                setActiveCategory(globalFilters.category);
            }
            if (globalFilters.minPrice !== undefined && globalFilters.maxPrice !== undefined) {
                setLocalPriceRange({ min: globalFilters.minPrice, max: globalFilters.maxPrice });
                setShowFilters(true); // Show filters if price is set globally
            }
            // Clear the global search flag after applying it
            // to allow local searching again.
            clearGlobalSearch(); 
        }
    }, [isGlobalSearch, searchScope, globalQuery, globalFilters, clearGlobalSearch]);

    // Reset current page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, searchTerm, debouncedPriceRange, sortOrder]);

    const resetPriceFilter = () => {
        setLocalPriceRange({ min: minPrice, max: maxPrice });
    }

    const filteredProducts = useMemo(() => {
        const productsToDisplay = allProducts.filter(product => {
            const matchesCategory = activeCategory === 'all' || product.category.toLowerCase().replace(' & beverage', '') === activeCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.producer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPrice = product.price >= debouncedPriceRange.min && product.price <= debouncedPriceRange.max;
            return matchesCategory && matchesSearch && matchesPrice;
        });

        // Sorting logic
        switch (sortOrder) {
            case 'price-asc':
                productsToDisplay.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                productsToDisplay.sort((a, b) => b.price - a.price);
                break;
            case 'rating-desc':
                productsToDisplay.sort((a, b) => b.averageRating - a.averageRating);
                break;
            case 'name-asc':
                productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Default sort (by ID) can be maintained here if needed
                break;
        }

        return productsToDisplay;

    }, [allProducts, activeCategory, searchTerm, debouncedPriceRange, sortOrder]);
    
    // Paginate the filtered products
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleExportCSV = () => {
        if (filteredProducts.length === 0) {
            return;
        }

        const headers = ['Product Name', 'Producer', 'Price', 'Category', 'Average Rating'];
        
        const escapeCSV = (field: string | number) => `"${String(field).replace(/"/g, '""')}"`;

        const rows = filteredProducts.map(product => {
            return [
                escapeCSV(product.name),
                escapeCSV(product.producer),
                product.price, // Keep price as a raw number for CSV
                escapeCSV(product.category),
                product.averageRating.toFixed(2) // Format rating
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const today = new Date().toISOString().split('T')[0];
        
        link.setAttribute('href', url);
        link.setAttribute('download', `halal_products_export_${today}.csv`);
        document.body.appendChild(link);
        
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const ProductActions: React.FC<{ product: Product }> = ({ product }) => {
        const itemInBasket = basketItems.find(item => item.id === product.id);

        if (itemInBasket) {
            return (
                <div className="flex items-center justify-between w-full bg-gray-100 rounded-xl p-1 shadow-inner">
                    <button
                        onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, itemInBasket.quantity - 1); }}
                        className="w-10 h-10 rounded-lg font-bold text-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                        aria-label={`Decrease quantity of ${product.name}`}
                    >
                        -
                    </button>
                    <span className="font-bold text-lg text-gray-800" aria-live="polite">
                        {itemInBasket.quantity}
                    </span>
                    <button
                        onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, itemInBasket.quantity + 1); }}
                        className="w-10 h-10 rounded-lg font-bold text-xl flex items-center justify-center text-halal-green hover:bg-halal-green/10 transition-colors"
                        aria-label={`Increase quantity of ${product.name}`}
                    >
                        +
                    </button>
                </div>
            );
        }

        return (
            <button
                onClick={(e) => { e.stopPropagation(); addToBasket(product); }}
                className="w-full py-3 bg-halal-green text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-halal-green transition-all shadow-lg shadow-halal-green/30 hover:shadow-xl flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{t('marketplace.addToBasket')}</span>
            </button>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-halal-green">{t('marketplace.title')}</h1>
                <p className="text-lg text-gray-500 mt-2">{t('marketplace.subtitle')}</p>
            </div>

            {/* Search and Price Filter Bar */}
            <div className="mb-8 sticky top-24 z-30">
                 <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200/80 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            {/* Search Input */}
                            <div className="md:col-span-5 relative">
                                <label htmlFor="product-search" className="sr-only">{t('marketplace.searchLabel')}</label>
                                <input
                                    id="product-search"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t('marketplace.searchPlaceholder')}
                                    className="w-full py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green disabled:bg-gray-100"
                                    disabled={loading}
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>
                             {/* Category Dropdown */}
                            <div className="md:col-span-3 relative">
                                <label htmlFor="category-select" className="sr-only">{t('search.category')}</label>
                                <select
                                    id="category-select"
                                    value={activeCategory}
                                    onChange={(e) => setActiveCategory(e.target.value)}
                                    disabled={loading}
                                    className="w-full py-3 pl-4 pr-10 text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green disabled:bg-gray-100 appearance-none"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {t(`marketplace.categories.${category}`)}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4"/>
                                    </svg>
                                </div>
                            </div>

                             {/* Sort Dropdown */}
                             <div className="md:col-span-3 relative">
                                <label htmlFor="sort-select" className="sr-only">{t('marketplace.sortBy.label')}</label>
                                <select
                                    id="sort-select"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    disabled={loading}
                                    className="w-full py-3 pl-4 pr-10 text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green disabled:bg-gray-100 appearance-none"
                                >
                                    <option value="default">{t('marketplace.sortBy.default')}</option>
                                    <option value="price-asc">{t('marketplace.sortBy.priceAsc')}</option>
                                    <option value="price-desc">{t('marketplace.sortBy.priceDesc')}</option>
                                    <option value="rating-desc">{t('marketplace.sortBy.ratingDesc')}</option>
                                    <option value="name-asc">{t('marketplace.sortBy.nameAsc')}</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4"/>
                                    </svg>
                                </div>
                            </div>
                            
                             {/* Filter Toggle Button */}
                            <div className="md:col-span-1">
                                <button 
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                                    aria-expanded={showFilters}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6h9m-9 6h9m-9 6h9M4 6h1v4H4V6zm0 6h1v4H4v-4zm0 6h1v4H4v-4z" />
                                    </svg>
                                    <span>{t('search.filters')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Collapsible Filter Section */}
                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200/80 animate-fadein">
                                 <fieldset>
                                    <div className="flex justify-between items-center mb-1">
                                        <legend className="font-semibold text-gray-700 text-sm px-1">{t('marketplace.priceRange')}</legend>
                                        <button 
                                            onClick={resetPriceFilter}
                                            className="text-sm font-medium text-halal-green hover:text-green-700 disabled:text-gray-400"
                                            aria-label={`${t('marketplace.reset')} ${t('marketplace.priceRange')}`}
                                            disabled={loading}
                                        >
                                            {t('marketplace.reset')}
                                        </button>
                                    </div>
                                    {allProducts.length > 0 && maxPrice > minPrice && (
                                        <PriceRangeSlider 
                                            min={minPrice}
                                            max={maxPrice}
                                            value={localPriceRange}
                                            onChange={setLocalPriceRange}
                                            disabled={loading}
                                        />
                                    )}
                                </fieldset>
                            </div>
                        )}
                    </div>
                 </div>
            </div>

            {/* Action Bar: Export Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleExportCSV}
                    disabled={filteredProducts.length === 0 || loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{t('marketplace.exportButton')}</span>
                </button>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            ) : filteredProducts.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {paginatedProducts.map(product => (
                            <div 
                                key={product.id} 
                                onClick={() => onProductSelect(product.id)}
                                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                            >
                                <div className="relative h-40 sm:h-56 overflow-hidden group">
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center p-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setQuickViewProduct(product);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 text-halal-green font-bold py-2 px-4 rounded-full flex items-center gap-2 text-sm backdrop-blur-sm"
                                            aria-label={`Quick view ${product.name}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                                            </svg>
                                            <span>{t('marketplace.quickView')}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-sm sm:text-md text-gray-800" style={{ minHeight: '2.5em' }}>{product.name}</h3>
                                        <p className="text-xs sm:text-sm text-gray-500">{product.producer}</p>
                                    </div>
                                    <div className="mt-auto pt-4">
                                        <div className="flex items-center gap-2 mb-2" title={`${product.averageRating.toFixed(1)} out of 5 stars`}>
                                            {product.reviewCount > 0 ? (
                                                <>
                                                    <StarRating rating={product.averageRating} />
                                                    <span className="text-sm text-gray-600">({product.reviewCount})</span>
                                                </>
                                            ) : (
                                                <div className="h-5" />
                                            )}
                                        </div>
                                        <p className="font-bold text-halal-green text-sm sm:text-lg mb-3">{formatPrice(product.price)}</p>
                                        <ProductActions product={product} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                     {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalResults={filteredProducts.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                    )}
                </>
            ) : (
                 <div className="text-center col-span-full py-16">
                    <p className="text-gray-500">{t('marketplace.noResults')}</p>
                </div>
            )}
            
            <QuickViewModal 
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                onNavigateToDetail={onProductSelect}
            />
        </div>
    );
};

export default MarketplacePage;