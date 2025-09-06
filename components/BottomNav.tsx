import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface BottomNavProps {
    onNavigate: (page: string) => void;
    currentPage: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ onNavigate, currentPage }) => {
  const { t } = useTranslations();
  const navItems = [
    { name: t('nav.home'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, key: 'home' },
    { name: t('nav.regulation'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-5.45-9.456l10.9 2.228m-10.9-2.228L5.45 4.545 2.25 5.454l3.2 1.964L12 6.253zM5.45 4.545L2.25 5.454 5.45 7.42 12 6.253 5.45 4.545zM18.55 19.455l3.2-1.964-3.2-1.964-6.55 1.33-3.2 1.964 3.2 1.964 6.55-1.33z" /></svg>, key: 'regulation' },
    { name: 'HANA', isCentral: true, key: 'hana' },
    { name: t('nav.news'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m-4 3H9m-4 3h2m-4 3h2m-4 3h2" /></svg>, key: 'news' },
    { name: t('nav.profile'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, key: 'profile' },
  ];

  return (
    <nav id="bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-lg border-t border-gray-200 flex justify-around items-center z-50">
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
              className="-mt-12 w-24 h-24 rounded-full bg-halal-green text-white flex items-center justify-center shadow-2xl shadow-halal-green/50 ring-8 ring-white transition-transform hover:scale-105"
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
                ? 'text-halal-green' 
                : 'text-gray-500 hover:text-halal-green'
            }`}
             aria-current={isActive ? 'page' : undefined}
          >
             <div className={`p-2 rounded-full transition-colors duration-200 ${isActive ? 'bg-halal-green/10' : ''}`}>
                 {item.icon}
             </div>
            <span className={`text-xs mt-1 transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;