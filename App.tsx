import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MainCarousel from './components/MainCarousel';
import ServicesMenu from './components/ServicesMenu';
import NewsFeed from './components/NewsFeed';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import HanaChat from './components/HanaChat';
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
import HalalVerificationPage from './components/HalalVerificationPage';
import MonitoringDashboardPage from './components/MonitoringDashboardPage';


const App: React.FC = () => {
  const [isHanaChatOpen, setIsHanaChatOpen] = useState(false);
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

  const navigateTo = (page: string) => {
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
    setSelectedNewsId(null);
    setSelectedStoryId(null);
    setCurrentPage(page);
  };
  
  const handleProductSelect = (id: number) => {
    setSelectedProductId(id);
    setCurrentPage('product-detail');
    window.scrollTo(0, 0);
  };

  const handleNewsSelect = (id: number) => {
    setSelectedNewsId(id);
    setCurrentPage('news-detail');
    window.scrollTo(0, 0);
  };
  
  const handleStorySelect = (id: number) => {
    setSelectedStoryId(id);
    setCurrentPage('story-detail');
    window.scrollTo(0, 0);
  };

  const handleBackToMarketplace = () => {
    setSelectedProductId(null);
    setCurrentPage('marketplace');
    window.scrollTo(0, 0);
  };
  
  const handleBackToNews = () => {
    setSelectedNewsId(null);
    navigateTo('news');
  };

  const handleBackToHome = () => {
    setSelectedStoryId(null);
    navigateTo('home');
  };

  const handleGlobalSearch = (scope: 'products' | 'certificates' | 'map', query: string) => {
      // The query is set to the context in GlobalSearch component,
      // so MarketplacePage and CertificationCheckPage can use it.
      switch (scope) {
        case 'map':
            setMapSearchQuery(query);
            navigateTo('map');
            break;
        case 'products':
            navigateTo('marketplace');
            break;
        case 'certificates':
            navigateTo('cert-check');
            break;
      }
  };
  
  if (!persona) {
    return <PersonaSelectionModal 
      onSelect={(p) => { selectPersona(p); setCurrentPage('login'); }}
      onContinueAsGuest={() => { selectPersona('guest'); setCurrentPage('home'); }} 
    />;
  }
  
  if (!isAuthenticated && persona !== 'guest') {
    const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="relative min-h-screen font-poppins text-gray-800 dark:text-gray-200 flex items-center justify-center p-4 overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 scale-110"
                style={{ backgroundImage: "url('https://picsum.photos/seed/beautiful-mosque-halal/1920/1080')" }}
            />
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/60 backdrop-blur-sm" />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );

    if (currentPage === 'register') {
      return <AuthLayout><RegisterPage onNavigate={navigateTo} /></AuthLayout>;
    }
    if (currentPage === 'forgot-password') {
        return <AuthLayout><ForgotPasswordPage onNavigate={navigateTo} /></AuthLayout>;
    }
    return <AuthLayout><LoginPage onNavigate={navigateTo} /></AuthLayout>;
  }

  const pagesWithGrayBg = [
    'hana',
    'cert-check',
    'ingredient-validator',
    'halal-verification',
    'marketplace',
    'product-detail',
    'news',
    'news-detail',
    'story-detail',
    'promotions',
    'profile',
    'supplier-verification',
    'scan-barcode',
    'self-declare',
    'audit-checklist',
    'monitoring-dashboard',
    'more',
    'regulation',
    'map',
    'about',
  ];

  const isHomePage = !pagesWithGrayBg.includes(currentPage);
  const mainBgClass = isHomePage ? 'bg-halal-pattern' : 'bg-gray-50 dark:bg-gray-800';


  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero />
            <MainCarousel onStorySelect={handleStorySelect} />
            <ServicesMenu onNavigate={navigateTo} />
            <Promotions />
            <NewsFeed onNewsSelect={handleNewsSelect}/>
          </>
        );
      case 'hana':
        return <HanaPage />;
      case 'cert-check':
        return <CertificationCheckPage />;
      case 'ingredient-validator':
        return <IngredientValidatorPage />;
      case 'halal-verification':
        return <HalalVerificationPage onNavigate={navigateTo} />;
      case 'marketplace':
        return <MarketplacePage onProductSelect={handleProductSelect} />;
      case 'product-detail':
        const selectedProduct = products.find(p => p.id === selectedProductId);
        return selectedProduct 
          ? <ProductDetailPage product={selectedProduct} onBack={handleBackToMarketplace} /> 
          : <MarketplacePage onProductSelect={handleProductSelect} />; // Fallback
       case 'news':
        return <NewsPage onNewsSelect={handleNewsSelect} />;
      case 'news-detail':
        const selectedNews = news.find(n => n.id === selectedNewsId);
        return selectedNews 
          ? <NewsDetailPage article={selectedNews} onBack={handleBackToNews} /> 
          : <NewsPage onNewsSelect={handleNewsSelect} />; // Fallback
      case 'story-detail':
        const selectedStory = stories.find(s => s.id === selectedStoryId);
        return selectedStory
          ? <StoryDetailPage story={selectedStory} onBack={handleBackToHome} />
          : ( // Fallback to home if story not found
              <>
                <Hero />
                <MainCarousel onStorySelect={handleStorySelect} />
                <ServicesMenu onNavigate={navigateTo} />
                <Promotions />
                <NewsFeed onNewsSelect={handleNewsSelect}/>
              </>
          );
      case 'promotions':
        return <PromotionsPage />;
      case 'profile':
        return <ProfilePage onLogout={handleLogout} />;
      case 'supplier-verification':
        return <SupplierVerificationPage />;
      case 'scan-barcode':
        return <ScanBarcodePage />;
      case 'self-declare':
        return <SelfDeclarePage />;
      case 'audit-checklist':
        return <AuditChecklistPage />;
      case 'monitoring-dashboard':
        return <MonitoringDashboardPage />;
      case 'more':
        return <MoreServicesPage onNavigate={navigateTo} />;
      case 'map':
        return <MapPage query={mapSearchQuery} />;
      case 'regulation':
        return <RegulationPage />;
      case 'about':
        return <AboutPage />;
      default:
        return (
             <>
                <Hero />
                <MainCarousel onStorySelect={handleStorySelect} />
                <ServicesMenu onNavigate={navigateTo} />
                <NewsFeed onNewsSelect={handleNewsSelect} />
            </>
        );
    }
  }


  return (
    <div className={`min-h-screen font-poppins text-gray-800 dark:text-gray-200 ${mainBgClass}`}>
      <Header 
        onNavigate={navigateTo} 
        onBasketClick={() => setIsBasketOpen(true)} 
        onSearch={handleGlobalSearch}
      />
      
      <main className="pt-24 pb-24 md:pb-0">
        {renderPage()}
      </main>
      
      <Footer onNavigate={navigateTo} />
      
      
      <BottomNav 
        currentPage={currentPage}
        onNavigate={navigateTo}
      />
      {/* HANA Floating Action Button */}
      <div id="hana-fab" className="fixed bottom-24 md:bottom-8 right-8 z-40">
         <HanaChat isOpen={isHanaChatOpen} onOpen={() => setIsHanaChatOpen(true)} onClose={() => setIsHanaChatOpen(false)} />
      </div>

      <BasketModal isOpen={isBasketOpen} onClose={() => setIsBasketOpen(false)} />
    </div>
  );
};

export default App;