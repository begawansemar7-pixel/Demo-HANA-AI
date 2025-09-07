import React, { useState, useRef } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import InputField from './InputField';
import TextAreaField from './TextAreaField';

const SelfDeclarePage: React.FC = () => {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    businessName: '',
    businessId: '',
    businessAddress: '',
    productName: '',
    ingredients: '',
    supervisorName: '',
  });
  const [agreements, setAgreements] = useState({
    process: false,
    truth: false,
  });
  const [document, setDocument] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAgreements(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key as keyof typeof formData].trim()) {
        newErrors[key] = t('selfDeclare.form.errors.required');
      }
    });
    if (!agreements.process) newErrors.process = t('selfDeclare.form.errors.agreementRequired');
    if (!agreements.truth) newErrors.truth = t('selfDeclare.form.errors.agreementRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      setSubmissionId(Date.now().toString().slice(-6));
    }, 1500);
  };
  
  const handleNewApplication = () => {
      setIsSubmitted(false);
      setFormData({
        businessName: '',
        businessId: '',
        businessAddress: '',
        productName: '',
        ingredients: '',
        supervisorName: '',
      });
      setAgreements({ process: false, truth: false });
      setDocument(null);
      setErrors({});
      if(fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center p-8 bg-white rounded-2xl shadow-xl border">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-halal-green mb-4">{t('selfDeclare.success.title')}</h2>
          <p className="text-gray-600 mb-8">{t('selfDeclare.success.message', { productName: formData.productName, id: submissionId })}</p>
          <button
            onClick={handleNewApplication}
            className="px-8 py-3 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors shadow-lg"
          >
            {t('selfDeclare.success.newApplicationButton')}
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-halal-green">{t('selfDeclare.title')}</h1>
        <p className="text-lg text-gray-500 mt-2">{t('selfDeclare.subtitle')}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border space-y-8">
        {/* Business Information */}
        <fieldset>
          <legend className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">{t('selfDeclare.form.section1Title')}</legend>
          <div className="space-y-4">
            <InputField id="businessName" name="businessName" label={t('selfDeclare.form.businessNameLabel')} value={formData.businessName} onChange={handleChange} placeholder={t('selfDeclare.form.businessNamePlaceholder')} error={errors.businessName} required />
            <InputField id="businessId" name="businessId" label={t('selfDeclare.form.businessIdLabel')} value={formData.businessId} onChange={handleChange} placeholder={t('selfDeclare.form.businessIdPlaceholder')} error={errors.businessId} required />
            <TextAreaField id="businessAddress" name="businessAddress" label={t('selfDeclare.form.businessAddressLabel')} value={formData.businessAddress} onChange={handleChange} placeholder={t('selfDeclare.form.businessAddressPlaceholder')} error={errors.businessAddress} required />
          </div>
        </fieldset>

        {/* Product Details */}
        <fieldset>
          <legend className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">{t('selfDeclare.form.section2Title')}</legend>
          <div className="space-y-4">
            <InputField id="productName" name="productName" label={t('selfDeclare.form.productNameLabel')} value={formData.productName} onChange={handleChange} placeholder={t('selfDeclare.form.productNamePlaceholder')} error={errors.productName} required />
            <TextAreaField id="ingredients" name="ingredients" label={t('selfDeclare.form.ingredientsLabel')} value={formData.ingredients} onChange={handleChange} placeholder={t('selfDeclare.form.ingredientsPlaceholder')} error={errors.ingredients} rows={4} required />
          </div>
        </fieldset>

        {/* Halal Supervisor */}
        <fieldset>
          <legend className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">{t('selfDeclare.form.section3Title')}</legend>
          <InputField id="supervisorName" name="supervisorName" label={t('selfDeclare.form.supervisorNameLabel')} value={formData.supervisorName} onChange={handleChange} placeholder={t('selfDeclare.form.supervisorNamePlaceholder')} error={errors.supervisorName} required />
        </fieldset>

        {/* Declarations & Upload */}
        <fieldset>
          <legend className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">{t('selfDeclare.form.section4Title')}</legend>
          <div className="space-y-6">
            <div className={`relative p-4 rounded-lg ${errors.process ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'} border`}>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="process" name="process" type="checkbox" checked={agreements.process} onChange={handleAgreementChange} className="focus:ring-halal-green h-5 w-5 text-halal-green border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="process" className="font-medium text-gray-700">{t('selfDeclare.form.processStatement')}</label>
                </div>
              </div>
               {errors.process && <p className="mt-2 text-sm text-red-600">{errors.process}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('selfDeclare.form.uploadLabel')}</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-halal-green hover:text-green-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-halal-green">
                      <span>{t('selfDeclare.form.uploadButton')}</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} ref={fileInputRef} accept=".pdf,.png,.jpg,.jpeg" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">{document ? document.name : t('selfDeclare.form.uploadInstructions')}</p>
                </div>
              </div>
            </div>
          </div>
        </fieldset>

         {/* Final Declaration */}
        <fieldset>
          <legend className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">{t('selfDeclare.form.section5Title')}</legend>
          <div className={`relative p-4 rounded-lg ${errors.truth ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'} border`}>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="truth" name="truth" type="checkbox" checked={agreements.truth} onChange={handleAgreementChange} className="focus:ring-halal-green h-5 w-5 text-halal-green border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="truth" className="font-medium text-gray-700">{t('selfDeclare.form.truthStatement')}</label>
                </div>
              </div>
               {errors.truth && <p className="mt-2 text-sm text-red-600">{errors.truth}</p>}
            </div>
        </fieldset>
        
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors shadow-lg flex items-center justify-center disabled:opacity-50"
            >
              {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
              {loading ? t('selfDeclare.form.submittingButton') : t('selfDeclare.form.submitButton')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SelfDeclarePage;