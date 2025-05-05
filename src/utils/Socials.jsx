import React from 'react';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Github,
    Send
} from 'lucide-react';

const socialLinks = [
    {
        name: 'Facebook',
        url: 'https://facebook.com',
        icon: <Facebook size={32} />,
        hoverColor: 'hover:text-blue-500'
    },
    {
        name: 'Twitter (X)',
        url: 'https://x.com/1Ciberseguridad?t=48PlVMhZ1BJDLTVEYIlVvw&s=09',
        icon: <Twitter size={32} />,
        hoverColor: 'hover:text-blue-400'
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/ayudacibernetica1?igsh=dzYzcXExOTMza2Vq',
        icon: <Instagram size={32} />,
        hoverColor: 'hover:text-pink-500'
    },
    {
        name: 'Telegram',
        url: 'https://t.me/recuperacionsegura',
        icon: <Send size={32} />,
        hoverColor: 'hover:text-blue-300'
    },
    {
        name: 'LinkedIn',
        url: 'https://linkedin.com',
        icon: <Linkedin size={32} />,
        hoverColor: 'hover:text-blue-600'
    },
    // GitHub can be added here if needed
];

const Socials = () => {
    const handleOpenLink = (url) => {
        alert("${url} clicked")
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black/90 p-4">
            <div className="bg-white/5 border border-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center backdrop-blur-md">
                <h1 className="text-4xl font-extrabold text-white mb-8">Connect With Us</h1>
                <div className="flex justify-center gap-6 flex-wrap">
                    {socialLinks.map(({ name, url, icon, hoverColor }) => (
                        <button
                            key={name}
                            onClick={() => handleOpenLink(url)}
                            className={`text-white ${hoverColor} transition-all`}
                            aria-label={name}
                            type="button"
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Socials;
