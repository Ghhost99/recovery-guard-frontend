import React, { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.jpg";
import NotificationBell from "./Notification";
import { isAuthenticated, logout } from "../utils/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTranslateLoaded, setIsTranslateLoaded] = useState(false);
  const [showLanguageSaved, setShowLanguageSaved] = useState(false);
  const navigate = useNavigate();

  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'pl', name: 'Polski' },
    { code: 'nl', name: 'Nederlands' }
  ];

  // Cookie utilities
  const setCookie = (name, value, days = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  // Show language saved notification
  const showLanguageSavedNotification = () => {
    setShowLanguageSaved(true);
    setTimeout(() => setShowLanguageSaved(false), 3000);
  };

  // Initialize Google Translate
  useEffect(() => {
    // Load saved language preference
    const savedLanguage = getCookie('selectedLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }

    // Check if Google Translate is already loaded
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      console.log('Google Translate already loaded');
      initializeTranslateWidget(savedLanguage);
      return;
    }

    // Initialize Google Translate
    const initializeTranslateWidget = (savedLang) => {
      try {
        console.log('Initializing Google Translate widget');
        
        // Clear any existing widget
        const existingWidget = document.getElementById('google_translate_element');
        if (existingWidget) {
          existingWidget.innerHTML = '';
        }

        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: languages.map(lang => lang.code).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          },
          'google_translate_element'
        );
        
        console.log('Google Translate widget initialized');
        setIsTranslateLoaded(true);
        
        // Apply saved language after widget is ready
        if (savedLang && savedLang !== 'en') {
          setTimeout(() => {
            console.log('Applying saved language:', savedLang);
            changeLanguageDirectly(savedLang);
          }, 3000);
        }
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
        setIsTranslateLoaded(false);
      }
    };

    // Load Google Translate script
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      console.log('Loading Google Translate script');
      
      // Create a unique callback name to avoid conflicts
      const callbackName = 'googleTranslateInit' + Date.now();
      
      window[callbackName] = () => {
        console.log('Google Translate script loaded');
        initializeTranslateWidget(savedLanguage);
        // Clean up the callback
        delete window[callbackName];
      };
      
      const script = document.createElement('script');
      script.src = `https://translate.google.com/translate_a/element.js?cb=${callbackName}`;
      script.async = true;
      script.onerror = (error) => {
        console.error('Failed to load Google Translate script:', error);
        setIsTranslateLoaded(false);
        delete window[callbackName];
      };
      
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Clean up any remaining callbacks
      Object.keys(window).forEach(key => {
        if (key.startsWith('googleTranslateInit')) {
          delete window[key];
        }
      });
    };
  }, []);

  // Change language function that directly manipulates the Google Translate dropdown
  const changeLanguageDirectly = (langCode) => {
    console.log('Attempting to change language to:', langCode);
    
    // Wait for the widget to be fully loaded
    const maxAttempts = 10;
    let attempts = 0;
    
    const attemptChange = () => {
      const googleTranslateCombo = document.querySelector('.goog-te-combo');
      
      if (googleTranslateCombo) {
        console.log('Found Google Translate dropdown, changing language');
        googleTranslateCombo.value = langCode;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        googleTranslateCombo.dispatchEvent(event);
        
        // Also try triggering with different event types
        googleTranslateCombo.dispatchEvent(new Event('input', { bubbles: true }));
        
        return true;
      } else {
        console.log('Google Translate dropdown not found, attempt:', attempts + 1);
        attempts++;
        
        if (attempts < maxAttempts) {
          setTimeout(attemptChange, 500);
        } else {
          console.error('Failed to find Google Translate dropdown after', maxAttempts, 'attempts');
        }
        
        return false;
      }
    };
    
    attemptChange();
  };

  // Change language function called by our custom dropdown
  const changeLanguage = (langCode) => {
    console.log('User selected language:', langCode);
    
    if (!isTranslateLoaded) {
      console.log('Google Translate not loaded yet');
      return;
    }
    
    setSelectedLanguage(langCode);
    setCookie('selectedLanguage', langCode);
    
    // Show notification for non-English languages
    if (langCode !== 'en') {
      showLanguageSavedNotification();
    }
    
    // Apply the translation
    setTimeout(() => {
      changeLanguageDirectly(langCode);
    }, 100);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const authNavItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Submit Case", path: "/submit-case" },
    { label: "My Cases", path: "/cases" },
    { label: "Support", path: "/support" },
    { label: "FAQ", path: "/faq" },
    { label: "Logout", path: "/logout", onClick: handleLogout },
  ];

  const guestNavItems = [
    { label: "Home", path: "/" },
    { label: "FAQ", path: "/faq" },
    { label: "Login", path: "/login" },
    { label: "SignUp", path: "/signup" },
  ];

  const navItems = isAuthenticated() ? authNavItems : guestNavItems;

  const renderButton = (item) => (
    <button
      key={item.label}
      onClick={() => {
        item.onClick ? item.onClick() : handleNavigate(item.path);
      }}
      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-blue-600 transition w-full text-left md:w-auto md:text-center"
    >
      {item.label}
    </button>
  );

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      {/* Language Saved Notification */}
      {showLanguageSaved && (
        <div className="fixed top-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          Language preference saved! 🌐
        </div>
      )}
      
      <nav className="bg-transparent backdrop-blur-md text-white p-4 flex justify-between items-center border-black bg-black/70 border-2 shadow-md relative z-40">
        {/* Logo */}
        <div className="flex flex-row-reverse items-center justify-between">
          <h1
            className="text-xl font-bold cursor-pointer mr-4"
            onClick={() => handleNavigate("/")}
          >
            Safe Trust Recovery
          </h1>
          <img src={logoImage} alt="Recovery Guard" className="max-h-10 w-auto" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.label}>{renderButton(item)}</li>
            ))}
          </ul>
          
          {/* Language Selector */}
          <div className="relative group">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition border border-gray-600 group-hover:border-blue-500">
              <Globe className={`w-4 h-4 ${isTranslateLoaded ? 'text-blue-400' : 'text-gray-400'}`} />
              <select
                value={selectedLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-white text-sm cursor-pointer outline-none appearance-none pr-4"
                disabled={!isTranslateLoaded}
                style={{ minWidth: '100px' }}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-gray-800 text-white">
                    {lang.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Loading indicator */}
            {!isTranslateLoaded && (
              <div className="absolute inset-0 bg-gray-800 bg-opacity-75 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {isAuthenticated() && (
            <div className="ml-4">
              <NotificationBell />
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute top-16 right-4 w-48 bg-gray-800 text-white shadow-lg rounded-lg md:hidden border border-gray-600 z-50">
            <ul className="flex flex-col space-y-2 px-2 py-2">
              {navItems.map((item) => (
                <li key={item.label}>{renderButton(item)}</li>
              ))}
              
              {/* Mobile Language Selector */}
              <li>
                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600">
                  <Globe className={`w-4 h-4 ${isTranslateLoaded ? 'text-blue-400' : 'text-gray-400'}`} />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="bg-transparent text-white text-sm cursor-pointer outline-none flex-1"
                    disabled={!isTranslateLoaded}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-gray-800 text-white">
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </li>

              {isAuthenticated() && (
                <li className="flex justify-center pt-2">
                  <NotificationBell />
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      <style jsx>{`
        /* Hide Google Translate branding and banner */
        .goog-te-banner-frame {
          display: none !important;
        }
        
        body {
          top: 0 !important;
        }
        
        .goog-te-gadget {
          display: none !important;
        }
        
        .goog-te-menu-frame {
          max-height: 400px !important;
          overflow-y: auto !important;
        }

        /* Improve select styling */
        select option {
          padding: 8px 12px;
        }
        
        /* Custom scrollbar for select dropdown */
        select::-webkit-scrollbar {
          width: 8px;
        }
        
        select::-webkit-scrollbar-track {
          background: #374151;
        }
        
        select::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 4px;
        }
        
        select::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
};

export default Navbar;