import React from 'react';

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ id, label, error, labelProps, ...props }) => {
    const errorClasses = 'border-red-500 focus:ring-red-500 focus:border-red-500';
    const defaultClasses = 'border-gray-300 focus:ring-turquoise-blue focus:border-turquoise-blue';

    return (
        <div>
        <label 
            htmlFor={id} 
            {...labelProps} 
            className={`block text-sm font-medium text-gray-700 ${labelProps?.className || ''}`}
        >
            {label}
        </label>
        <textarea
            id={id}
            {...props}
            className={`mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${error ? errorClasses : defaultClasses}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && (
            <p id={`${id}-error`} className="mt-2 text-sm text-red-600" aria-live="assertive">
            {error}
            </p>
        )}
        </div>
    );
};

export default TextAreaField;
