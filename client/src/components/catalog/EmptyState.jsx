import { Link } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import Button from '../ui/Button';

const EmptyState = ({ hasFilters, onReset }) => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-xl font-display font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            {hasFilters ? 'Sin resultados' : 'Sin productos'}
        </h3>
        <p className="text-neutral-500 max-w-xs mb-6">
            {hasFilters
                ? 'No encontramos productos con los filtros seleccionados. Intenta con otras opciones.'
                : 'Aún no hay productos disponibles en esta sección.'}
        </p>
        {hasFilters && (
            <Button variant="secondary" onClick={onReset}>
                <X size={16} /> Limpiar filtros
            </Button>
        )}
    </div>
);

export default EmptyState;
