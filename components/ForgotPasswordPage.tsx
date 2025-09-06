import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import InputField from './InputField';

interface ForgotPasswordPageProps {
    onNavigate: (page: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
    const { t } = useTranslations();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email: string) => {
        if (!email) {
            return t('auth.emailRequired');
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return t('auth.invalidEmail');
        }
        return '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const error = validateEmail(email);
        setEmailError(error);

        if (!error) {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                setLoading(false);
                setIsSubmitted(true);
            }, 1000);
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl animate-fadein">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">{t('auth.forgotPasswordTitle')}</h1>
                {!isSubmitted && <p className="text-gray-600 mt-2">{t('auth.forgotPasswordSubtitle')}</p>}
            </div>
            {isSubmitted ? (
                <div className="text-center">
                    <p className="text-gray-700">{t('auth.resetLinkSent')}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <InputField
                        id="email-reset"
                        label={t('auth.emailLabel')}
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('auth.emailPlaceholder')}
                        error={emailError}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-halal-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-halal-green disabled:opacity-50"
                    >
                        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                        {loading ? t('auth.loading') : t('auth.sendResetLink')}
                    </button>
                </form>
            )}
             <p className="mt-8 text-center text-sm text-gray-600">
                <button onClick={() => onNavigate('login')} className="font-medium text-halal-green hover:text-green-700">
                    &larr; {t('auth.backToLogin')}
                </button>
            </p>
        </div>
    );
};

export default ForgotPasswordPage;