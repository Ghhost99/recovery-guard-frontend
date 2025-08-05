import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LanguageSelector = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(Cookies.get('googtrans')?.split('/')[2] || 'en');
  const [error, setError] = useState(null);
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh-CN', name: '中文 (简体)' },
  ];

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;
    const retryDelay = 500; // 500ms between retries

    const checkGoogleTranslate = () => {
      // Check if Google Translate is available
      if (!window.google || !window.google.translate) {
        console.log(`Attempt ${retryCount + 1}: Google Translate not available yet`);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkGoogleTranslate, retryDelay);
          return;
        }
        setError('Translation service unavailable. Please disable ad blockers or try again later.');
        return;
      }

      // Look for the select element
      const select = document.querySelector('#google_translate_element select');
      if (!select) {
        console.log(`Attempt ${retryCount + 1}: Google Translate select element not found yet`);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkGoogleTranslate, retryDelay);
          return;
        }
        setError('Translation service unavailable. Please try again later.');
        return;
      }

      console.log('Google Translate initialized successfully');
      
      // Restore language from cookie
      const savedLang = Cookies.get('googtrans');
      if (savedLang) {
        const langCode = savedLang.split('/')[2] || 'en';
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
        setSelectedLanguage(langCode);
      }

      // Listen for language selection changes
      const handleChange = () => {
        const selectedLang = select.value;
        setSelectedLanguage(selectedLang);
        Cookies.set('googtrans', `/en/${selectedLang}`, { expires: 30 });
      };

      select.addEventListener('change', handleChange);
      
      // Cleanup function
      return () => {
        select.removeEventListener('change', handleChange);
      };
    };

    // Start checking
    const cleanup = checkGoogleTranslate();
    
    return cleanup;
  }, []); // Remove error from dependencies

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    const select = document.querySelector('#google_translate_element select');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      Cookies.set('googtrans', `/en/${langCode}`, { expires: 30 });
      setError(null); // Clear error on successful change
    } else {
      setError('Translation service unavailable. Please try again later.');
    }
  };

  const handleSave = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat font-montserrat" style={{ backgroundImage: "url('/src/assets/bg_2.JPG')" }}>
      <div className="w-full max-w-md bg-[#1F303F]/60 backdrop-blur-md p-8 rounded-lg shadow-lg border-2 border-black">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Select Your Language
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-600/80 text-white rounded-lg text-center">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
                selectedLanguage === lang.code
                  ? 'bg-blue-600 border-2 border-white'
                  : 'bg-gray-800 hover:bg-blue-600'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
        
        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;