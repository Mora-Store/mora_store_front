import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem('catalog_currency') || 'PEN';
    });

    useEffect(() => {
        localStorage.setItem('catalog_currency', currency);
    }, [currency]);

    const toggleCurrency = () => {
        setCurrency(prev => prev === 'PEN' ? 'USD' : 'PEN');
    };

    return (
        <CurrencyContext.Provider value={{ currency, toggleCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('useCurrency debe usarse dentro de un CurrencyProvider');
    return context;
};
