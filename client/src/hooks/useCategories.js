import { useState, useEffect } from 'react';
import { getCategories } from '../services/api';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await getCategories();
            setCategories(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    return { categories, loading, error, refetch: fetchCategories };
};
