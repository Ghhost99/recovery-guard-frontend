import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LanguageSelector = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(Cookies.get('googtrans')?.split('/')[2] || 'en');

  // List of languages supported by Google Translate (partial list, expand as needed)
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh-CN', name: '中文 (简体)' },
    // Add more languages as needed
  ];

  // Initialize Google Translate
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: languages.map(lang => lang.code).join(','), // Restrict to listed languages
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    // Load Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup script on unmount
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    const select = document.querySelector('#google_translate_element select');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change')); // Trigger Google Translate change
      Cookies.set('googtrans', `/en/${langCode}`, { expires: 30 }); // Save for 30 days
    }
  };

  const handleSave = () => {
    navigate('/'); // Redirect to home
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat font-montserrat" style={{ backgroundImage: "url('/src/assets/bg_2.JPG')" }}>
      <div className="w-full max-w-md bg-[#1F303F]/60 backdrop-blur-md p-8 rounded-lg shadow-lg border-2 border-black">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Select Your Language
        </h1>
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
        {/* Hidden Google Translate element to handle translation logic */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
      </div>

      <style jsx>{`
        .goog-te-gadget {
          font-size: 0;
        }
        .goog-te-gadget > div {
          display: none;
        }
        .goog-te-gadget img {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default LanguageSelector;