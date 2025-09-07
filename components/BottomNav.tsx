import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';
import { PERSONAS } from '../constants';

interface BottomNavProps {
    onNavigate: (page: string) => void;
    currentPage: string;
}

// Nav Item structure
interface NavItem {
    name: string;
    icon: React.ReactNode;
    key: string;
    isCentral?: boolean;
}

const getNavItems = (
    t: ReturnType<typeof useTranslations>['t']
): NavItem[] => {
    // Define icons once
    const HomeIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    const ServicesIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
    const NewsIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m-4 3H9m-4 3h2m-4 3h2m-4 3h2" /></svg>;
    const ProfileIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

    return [
        { name: t('nav.home'), icon: HomeIcon, key: 'home' },
        { name: t('nav.services'), icon: ServicesIcon, key: 'more' },
        { name: 'HANA', isCentral: true, key: 'hana', icon: <></> }, // Icon is handled separately
        { name: t('nav.news'), icon: NewsIcon, key: 'news' },
        { name: t('nav.profile'), icon: ProfileIcon, key: 'profile' },
    ];
};

const BottomNav: React.FC<BottomNavProps> = ({ onNavigate, currentPage }) => {
  const { t } = useTranslations();
  const { persona, isAuthenticated } = useAuth();

  const navItems = getNavItems(t);
  const personaDetails = PERSONAS.find(p => p.id === persona);
  const personaName = personaDetails ? t(personaDetails.name) : '';


  return (
    <nav id="bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = currentPage === item.key;
        if (item.isCentral) {
          return (
            <a
              key={item.key}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.key);
              }}
              className="-mt-12 w-24 h-24 rounded-full bg-halal-green text-white flex items-center justify-center shadow-2xl shadow-halal-green/50 ring-8 ring-white dark:ring-gray-800 transition-transform hover:scale-105"
              aria-label="Navigate to HANA AI Assistant page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h.01M15 10h.01" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14s1.5 2 3 2 3-2 3-2" />
              </svg>
            </a>
          );
        }
        return (
          <button 
            key={item.key} 
            onClick={() => onNavigate(item.key)} 
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive 
                ? 'text-halal-green dark:text-accent-gold' 
                : 'text-gray-500 dark:text-gray-400 hover:text-halal-green dark:hover:text-accent-gold'
            }`}
             aria-current={isActive ? 'page' : undefined}
          >
             <div className={`p-2 rounded-full transition-colors duration-200 ${isActive ? 'bg-halal-green/10 dark:bg-accent-gold/10' : ''}`}>
                 {item.icon}
             </div>
            <span className={`text-xs mt-1 transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
             {item.key === 'profile' && isAuthenticated && persona !== 'guest' && (
                <span className="text-[10px] text-halal-green/80 -mt-0.5 font-medium">{personaName}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;