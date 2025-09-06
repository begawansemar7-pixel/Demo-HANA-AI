import { useTranslations } from './useTranslations';

export const useCurrency = () => {
  const { language } = useTranslations();

  const formatPrice = (value: number): string => {
    if (language === 'id') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return { formatPrice };
};
