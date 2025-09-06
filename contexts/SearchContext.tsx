import React, { createContext, useState, useContext } from 'react';

type SearchScope = 'all' | 'products' | 'certificates';

interface SearchFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    certStatus?: string;
}

interface SearchContextType {
    globalQuery: string;
    setGlobalQuery: (query: string) => void;
    globalFilters: SearchFilters;
    setGlobalFilters: (filters: SearchFilters) => void;
    searchScope: SearchScope;
    setSearchScope: (scope: SearchScope) => void;
    isGlobalSearch: boolean;
    triggerGlobalSearch: () => void;
    clearGlobalSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [globalQuery, setGlobalQuery] = useState('');
    const [globalFilters, setGlobalFilters] = useState<SearchFilters>({});
    const [searchScope, setSearchScope] = useState<SearchScope>('all');
    const [isGlobalSearch, setIsGlobalSearch] = useState(false);

    const triggerGlobalSearch = () => setIsGlobalSearch(true);
    const clearGlobalSearch = () => setIsGlobalSearch(false);
    
    return (
        <SearchContext.Provider value={{
            globalQuery,
            setGlobalQuery,
            globalFilters,
            setGlobalFilters,
            searchScope,
            setSearchScope,
            isGlobalSearch,
            triggerGlobalSearch,
            clearGlobalSearch
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};