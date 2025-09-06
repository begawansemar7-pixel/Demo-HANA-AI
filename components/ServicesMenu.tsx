import React from 'react';
import { SERVICES } from '../constants';
import type { Service } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const { t } = useTranslations();
  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center justify-center text-center p-4 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer aspect-square w-28 flex-shrink-0"
    >
      <div className="text-halal-green">
        {service.icon}
      </div>
      <span className="mt-2 text-sm font-semibold text-gray-700">{t(service.title)}</span>
    </div>
  );
};

interface ServicesMenuProps {
  onNavigate: (page: string) => void;
}

const ServicesMenu: React.FC<ServicesMenuProps> = ({ onNavigate }) => {
  const { t } = useTranslations();
  const { persona } = useAuth();

  const handleServiceClick = (serviceId: string) => {
    onNavigate(serviceId);
  };

  const filteredServices = SERVICES.filter(service => {
    // Guests see all services to encourage exploration
    if (persona === 'guest') {
      return true;
    }
    // If a service has no specific personas, it's visible to all logged-in users.
    // If it has a personas array, check if the current persona is included.
    return !service.personas || service.personas.includes(persona!);
  });

  return (
    <section id="services-menu" className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{t('home.services.title')}</h2>
      
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
        {filteredServices.map(service => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            onClick={() => handleServiceClick(service.id)} 
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesMenu;