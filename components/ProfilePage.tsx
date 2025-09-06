import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { PERSONAS } from '../constants';

interface ProfilePageProps {
    onLogout: () => void;
}

const NotificationSettings: React.FC = () => {
    const { t } = useTranslations();
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
    const [isSupported, setIsSupported] = useState(false);
    
    useEffect(() => {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            setIsSupported(true);
            setPermissionStatus(Notification.permission);
        }
    }, []);

    const handleEnableNotifications = async () => {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
    };

    const handleSendTestNotification = async () => {
        if (Notification.permission === 'granted') {
            try {
                const swRegistration = await navigator.serviceWorker.ready;
                swRegistration.showNotification(t('profilePage.notifications.testTitle'), {
                    body: t('profilePage.notifications.testBody'),
                    icon: '/favicon.svg',
                    badge: '/favicon.svg'
                });
            } catch (error) {
                console.error('Error showing test notification:', error);
            }
        }
    };

    const renderContent = () => {
        switch (permissionStatus) {
            case 'granted':
                return (
                    <>
                        <p className="text-center text-gray-600 mb-4">{t('profilePage.notifications.enabledText')}</p>
                        <button
                            onClick={handleSendTestNotification}
                            className="w-full px-6 py-2 bg-white text-halal-green font-semibold rounded-full hover:bg-gray-100 transition-colors border border-gray-300"
                        >
                            {t('profilePage.notifications.sendTestButton')}
                        </button>
                    </>
                );
            case 'denied':
                 return (
                    <p className="text-center text-red-600 font-medium">{t('profilePage.notifications.deniedText')}</p>
                );
            case 'default':
            default:
                return (
                    <>
                        <p className="text-center text-gray-600 mb-4">{t('profilePage.notifications.description')}</p>
                        <button
                            onClick={handleEnableNotifications}
                            className="w-full px-8 py-3 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors shadow-md hover:shadow-lg"
                        >
                            {t('profilePage.notifications.enableButton')}
                        </button>
                    </>
                );
        }
    };

    if (!isSupported) {
        return null; // Don't render the component if notifications are not supported
    }

    return (
        <div className="mt-8 pt-8 border-t">
             <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">{t('profilePage.notifications.title')}</h2>
             {renderContent()}
        </div>
    );
};


const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout }) => {
    const { user, persona } = useAuth();
    const { t } = useTranslations();
    
    const personaDetails = PERSONAS.find(p => p.id === persona);

    if (!user || !personaDetails) {
        // This should not happen if routing is correct, but it's a good safeguard.
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Loading user profile...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fadein">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                     <div className="flex flex-col items-center mb-4 text-halal-green">
                        <div className="w-24 h-24 text-halal-green">
                           {personaDetails.icon}
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('auth.profileTitle')}</h1>
                </div>

                <div className="space-y-4 text-lg">
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold text-gray-600">{t('auth.fullNameLabel')}:</span>
                        <span className="text-gray-800">{user.name}</span>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold text-gray-600">{t('auth.emailLabel')}:</span>
                        <span className="text-gray-800">{user.email}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold text-gray-600">{t('personas.title')}:</span>
                        <span className="font-bold text-halal-green">{t(personaDetails.name)}</span>
                    </div>
                    {/* Add persona specific details here from user object if they exist */}
                </div>
                
                <NotificationSettings />

                <div className="mt-12 text-center">
                    <button
                        onClick={onLogout}
                        className="px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        {t('auth.logoutButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;