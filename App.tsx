import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MainCarousel from './components/MainCarousel';
import ServicesMenu from './components/ServicesMenu';
import NewsFeed from './components/NewsFeed';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import PersonaSelectionModal from './components/PersonaSelectionModal';
import HanaPage from './components/HanaPage';
import CertificationCheckPage from './components/CertificationCheckPage';
import IngredientValidatorPage from './components/IngredientValidatorPage';
import MarketplacePage from './components/MarketplacePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ProfilePage from './components/ProfilePage';
import NewsPage from './components/NewsPage';
import { useAuth } from './hooks/useAuth';
import { useTranslations } from './hooks/useTranslations';
import Promotions from './components/Promotions';
import PromotionsPage from './components/PromotionsPage';
import SupplierVerificationPage from './components/SupplierVerificationPage';
import ScanBarcodePage from './components/ScanBarcodePage';
import MoreServicesPage from './components/MoreServicesPage';
import BasketModal from './components/BasketModal';
import ProductDetailPage from './components/ProductDetailPage';
import { useProducts } from './hooks/useProducts';
import RegulationPage from './components/RegulationPage';
import NewsDetailPage from './components/NewsDetailPage';
import { useNews } from './hooks/useNews';
import StoryDetailPage from './components/StoryDetailPage';
import { useStories } from './hooks/useStories';
import MapPage from './components/MapPage';
import AboutPage from './components/AboutPage';
import { SERVICES } from './constants';
import type { PersonaId } from './types';
import SelfDeclarePage from './components/SelfDeclarePage';
import AuditChecklistPage from './components/AuditChecklistPage';
import AuditLogPage from './components/AuditLogPage';
import HalalVerificationPage from './components/HalalVerificationPage';
import MonitoringDashboardPage from './components/MonitoringDashboardPage';
import FAQPage from './components/FAQPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import TaskListPage from './components/TaskListPage';
import { useSearch } from './contexts/SearchContext';


const App: React.FC = () => {
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const { persona, isAuthenticated, selectPersona, logout } = useAuth();
  const { t } = useTranslations();
  const { products } = useProducts();
  const { news } = useNews();
  const { stories } = useStories();
  const { setGlobalQuery, setSearchScope, triggerGlobalSearch } = useSearch();
  const prevIsAuthenticated = useRef(isAuthenticated);

  // Centralize page permissions for consistent access control.
  // Permissions are derived from the SERVICES constant and extended for pages not listed as services.
  const pagePermissions = useMemo(() => {
    const servicePermissions = SERVICES.reduce((acc, service) => {
      if (service.personas) {
        acc[service.id] = service.personas;
      }
      return acc;
    }, {} as Record<string, PersonaId[]>);

    return {
      ...servicePermissions,
      // Derive permissions for sub-pages from their parent service
      'product-detail': servicePermissions['marketplace'],
      // Add explicit permissions for pages not in the SERVICES array
      'profile': ['consumer', 'umkm', 'auditor', 'officer'],
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  }

  const navigateTo = useCallback((page: string) => {
    const allowedPersonas = pagePermissions[page as keyof typeof pagePermissions];

    // Check permissions if they are defined for the page
    if (allowedPersonas) {
      // If the user is not authenticated OR their persona is not in the allowed list
      if (!isAuthenticated || (persona && !allowedPersonas.includes(persona))) {
        // Provide a specific message for guests trying to access their profile
        if (persona === 'guest' && page === 'profile') {
          alert(t('auth.guestAccessDenied'));
        } else {
          // General access denied message for other protected routes
          alert(t('auth.accessDenied'));
        }
        return; // Block navigation
      }
    }
    
    window.scrollTo(0, 0);
    setSelectedProductId(null);
    // FIX: Complete the state reset logic for navigation.
    setSelectedNewsId(null);
    setSelectedStoryId(null);
    setCurrentPage(page);
  }, [pagePermissions, isAuthenticated, persona, t]);

  // Effect to handle redirection after login based on persona
  useEffect(() => {
    // Redirect only when the user has just authenticated (logged in)
    if (!prevIsAuthenticated.current && isAuthenticated) {
      switch (persona) {
        case 'auditor':
          navigateTo('audit-checklist');
          break;
        case 'officer':
          navigateTo('monitoring-dashboard');
          break;
        case 'consumer':
        case 'umkm':
        default:
          navigateTo('home');
          break;
      }
    }
    // Update the ref to the current value for the next render
    prevIsAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, persona, navigateTo]);

  const handlePersonaSelect = (personaId: PersonaId) => {
    selectPersona(personaId);
    if (personaId !== 'consumer' && personaId !== 'guest') {
      navigateTo('login');
    }
  };

  const handleContinueAsGuest = () => {
    selectPersona('guest');
  };

  const handleSearch = (scope: 'products' | 'certificates' | 'map', query: string) => {
    setGlobalQuery(query);
    setSearchScope(scope);
    triggerGlobalSearch();

    if (scope === 'map') {
      setMapSearchQuery(query);
      navigateTo('map');
    } else if (scope === 'certificates') {
      navigateTo('cert-check');
    } else { // products or all
      navigateTo('marketplace');
    }
  };

  const renderPage = () => {
    if (selectedProductId) {
      const product = products.find(p => p.id === selectedProductId);
      return product ? <ProductDetailPage product={product} onBack={() => setSelectedProductId(null)} /> : <div>{t('app.productNotFound')}</div>;
    }

    if (selectedNewsId) {
        const newsArticle = news.find(n => n.id === selectedNewsId);
        return newsArticle ? <NewsDetailPage article={newsArticle} onBack={() => setSelectedNewsId(null)} /> : <div>{t('app.newsNotFound')}</div>;
    }
    
    if (selectedStoryId) {
        const story = stories.find(s => s.id === selectedStoryId);
        return story ? <StoryDetailPage story={story} onBack={() => setSelectedStoryId(null)} /> : <div>{t('app.storyNotFound')}</div>;
    }
    
    const authPages = (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
            {currentPage === 'login' && <LoginPage onNavigate={navigateTo} />}
            {currentPage === 'register' && <RegisterPage onNavigate={navigateTo} />}
            {currentPage === 'forgot-password' && <ForgotPasswordPage onNavigate={navigateTo} />}
        </div>
    );
    
    if (['login', 'register', 'forgot-password'].includes(currentPage)) {
        return authPages;
    }

    switch (currentPage) {
        case 'home':
            return (
              <>
                <Hero />
                <ServicesMenu onNavigate={navigateTo} />
                <MainCarousel onStorySelect={id => setSelectedStoryId(id)} />
                <Promotions />
                <NewsFeed onNewsSelect={id => setSelectedNewsId(id)} />
              </>
            );
        case 'hana': return <HanaPage />;
        case 'cert-check': return <CertificationCheckPage />;
        case 'ingredient-validator': return <IngredientValidatorPage />;
        case 'marketplace': return <MarketplacePage onProductSelect={id => setSelectedProductId(id)} />;
        case 'profile': return <ProfilePage onLogout={handleLogout} />;
        case 'news': return <NewsPage onNewsSelect={id => setSelectedNewsId(id)} />;
        case 'promotions': return <PromotionsPage />;
        case 'supplier-verification': return <SupplierVerificationPage />;
        case 'scan-barcode': return <ScanBarcodePage />;
        case 'more': return <MoreServicesPage onNavigate={navigateTo} />;
        case 'regulation': return <RegulationPage />;
        case 'map': return <MapPage query={mapSearchQuery} />;
        case 'about': return <AboutPage />;
        case 'self-declare': return <SelfDeclarePage />;
        case 'audit-checklist': return <AuditChecklistPage />;
        case 'audit-log': return <AuditLogPage />;
        case 'halal-verification': return <HalalVerificationPage onNavigate={navigateTo} />;
        case 'monitoring-dashboard': return <MonitoringDashboardPage />;
        case 'faq': return <FAQPage />;
        case 'privacy-policy': return <PrivacyPolicyPage />;
        case 'terms-of-service': return <TermsOfServicePage />;
        case 'task-list': return <TaskListPage />;
        default:
            return (
              <>
                <Hero />
                <ServicesMenu onNavigate={navigateTo} />
                <MainCarousel onStorySelect={id => setSelectedStoryId(id)} />
                <Promotions />
                <NewsFeed onNewsSelect={id => setSelectedNewsId(id)} />
              </>
            );
    }
  };

  const isAuthPage = ['login', 'register', 'forgot-password'].includes(currentPage);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
      {!isAuthPage && <Header onNavigate={navigateTo} onBasketClick={() => setIsBasketOpen(true)} onSearch={handleSearch} />}
      <main className={!isAuthPage ? "pt-24 sm:pt-28 pb-24" : ""}>
        {renderPage()}
      </main>
      {!persona && <PersonaSelectionModal onSelect={handlePersonaSelect} onContinueAsGuest={handleContinueAsGuest} />}
      <BasketModal isOpen={isBasketOpen} onClose={() => setIsBasketOpen(false)} />
      {!isAuthPage && <Footer onNavigate={navigateTo} />}
      {!isAuthPage && <BottomNav onNavigate={navigateTo} currentPage={currentPage} />}
    </div>
  );
};
// FIX: Add default export to resolve import error in index.tsx.
export default App;