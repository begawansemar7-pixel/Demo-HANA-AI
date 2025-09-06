export interface Service {
  id: string;
  title: string; // This will now be a translation key
  icon: React.ReactNode;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string; // The translated category name
  rawCategory: string; // The category key used for filtering
  date: string;
  url?: string; // The original external URL (optional now)
}

export interface Story {
  id: number;
  title: string;
  user: string;
  content: string;
  imageUrl: string;
}

export interface Persona {
    id: string;
    name: string; // Translation key
    description: string; // Translation key
    icon: React.ReactNode;
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  details: string;
  terms: string;
  expiry: string;
  cta: string;
  videoUrl?: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  producer: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export interface BasketItem extends Product {
  quantity: number;
}