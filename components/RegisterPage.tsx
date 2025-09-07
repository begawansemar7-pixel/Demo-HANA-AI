import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { PERSONAS } from '../constants';
import InputField from './InputField';

interface RegisterPageProps {
    onNavigate: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
    const { register, persona } = useAuth();
    const { t } = useTranslations();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [emailLoading, setEmailLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const isLoading = emailLoading || googleLoading;

    const personaDetails = PERSONAS.find(p => p.id === persona);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (name === 'confirmPassword' && errors.confirmPassword) {
            setErrors(prev => ({...prev, confirmPassword: ''}));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = t('auth.nameRequired');
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('auth.invalidEmail');
        if (!formData.phone.trim()) newErrors.phone = t('auth.phoneRequired');
        if (!formData.password || formData.password.length < 8) newErrors.password = t('auth.passwordTooShort');
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('auth.passwordsDoNotMatch');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        setEmailLoading(true);
        // Simulate API call
        setTimeout(() => {
            register(formData);
            setEmailLoading(false);
        }, 1000);
    };

    const handleGoogleRegister = () => {
        setGoogleLoading(true);
        // Simulate API call for Google login
        setTimeout(() => {
            register({ name: 'Google User', email: 'user.example@gmail.com' });
            setGoogleLoading(false);
        }, 1000);
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl animate-fadein">
            <div className="text-center mb-8">
                {personaDetails && (
                     <div className="flex flex-col items-center mb-4 text-halal-green dark:text-accent-gold">
                        <div className="w-16 h-16">{personaDetails.icon}</div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2">
                            {t('auth.registerTitle')}{' '}
                            <span className="text-halal-green dark:text-accent-gold">{t(personaDetails.name)}</span>
                        </h1>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <InputField
                    id="name"
                    name="name"
                    label={t('auth.fullNameLabel')}
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('auth.fullNamePlaceholder')}
                    error={errors.name}
                />
                <InputField
                    id="email"
                    name="email"
                    label={t('auth.emailLabel')}
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('auth.emailPlaceholder')}
                    error={errors.email}
                />
                 <InputField
                    id="phone"
                    name="phone"
                    label={t('auth.phoneLabel')}
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('auth.phonePlaceholder')}
                    error={errors.phone}
                />
                <InputField
                    id="password"
                    name="password"
                    label={t('auth.passwordLabel')}
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('auth.passwordPlaceholder')}
                    error={errors.password}
                />
                <InputField
                    id="confirmPassword"
                    name="confirmPassword"
                    label={t('auth.confirmPasswordLabel')}
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    error={errors.confirmPassword}
                />
                <div>
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-halal-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-halal-green disabled:opacity-50">
                        {emailLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                        {emailLoading ? t('auth.loading') : t('auth.registerButton')}
                    </button>
                </div>
            </form>
            
             <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm font-semibold">{t('auth.orDivider')}</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-halal-green disabled:opacity-50"
            >
                {googleLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.357-11.303-8H6.306C9.656 35.663 16.318 40 24 40z"></path>
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.853 44 30.273 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                    </svg>
                )}
                {googleLoading ? t('auth.loading') : t('auth.registerWithGoogle')}
            </button>
            
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                {t('auth.haveAccount')}{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className="font-medium text-halal-green dark:text-accent-gold hover:text-green-700 dark:hover:text-yellow-300">
                    {t('auth.loginLink')}
                </a>
            </p>
        </div>
    );
};

export default RegisterPage;
