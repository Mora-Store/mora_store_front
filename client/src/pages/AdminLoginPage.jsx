import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AdminLoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.username, form.password);
            navigate('/adminpanel/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Credenciales incorrectas.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAD4B4] via-[#FFF8F3] to-[#EDD9C8] dark:from-[#1A1410] dark:via-[#2A2018] dark:to-[#1A1410] flex items-center justify-center p-4">
            {/* Decorative blobs */}
            <div className="fixed top-0 right-0 w-96 h-96 bg-[#F5F5DC] text-neutral-900/20 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-72 h-72 bg-[#E5E5CB] text-neutral-900/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-sm">
                {/* Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-800">
                    {/* Logo / Brand */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-800 dark:bg-neutral-800 rounded-2xl mb-4">
                            <Lock size={28} className="text-neutral-900 dark:text-[#F5F5DC]" />
                        </div>
                        <h1 className="font-display text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            Panel Admin
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">Acceso restringido</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 translate-y-1 text-neutral-500 z-10" />
                            <Input
                                label="Usuario"
                                type="text"
                                placeholder="usuario"
                                value={form.username}
                                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                                className="pl-10"
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-[38px] text-neutral-500 z-10" />
                            <div className="relative">
                                <Input
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    className="pl-10 pr-10"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3 top-1/2 translate-y-1/2 text-neutral-500 hover:text-neutral-900 dark:text-[#F5F5DC] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'Ingresar'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
