import { useState, useEffect, useCallback } from 'react';
import { getProducts, getAdminProducts } from '../services/api';

/**
 * Hook to fetch products with optional filters
 * @param {Object} initialFilters
 * @param {boolean} isAdmin - if true, fetches all products (including unavailable)
 */
export const useProducts = (initialFilters = {}, isAdmin = false) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    const fetchProducts = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...filters, ...params };
            const res = isAdmin
                ? await getAdminProducts(mergedParams)
                : await getProducts(mergedParams);
            setProducts(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar productos');
        } finally {
            setLoading(false);
        }
    }, [filters, isAdmin]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    return { products, loading, error, refetch: fetchProducts, setFilters };
};
