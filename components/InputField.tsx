import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const EyeIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5 text-gray-500 dark:text-gray-400" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeOffIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5 text-gray-500 dark:text-gray-400" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  togglePasswordVisibility?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, error, labelProps, togglePasswordVisibility, type, ...props }) => {
  const { t } = useTranslations();
  const errorClasses = 'border-red-500 focus:ring-red-500';
  const defaultClasses = 'border-gray-300 dark:border-gray-600 focus:ring-halal-green dark:focus:ring-accent-gold';
  const hasToggle = !!togglePasswordVisibility;

  return (
    <div>
      <label 
        htmlFor={id} 
        {...labelProps} 
        className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${labelProps?.className || ''}`}
      >
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type={type}
          {...props}
          className={`block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 ${error ? errorClasses : defaultClasses} ${hasToggle ? 'pr-10' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {hasToggle && (
             <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={type === 'password' ? t('auth.showPassword') : t('auth.hidePassword')}
             >
                {type === 'password' ? <EyeIcon /> : <EyeOffIcon />}
            </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600" aria-live="assertive">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;