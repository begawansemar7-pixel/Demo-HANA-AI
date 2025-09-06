import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';
import { useBasket } from '../hooks/useBasket';
import GlobalSearch from './GlobalSearch';

const BpjphLogo: React.FC = () => (
    <div className="flex items-center space-x-3">
        {/* Updated SVG, more faithful to the image */}
        <svg
          className="h-10 w-10 flex-shrink-0"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path
              id="shield"
              d="M50 5 L95 25 V70 C 95 85, 50 95, 50 95 C 50 95, 5 85, 5 70 V25 Z"
            />
          </defs>
          <use href="#shield" fill="none" stroke="#1E7145" strokeWidth="6" />
          <use href="#shield" fill="#CAA845" />
          <g transform="translate(0, -3)" stroke="#1E7145" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M50 78 V 58" />
            <path d="M50 58 C 40 52, 35 42, 32 32" />
            <path d="M50 58 C 60 52, 65 42, 68 32" />
            <path d="M35 48 C 28 48, 25 55, 25 55" />
            <path d="M65 48 C 72 48, 75 55, 75 55" />
          </g>
          <g transform="translate(0, -3)" fill="#1E7145">
            <circle cx="50" cy="78" r="4.5" />
            <circle cx="32" cy="32" r="4.5" />
            <circle cx="68" cy="32" r="4.5" />
            <circle cx="25" cy="55" r="4.5" />
            <circle cx="75" cy="55" r="4.5" />
          </g>
        </svg>
        {/* Updated text, more faithful to the image */}
        <div className="hidden sm:block">
          <div className="font-poppins font-bold text-2xl text-halal-green leading-tight">BPJPH</div>
          <div className="font-poppins font-semibold text-sm text-halal-green leading-tight tracking-wider">AI HALAL ADVISOR</div>
        </div>
      </div>
);

const UserProfileIcon: React.FC<{onNavigate: (page: string) => void}> = ({onNavigate}) => {
    const { user, persona, logout } = useAuth();
    const { t } = useTranslations();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsDropdownOpen(false);
    }
    
    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsDropdownOpen(prev => !prev)} 
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-2 ring-offset-2 ring-transparent hover:ring-halal-green focus:ring-halal-green transition-all"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
            >
                {user ? (
                    <span className="font-bold text-halal-green">{user.name.charAt(0)}</span>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                )}
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 py-1 ring-1 ring-black ring-opacity-5 animate-fadein">
                    {persona === 'guest' ? (
                        <button onClick={() => handleAction(logout)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            {t('header.profileMenu.loginRegister')}
                        </button>
                    ) : (
                        <>
                            <button onClick={() => handleAction(() => onNavigate('profile'))} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                {t('header.profileMenu.viewProfile')}
                            </button>
                            <button onClick={() => handleAction(logout)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                {t('header.profileMenu.switchPersona')}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

const BasketIcon: React.FC<{onClick: () => void}> = ({onClick}) => {
    const { totalItems } = useBasket();
    return (
        <button onClick={onClick} className="relative w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ring-2 ring-offset-2 ring-transparent hover:ring-halal-green transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {totalItems}
                </span>
            )}
        </button>
    );
}

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useTranslations();
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'id', label: 'ID' },
    { code: 'ar', label: 'AR' },
  ];

  return (
    <div className="flex items-center bg-gray-200/70 rounded-full p-1 space-x-1">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 ${
            language === lang.code
              ? 'bg-white text-halal-green shadow-sm'
              : 'text-gray-600 hover:bg-gray-300/50'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

interface HeaderProps {
    onNavigate: (page: string) => void;
    onBasketClick: () => void;
    onSearch: (scope: 'products' | 'certificates' | 'map', query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onBasketClick, onSearch }) => {
  const { t } = useTranslations();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between p-2 sm:p-3 bg-white/70 backdrop-blur-lg rounded-full shadow-md">
          <button onClick={() => onNavigate('home')} className="flex-shrink-0" aria-label="Go to Homepage">
              <BpjphLogo />
          </button>
          
          <div className="flex-1 max-w-lg mx-2 sm:mx-4 hidden md:block">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-full text-left py-2 pl-10 pr-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green transition-all"
            >
              <span className="text-gray-400">{t('header.searchPlaceholder')}</span>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageToggle />
            <BasketIcon onClick={onBasketClick} />
            <UserProfileIcon onNavigate={onNavigate}/>
          </div>
        </div>
      </header>
      <GlobalSearch 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={onSearch}
      />
    </>
  );
};

export default Header;