import React, { createContext, useState, useMemo, useEffect } from 'react';
import type { Product, BasketItem } from '../types';

interface BasketContextType {
  basketItems: BasketItem[];
  addToBasket: (product: Product) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromBasket: (productId: number) => void;
  clearBasket: () => void;
  totalItems: number;
  totalPrice: number;
}

export const BasketContext = createContext<BasketContextType | undefined>(undefined);

const BASKET_STORAGE_KEY = 'halalAdvisorBasket';

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [basketItems, setBasketItems] = useState<BasketItem[]>(() => {
        try {
            const localData = localStorage.getItem(BASKET_STORAGE_KEY);
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Could not parse basket items from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basketItems));
        } catch (error) {
            console.error("Could not save basket items to localStorage", error);
        }
    }, [basketItems]);

    const addToBasket = (product: Product) => {
        setBasketItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                // If item exists, increase quantity
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // Otherwise, add new item with quantity 1
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromBasket(productId);
        } else {
            setBasketItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const removeFromBasket = (productId: number) => {
        setBasketItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const clearBasket = () => {
        setBasketItems([]);
    };

    const { totalItems, totalPrice } = useMemo(() => {
        const itemsCount = basketItems.reduce((total, item) => total + item.quantity, 0);
        const priceTotal = basketItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        return { totalItems: itemsCount, totalPrice: priceTotal };
    }, [basketItems]);


    return (
        <BasketContext.Provider value={{
            basketItems,
            addToBasket,
            updateQuantity,
            removeFromBasket,
            clearBasket,
            totalItems,
            totalPrice
        }}>
            {children}
        </BasketContext.Provider>
    );
};