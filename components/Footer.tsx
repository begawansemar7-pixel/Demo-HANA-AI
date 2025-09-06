import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const SocialIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-halal-green hover:text-white transition-colors">
    {children}
  </a>
);

interface FooterProps {
    onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslations();
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 pb-24 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h4 className="font-bold text-lg mb-2">{t('footer.about.title')}</h4>
            <p className="text-sm text-gray-600">{t('footer.about.description')}</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">{t('footer.links.title')}</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li><button onClick={() => onNavigate('about')} className="hover:text-halal-green">{t('footer.links.about')}</button></li>
              <li><a href="#" className="hover:text-halal-green">{t('footer.links.faq')}</a></li>
              <li><a href="#" className="hover:text-halal-green">{t('footer.links.privacy')}</a></li>
              <li><a href="#" className="hover:text-halal-green">{t('footer.links.terms')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">{t('footer.contact.title')}</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>{t('footer.contact.hotline')}</li>
              <li>{t('footer.contact.email')}</li>
              <li>{t('footer.contact.address')}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-center">{t('footer.social.title')}</h4>
            <div className="flex justify-center space-x-3">
              <SocialIcon><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z"/></svg></SocialIcon>
              <SocialIcon><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.359-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.359-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg></SocialIcon>
              <SocialIcon><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.627l-5.21-6.815-6.041 6.815h-3.308l7.748-8.786-8.252-10.714h6.78l4.572 6.033 5.5-6.033zm-2.843 18.26h1.573l-11.45-15.034h-1.755l11.632 15.034z"/></svg></SocialIcon>
              <SocialIcon><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></SocialIcon>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;