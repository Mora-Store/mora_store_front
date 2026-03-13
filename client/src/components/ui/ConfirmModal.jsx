import Button from './Button';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = '¿Confirmar acción?', message, loading }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle size={28} className="text-red-500" />
            </div>
            <p className="text-neutral-900 dark:text-neutral-100">{message}</p>
            <div className="flex gap-3 w-full mt-2">
                <Button variant="ghost" className="flex-1" onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="danger" className="flex-1" onClick={onConfirm} disabled={loading}>
                    {loading ? 'Eliminando...' : 'Eliminar'}
                </Button>
            </div>
        </div>
    </Modal>
);

export default ConfirmModal;
