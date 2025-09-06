import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { PERSONAS } from '../constants';
import InputField from './InputField';

interface LoginPageProps {
    onNavigate: (page: string) => void;
}

const REMEMBER_ME_KEY = 'rememberedEmail';

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
    const { login, persona } = useAuth();
    const { t } = useTranslations();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        const rememberedEmail = localStorage.getItem(REMEMBER_ME_KEY);
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    const personaDetails = PERSONAS.find(p => p.id === persona);
    
    const validate = () => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');

        // Basic email validation
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(t('auth.invalidEmail'));
            isValid = false;
        }

        // Basic password validation
        if (!password || password.length < 8) {
            setPasswordError(t('auth.passwordTooShort'));
            isValid = false;
        }
        
        return isValid;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            if (rememberMe) {
                localStorage.setItem(REMEMBER_ME_KEY, email);
            } else {
                localStorage.removeItem(REMEMBER_ME_KEY);
            }
            login({ email, password });
            setLoading(false);
        }, 1000);
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        // Simulate API call for Google login
        setTimeout(() => {
            login({ email: 'user.example@gmail.com' });
            setLoading(false);
        }, 1000);
    };

    const getLoginFieldProps = () => {
        switch (persona) {
            case 'auditor':
                return {
                    label: t('auth.emailOrAuditorIdLabel'),
                    placeholder: t('auth.emailOrAuditorIdPlaceholder'),
                    autoComplete: 'username'
                };
            case 'officer':
                 return {
                    label: t('auth.emailOrOfficerIdLabel'),
                    placeholder: t('auth.emailOrOfficerIdPlaceholder'),
                    autoComplete: 'username'
                };
            default:
                return {
                    label: t('auth.emailLabel'),
                    placeholder: t('auth.emailPlaceholder'),
                    autoComplete: 'email'
                };
        }
    }

    const loginFieldProps = getLoginFieldProps();

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl animate-fadein">
            <div className="text-center mb-8">
                {personaDetails && (
                    <div className="flex flex-col items-center mb-4 text-halal-green">
                        <div className="w-16 h-16">{personaDetails.icon}</div>
                        <h1 className="text-2xl font-bold text-gray-800 mt-2">
                            {t('auth.loginTitle')}{' '}
                            <span className="text-halal-green">{t(personaDetails.name)}</span>
                        </h1>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <InputField
                    id="email"
                    label={loginFieldProps.label}
                    name="email"
                    type="text"
                    autoComplete={loginFieldProps.autoComplete}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={loginFieldProps.placeholder}
                    error={emailError}
                />
                <InputField
                    id="password"
                    label={t('auth.passwordLabel')}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    error={passwordError}
                />
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-halal-green focus:ring-halal-green border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            {t('auth.rememberMe')}
                        </label>
                    </div>

                    <div className="text-sm">
                        <button type="button" onClick={() => onNavigate('forgot-password')} className="font-medium text-halal-green hover:text-green-700">
                            {t('auth.forgotPassword')}
                        </button>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-halal-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-halal-green disabled:opacity-50"
                    >
                         {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                         {loading ? t('auth.loading') : t('auth.loginButton')}
                    </button>
                </div>
            </form>

            <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm font-semibold">{t('auth.orDivider')}</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-halal-green disabled:opacity-50"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.357-11.303-8H6.306C9.656 35.663 16.318 40 24 40z"></path>
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.853 44 30.273 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                    </svg>
                )}
                {loading ? t('auth.loading') : t('auth.loginWithGoogle')}
            </button>

            <p className="mt-8 text-center text-sm text-gray-600">
                {t('auth.noAccount')}{' '}
                <button onClick={() => onNavigate('register')} className="font-medium text-halal-green hover:text-green-700">
                    {t('auth.registerLink')}
                </button>
            </p>
        </div>
    );
};

export default LoginPage;