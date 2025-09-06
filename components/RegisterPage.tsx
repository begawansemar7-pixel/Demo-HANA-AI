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
        password: '',
        confirmPassword: '',
        businessName: '',
        businessId: '',
        lphName: '',
        auditorId: '',
        department: '',
        officerId: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const personaDetails = PERSONAS.find(p => p.id === persona);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on change
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
        if (!formData.password || formData.password.length < 8) newErrors.password = t('auth.passwordTooShort');
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('auth.passwordsDoNotMatch');

        switch(persona) {
            case 'umkm':
                if (!formData.businessName.trim()) newErrors.businessName = t('auth.businessNameRequired');
                if (!formData.businessId.trim()) newErrors.businessId = t('auth.businessIdRequired');
                break;
            case 'auditor':
                if (!formData.lphName.trim()) newErrors.lphName = t('auth.lphNameRequired');
                if (!formData.auditorId.trim()) newErrors.auditorId = t('auth.auditorIdRequired');
                break;
            case 'officer':
                if (!formData.department.trim()) newErrors.department = t('auth.departmentRequired');
                if (!formData.officerId.trim()) newErrors.officerId = t('auth.officerIdRequired');
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            register(formData);
            setLoading(false);
        }, 1000);
    };

    const renderPersonaFields = () => {
        switch (persona) {
            case 'umkm':
                return <>
                    <InputField
                        id="businessName"
                        name="businessName"
                        label={t('auth.businessNameLabel')}
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder={t('auth.businessNamePlaceholder')}
                        error={errors.businessName}
                    />
                    <InputField
                        id="businessId"
                        name="businessId"
                        label={t('auth.businessIdLabel')}
                        type="text"
                        required
                        value={formData.businessId}
                        onChange={handleChange}
                        placeholder={t('auth.businessIdPlaceholder')}
                        error={errors.businessId}
                    />
                </>;
            case 'auditor':
                 return <>
                    <InputField
                        id="lphName"
                        name="lphName"
                        label={t('auth.lphNameLabel')}
                        type="text"
                        required
                        value={formData.lphName}
                        onChange={handleChange}
                        placeholder={t('auth.lphNamePlaceholder')}
                        error={errors.lphName}
                    />
                    <InputField
                        id="auditorId"
                        name="auditorId"
                        label={t('auth.auditorIdLabel')}
                        type="text"
                        required
                        value={formData.auditorId}
                        onChange={handleChange}
                        placeholder={t('auth.auditorIdPlaceholder')}
                        error={errors.auditorId}
                    />
                </>;
            case 'officer':
                return <>
                    <InputField
                        id="department"
                        name="department"
                        label={t('auth.departmentLabel')}
                        type="text"
                        required
                        value={formData.department}
                        onChange={handleChange}
                        placeholder={t('auth.departmentPlaceholder')}
                        error={errors.department}
                    />
                    <InputField
                        id="officerId"
                        name="officerId"
                        label={t('auth.officerIdLabel')}
                        type="text"
                        required
                        value={formData.officerId}
                        onChange={handleChange}
                        placeholder={t('auth.officerIdPlaceholder')}
                        error={errors.officerId}
                    />
                </>;
            default:
                return null;
        }
    }

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl animate-fadein">
            <div className="text-center mb-8">
                {personaDetails && (
                     <div className="flex flex-col items-center mb-4 text-halal-green">
                        <div className="w-16 h-16">{personaDetails.icon}</div>
                        <h1 className="text-2xl font-bold text-gray-800 mt-2">
                            {t('auth.registerTitle')}{' '}
                            <span className="text-halal-green">{t(personaDetails.name)}</span>
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
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('auth.emailPlaceholder')}
                    error={errors.email}
                />
                {renderPersonaFields()}
                <InputField
                    id="password"
                    name="password"
                    label={t('auth.passwordLabel')}
                    type="password"
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
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    error={errors.confirmPassword}
                />
                <div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-halal-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-halal-green disabled:opacity-50">
                        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                        {loading ? t('auth.loading') : t('auth.registerButton')}
                    </button>
                </div>
            </form>
            <p className="mt-8 text-center text-sm text-gray-600">
                {t('auth.haveAccount')}{' '}
                <button onClick={() => onNavigate('login')} className="font-medium text-halal-green hover:text-green-700">
                    {t('auth.loginLink')}
                </button>
            </p>
        </div>
    );
};

export default RegisterPage;