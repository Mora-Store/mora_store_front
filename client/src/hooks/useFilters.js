import { useState, useCallback } from 'react';

/**
 * Manages catalog filter state (category, subcategory, search, price)
 */
export const useFilters = () => {
    const [filters, setFilters] = useState({
        category: '',
        subcategory: '',
        search: '',
        minPrice: '',
        maxPrice: '',
    });

    const updateFilter = useCallback((key, value) => {
        setFilters(prev => {
            const updated = { ...prev, [key]: value };
            // Reset subcategory when category changes
            if (key === 'category') updated.subcategory = '';
            return updated;
        });
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({ category: '', subcategory: '', search: '', minPrice: '', maxPrice: '' });
    }, []);

    // Build query params for API (exclude empty values)
    const apiParams = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
    );

    return { filters, updateFilter, resetFilters, apiParams };
};
