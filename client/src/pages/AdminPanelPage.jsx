import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import {
    Package, Tags, Settings, LogOut, Plus, Edit2, Trash2,
    Star, Eye, EyeOff, ChevronRight, Sun, Moon, X, Upload, Image
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import Badge from '../components/ui/Badge';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl } from '../utils/whatsapp';
import { useCurrency } from '../context/CurrencyContext';
import EmojiPicker from 'emoji-picker-react';
import {
    getAdminProducts, createProduct, updateProduct, deleteProduct,
    uploadProductImages, deleteProductImage,
    getCategories, createCategory, updateCategory, deleteCategory,
    getSettings, updateSettings,
} from '../services/api';

const FILTER_ICONS = {
    mujer: '/icons/mujer.png',
    mujeres: '/icons/mujer.png',
    hombre: '/icons/hombre.png',
    hombres: '/icons/hombre.png',
    mascotas: '/icons/mascotas.png',
    ninos: '/icons/ninos.png',
    niños: '/icons/ninos.png',
    ropa: '/icons/ropa.png'
};

// ──────────────────────────────────────────────────────────────────────────────
// PRODUCTS TAB
// ──────────────────────────────────────────────────────────────────────────────
const ProductsTab = ({ categories }) => {
    const { currency } = useCurrency();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAdminProducts(search ? { search } : {});
            setProducts(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [search]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const openAdd = () => { setEditingProduct(null); setModalOpen(true); };
    const openEdit = (p) => { setEditingProduct(p); setModalOpen(true); };
    const handleSaved = () => { setModalOpen(false); fetchProducts(); };

    const handleDelete = async () => {
        setDeleting(true);
        try { await deleteProduct(deleteTarget._id); setDeleteTarget(null); fetchProducts(); }
        catch (e) { alert(e.response?.data?.message || 'Error al eliminar'); }
        finally { setDeleting(false); }
    };

    // Optimistic update: change star without table re-render
    const toggleFeatured = async (product) => {
        setProducts(prev =>
            prev.map(p => p._id === product._id ? { ...p, featured: !p.featured } : p)
        );
        try {
            await updateProduct(product._id, { featured: !product.featured });
        } catch (e) {
            // Revert on error
            setProducts(prev =>
                prev.map(p => p._id === product._id ? { ...p, featured: product.featured } : p)
            );
            console.error(e);
        }
    };

    // Optimistic update: change eye without table re-render
    const toggleAvailable = async (product) => {
        setProducts(prev =>
            prev.map(p => p._id === product._id ? { ...p, available: !p.available } : p)
        );
        try {
            await updateProduct(product._id, { available: !product.available });
        } catch (e) {
            setProducts(prev =>
                prev.map(p => p._id === product._id ? { ...p, available: product.available } : p)
            );
            console.error(e);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">Gestión de Productos</h2>
                    <p className="text-sm text-neutral-500">{products.length} producto(s) en total</p>
                </div>
                <Button onClick={openAdd} className="shrink-0">
                    <Plus size={16} /> Agregar Producto
                </Button>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="mb-4 w-full max-w-sm px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800
          bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100
          placeholder-[#9E8B7D] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] text-sm"
            />

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-sm">
                    <thead className="bg-neutral-100 dark:bg-neutral-800 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold">Imagen</th>
                            <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                            <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Categoría</th>
                            <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Precio</th>
                            <th className="text-center px-4 py-3 font-semibold">⭐</th>
                            <th className="text-center px-4 py-3 font-semibold">👁️</th>
                            <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDD9C8] dark:divide-[#3A3025]">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <div className="skeleton h-4 rounded w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : products.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-12 text-neutral-500">No hay productos</td></tr>
                        ) : products.map(p => (
                            <tr key={p._id} className="bg-white dark:bg-neutral-900 hover:bg-[#FFF8F3] dark:hover:bg-neutral-800 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 dark:bg-neutral-800 shrink-0">
                                        {p.images?.[0] ? (
                                            <img src={getImageUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg">👜</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">{p.name}</p>
                                    <p className="text-xs text-neutral-500 md:hidden">{p.category?.name} · {formatPrice(p.price, currency)}</p>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell text-neutral-500">
                                    {p.category?.name}{p.subcategory && ` · ${p.subcategory}`}
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell font-mono font-medium">
                                    <p className="text-neutral-900 dark:text-[#F5F5DC]">{formatPrice(p.price, currency)}</p>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button onClick={() => toggleFeatured(p)} title="Toggle destacado">
                                        <Star size={18} className={p.featured ? 'text-neutral-900 dark:text-[#F5F5DC] fill-neutral-900 dark:fill-[#F5F5DC]' : 'text-neutral-400 dark:text-[#3A3025]'} />
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button onClick={() => toggleAvailable(p)} title="Toggle disponible">
                                        {p.available
                                            ? <Eye size={18} className="text-emerald-500" />
                                            : <EyeOff size={18} className="text-neutral-500" />
                                        }
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openEdit(p)}
                                            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            <Edit2 size={15} className="text-neutral-500" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(p)}
                                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <Trash2 size={15} className="text-red-400" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Product Form Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
                title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'} size="lg">
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    onSaved={handleSaved}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Eliminar Producto"
                message={`¿Seguro que deseas eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

// ──────────────────────────────────────────────────────────────────────────────
// PRODUCT FORM (inside modal)
// ──────────────────────────────────────────────────────────────────────────────
const ProductForm = ({ product, categories, onSaved, onCancel }) => {
    const [form, setForm] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        discount: product?.discount || 0,
        category: product?.category?._id || product?.category || '',
        subcategory: product?.subcategory || '',
        featured: product?.featured || false,
        available: product?.available !== undefined ? product.available : true,
    });
    const [files, setFiles] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [imageMode, setImageMode] = useState('file'); // 'file' | 'url'
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [currentImages, setCurrentImages] = useState(product?.images || []);

    const selectedCategory = categories.find(c => c._id === form.category);
    const subcategories = selectedCategory?.subcategories || [];

    const set = (k, v) => setForm(p => {
        const n = { ...p, [k]: v };
        if (k === 'category') n.subcategory = '';
        return n;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            let saved;
            const data = { ...form, price: parseFloat(form.price) };
            if (product) {
                saved = await updateProduct(product._id, data);
            } else {
                saved = await createProduct(data);
            }

            // Upload new images if any
            if (imageMode === 'file' && files.length > 0) {
                setUploading(true);
                const fd = new FormData();
                files.forEach(f => fd.append('images', f));
                await uploadProductImages(saved.data._id, fd);
                setUploading(false);
            } else if (imageMode === 'url' && imageUrl.trim()) {
                // Save external URL directly into images array
                const existingImages = saved.data.images || [];
                await updateProduct(saved.data._id, {
                    images: [...existingImages, imageUrl.trim()],
                });
            }

            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar el producto.');
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    const handleRemoveImage = async (filename) => {
        try {
            if (filename.startsWith('http') || filename.includes('/')) {
                // For external URLs, just update the product's images array directly
                const newImages = currentImages.filter(i => i !== filename);
                await updateProduct(product._id, { images: newImages });
                setCurrentImages(newImages);
            } else {
                // For uploaded files, use the specific endpoint to delete the file
                await deleteProductImage(product._id, filename);
                setCurrentImages(prev => prev.filter(i => i !== filename));
            }
        } catch (e) { alert('Error al eliminar imagen'); }
    };

    const handleSetMainImage = async (filename) => {
        try {
            const newImages = [filename, ...currentImages.filter(i => i !== filename)];
            await updateProduct(product._id, { images: newImages });
            setCurrentImages(newImages);
        } catch (e) { alert('Error al actualizar imagen principal'); }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Nombre del producto *" value={form.name} onChange={e => set('name', e.target.value)} required />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Descripción</label>
                <textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800
            bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100
            placeholder-[#9E8B7D] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] text-sm resize-none"
                    placeholder="Descripción del producto..."
                />
            </div>

            {/* Price and Discount Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Precio (S/) *</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={e => set('price', e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800
                  bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100
                  focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] text-sm"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                        Descuento (%)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="5"
                        value={form.discount}
                        onChange={e => set('discount', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800
                  bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100
                  focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] text-sm"
                        placeholder="0"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Categoría *</label>
                    <select
                        value={form.category}
                        onChange={e => set('category', e.target.value)}
                        required
                        className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800
              bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100
              focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] text-sm"
                    >
                        <option value="">Seleccionar...</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Subcategoría</label>
                    <select
                        value={form.subcategory}
                        onChange={e => set('subcategory', e.target.value)}
                        disabled={!subcategories.length}
                        className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800
              bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100
              focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] text-sm
              disabled:opacity-50"
                    >
                        <option value="">Todas</option>
                        {subcategories.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
                {[
                    { label: '⭐ Destacado', key: 'featured' },
                    { label: '👁️ Disponible', key: 'available' },
                ].map(({ label, key }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                        <div
                            onClick={() => set(key, !form[key])}
                            className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${form[key] ? 'bg-[#F5F5DC] text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 dark:bg-neutral-800'}`}
                        >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-sm text-neutral-900 dark:text-neutral-100">{label}</span>
                    </label>
                ))}
            </div>

            {/* Current images */}
            {currentImages.length > 0 && (
                <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">Imágenes actuales</p>
                    <div className="flex gap-2 flex-wrap">
                        {currentImages.map((img, index) => (
                            <div key={img} className={`relative group w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-2 transition-all ${index === 0 ? 'border-neutral-900 dark:border-[#F5F5DC]' : 'border-transparent'}`}>
                                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetMainImage(img)}
                                            title="Establecer como principal"
                                            className="p-1 hover:bg-white/20 rounded"
                                        >
                                            <Star size={14} className="text-white" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(img)}
                                        title="Eliminar imagen"
                                        className="p-1 hover:bg-red-500/80 rounded"
                                    >
                                        <X size={14} className="text-white" />
                                    </button>
                                </div>
                                {index === 0 && (
                                    <div className="absolute top-0 left-0 bg-[#F5F5DC] text-neutral-900 dark:text-neutral-100 text-[10px] px-1.5 py-0.5 rounded-br-lg font-bold">
                                        Principal
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Image section */}
            <div>
                <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100 block mb-2">
                    {product ? 'Agregar imágenes' : 'Imágenes'}
                </label>

                {/* Mode switcher */}
                <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 dark:bg-neutral-800 rounded-xl mb-3 w-fit">
                    {[['file', '📁 Archivo'], ['url', '🔗 URL']].map(([mode, label]) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => setImageMode(mode)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${imageMode === mode
                                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-[#F5F5DC] shadow-sm'
                                : 'text-neutral-500 hover:text-neutral-900 dark:text-[#F5F5DC]'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {imageMode === 'file' ? (
                    <>
                        <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 cursor-pointer hover:border-neutral-900 dark:border-[#F5F5DC] transition-colors">
                            <Image size={20} className="text-neutral-500" />
                            <span className="text-sm text-neutral-500">
                                {files.length > 0 ? `${files.length} imagen(s) seleccionada(s)` : 'Seleccionar imágenes (jpg, png, webp)'}
                            </span>
                            <input type="file" accept="image/*" multiple className="hidden"
                                onChange={e => setFiles(Array.from(e.target.files))} />
                        </label>
                        {files.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {files.map((f, i) => (
                                    <img key={i} src={URL.createObjectURL(f)} alt="" className="w-16 h-16 rounded-xl object-cover" />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800
                                bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100
                                placeholder-[#9E8B7D] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] text-sm"
                        />
                        {imageUrl && (
                            <div className="mt-2 flex items-start gap-3">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-20 h-20 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800"
                                    onError={e => e.target.style.display = 'none'}
                                    onLoad={e => e.target.style.display = 'block'}
                                />
                                <p className="text-xs text-neutral-500 mt-1">Vista previa. Si no carga, verifica la URL.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 border border-neutral-200 dark:border-neutral-800">
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={saving || uploading}>
                    <Upload size={16} />
                    {saving ? (uploading ? 'Subiendo...' : 'Guardando...') : product ? 'Guardar cambios' : 'Crear producto'}
                </Button>
            </div>
        </form>
    );
};

// ──────────────────────────────────────────────────────────────────────────────
// CATEGORIES TAB
// ──────────────────────────────────────────────────────────────────────────────
const CategoriesTab = ({ categories, onRefresh }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [catForm, setCatForm] = useState({ name: '', icon: '📦', subcategories: [] });
    const [imageFile, setImageFile] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [newSub, setNewSub] = useState('');
    const [saving, setSaving] = useState(false);
    const [catError, setCatError] = useState('');

    const openAdd = () => {
        setEditingCat(null);
        setCatForm({ name: '', icon: '📦', subcategories: [] });
        setImageFile(null);
        setRemoveImage(false);
        setModalOpen(true);
    };
    const openEdit = (cat) => {
        setEditingCat(cat);
        setCatForm({ name: cat.name, icon: cat.icon, subcategories: cat.subcategories.map(s => s.name) });
        setImageFile(null);
        setRemoveImage(false);
        setModalOpen(true);
    };

    const handleSaveCat = async (e) => {
        e.preventDefault();
        setSaving(true);
        setCatError('');
        try {
            const formData = new FormData();
            formData.append('name', catForm.name);
            formData.append('icon', catForm.icon);
            formData.append('subcategories', JSON.stringify(catForm.subcategories.map(name => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-') }))));
            if (imageFile) formData.append('image', imageFile);
            if (removeImage) formData.append('removeImage', 'true');

            if (editingCat) await updateCategory(editingCat._id, formData);
            else await createCategory(formData);
            
            setModalOpen(false);
            onRefresh();
        } catch (err) {
            setCatError(err.response?.data?.message || 'Error al guardar');
        } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try { await deleteCategory(deleteTarget._id); setDeleteTarget(null); onRefresh(); }
        catch (e) { alert(e.response?.data?.message || 'Error al eliminar'); }
        finally { setDeleting(false); }
    };

    const addSub = () => {
        const t = newSub.trim();
        if (t && !catForm.subcategories.includes(t)) {
            setCatForm(p => ({ ...p, subcategories: [...p.subcategories, t] }));
            setNewSub('');
        }
    };
    const removeSub = (name) => setCatForm(p => ({ ...p, subcategories: p.subcategories.filter(s => s !== name) }));

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">Gestión de Categorías</h2>
                <Button onClick={openAdd}><Plus size={16} /> Nueva Categoría</Button>
            </div>

            <div className="grid gap-4">
                {categories.map(cat => {
                    const fallbackIcon = FILTER_ICONS[cat.slug?.toLowerCase()] || (cat.name && FILTER_ICONS[cat.name.toLowerCase()]);
                    return (
                    <div key={cat._id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                {cat.image ? (
                                    <div className="w-12 h-12 flex items-center justify-center mix-blend-multiply dark:mix-blend-screen bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                                        <img src={getImageUrl(cat.image)} alt={cat.name} className="w-8 h-8 object-contain dark:invert" />
                                    </div>
                                ) : fallbackIcon ? (
                                    <div className="w-12 h-12 flex items-center justify-center mix-blend-multiply dark:mix-blend-screen bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                                        <img src={fallbackIcon} alt={cat.name} className="w-8 h-8 object-contain dark:invert" />
                                    </div>
                                ) : (
                                    <span className="text-2xl">{cat.icon}</span>
                                )}
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{cat.name}</h3>
                                <Badge variant="muted">{cat.subcategories.length} subcategorías</Badge>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(cat)} className="p-2 rounded-lg hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors">
                                    <Edit2 size={15} className="text-neutral-500" />
                                </button>
                                <button onClick={() => setDeleteTarget(cat)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    <Trash2 size={15} className="text-red-400" />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {cat.subcategories.map(s => (
                                <span key={s._id || s.name} className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 dark:bg-neutral-800 text-neutral-900 dark:text-[#F5F5DC] text-xs rounded-full">
                                    {s.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )})}
            </div>

            {/* Category Form Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
                title={editingCat ? 'Editar Categoría' : 'Nueva Categoría'}>
                <form onSubmit={handleSaveCat} className="flex flex-col gap-4">
                    <div className="flex gap-3">
                        <div className="relative flex flex-col gap-1.5 w-1/3">
                            <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Imagen</label>
                            <label className="flex items-center justify-center gap-2 h-[42px] px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 cursor-pointer hover:border-neutral-900 dark:border-[#F5F5DC] transition-colors">
                                <Image size={16} className="text-neutral-500" />
                                <span className="text-sm text-neutral-500 truncate">
                                    {imageFile ? imageFile.name : (editingCat?.image && !removeImage ? 'Cambiar' : 'Subir')}
                                </span>
                                <input type="file" accept="image/*" className="hidden"
                                    onChange={e => {
                                        if (e.target.files[0]) {
                                            setImageFile(e.target.files[0]);
                                            setRemoveImage(false);
                                        }
                                    }} />
                            </label>
                            {editingCat?.image && !removeImage && !imageFile && (
                                <button type="button" onClick={() => setRemoveImage(true)} className="text-xs text-red-500 hover:underline mt-1 bg-transparent border-none p-0 cursor-pointer text-left">
                                    Quitar imagen actual
                                </button>
                            )}
                        </div>
                        <Input
                            label="Nombre de categoría *"
                            value={catForm.name}
                            onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))}
                            required
                            className="flex-1"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100 block mb-2">Subcategorías</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newSub}
                                onChange={e => setNewSub(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSub(); } }}
                                placeholder="Nueva subcategoría..."
                                className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800
                  bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100
                  placeholder-[#9E8B7D] focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-[#F5F5DC] text-sm"
                            />
                            <Button type="button" onClick={addSub} size="sm" variant="secondary"><Plus size={14} /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {catForm.subcategories.map(s => (
                                <span key={s} className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 dark:bg-neutral-800 text-neutral-900 dark:text-[#F5F5DC] text-sm rounded-full">
                                    {s}
                                    <button type="button" onClick={() => removeSub(s)}><X size={12} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {catError && <p className="text-red-500 text-sm">{catError}</p>}

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="flex-1 border border-neutral-200 dark:border-neutral-800">Cancelar</Button>
                        <Button type="submit" variant="primary" className="flex-1" disabled={saving}>
                            {saving ? 'Guardando...' : editingCat ? 'Guardar' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Eliminar Categoría"
                message={`¿Eliminar "${deleteTarget?.name}"? Si hay productos en esta categoría, no se podrá eliminar.`}
            />
        </div>
    );
};

// ──────────────────────────────────────────────────────────────────────────────
// SETTINGS TAB
// ──────────────────────────────────────────────────────────────────────────────
const SettingsTab = () => {
    const [form, setForm] = useState({ whatsappNumber: '', businessName: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getSettings().then(r => setForm({ whatsappNumber: r.data.whatsappNumber, businessName: r.data.businessName }))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            await updateSettings(form);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (e) { alert('Error al guardar'); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="skeleton h-40 rounded-2xl" />;

    return (
        <div>
            <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-6">Configuración</h2>
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-lg">
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <Input
                        label="Nombre del negocio"
                        value={form.businessName}
                        onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))}
                        placeholder="Mi Catálogo"
                    />
                    <div>
                        <Input
                            label="Número de WhatsApp"
                            value={form.whatsappNumber}
                            onChange={e => setForm(p => ({ ...p, whatsappNumber: e.target.value }))}
                            placeholder="5219991234567"
                        />
                        <p className="text-xs text-neutral-500 mt-1">Incluye código de país sin + (ej: 5219991234567)</p>
                    </div>

                    {success && (
                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
                            <p className="text-emerald-600 dark:text-emerald-400 text-sm">✅ Configuración guardada correctamente.</p>
                        </div>
                    )}

                    <Button type="submit" variant="primary" disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar configuración'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

// ──────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN PANEL PAGE
// ──────────────────────────────────────────────────────────────────────────────
const TABS = [
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'categories', label: 'Categorías', icon: Tags },
    { id: 'settings', label: 'Configuración', icon: Settings },
];

const AdminPanelPage = () => {
    const { user, logout, isAuthenticated, loading } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('products');
    const [categories, setCategories] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchCategories = useCallback(async () => {
        try { const r = await getCategories(); setCategories(r.data); }
        catch (e) { console.error(e); }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    if (loading) return (
        <div className="min-h-screen bg-[#FFF8F3] dark:bg-neutral-950 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-neutral-900 dark:border-[#F5F5DC] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!isAuthenticated) return <Navigate to="/adminpanel" replace />;

    return (
        <div className="min-h-screen bg-[#FFF8F3] dark:bg-neutral-950 flex transition-colors duration-300">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full w-64 z-30
        bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800
        flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="font-display font-bold text-xl text-neutral-900 dark:text-[#F5F5DC]">Panel Admin</p>
                    <p className="text-sm text-neutral-500 mt-1">Hola, {user?.username} 👋</p>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-1">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors
                  ${activeTab === tab.id
                                        ? 'bg-[#F5F5DC] text-neutral-900 dark:text-neutral-100 shadow-sm'
                                        : 'text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-800'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                                {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut size={18} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
                {/* Top bar */}
                <header className="sticky top-0 z-10 bg-[#FFF8F3]/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-6 h-16 flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-900 transition-colors"
                    >
                        <Package size={20} className="text-neutral-900 dark:text-neutral-100" />
                    </button>
                    <h1 className="font-display font-semibold text-neutral-900 dark:text-neutral-100">
                        {TABS.find(t => t.id === activeTab)?.label}
                    </h1>
                    <button
                        onClick={toggleTheme}
                        className="ml-auto p-2 rounded-xl hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-900 transition-colors"
                    >
                        {isDark ? <Sun size={18} className="text-neutral-900 dark:text-[#F5F5DC]" /> : <Moon size={18} className="text-neutral-500" />}
                    </button>
                </header>

                {/* Tab content */}
                <main className="flex-1 p-6">
                    {activeTab === 'products' && <ProductsTab categories={categories} />}
                    {activeTab === 'categories' && <CategoriesTab categories={categories} onRefresh={fetchCategories} />}
                    {activeTab === 'settings' && <SettingsTab />}
                </main>
            </div>
        </div>
    );
};

export default AdminPanelPage;
