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
    name: 'Instagram',
    url: 'https://www.instagram.com/ayudacibernetica1?igsh=dzYzcXExOTMza2Vq',
    icon: <Instagram size={20} />,
    hoverColor: 'hover:text-pink-500'
  },
  {
    name: 'Telegram',
    url: 'https://t.me/recuperacionsegura',
    icon: <Send size={20} />,
    hoverColor: 'hover:text-blue-300'
  },
  {
    name: 'Twitter (X)',
    url: 'https://x.com/1Ciberseguridad?t=48PlVMhZ1BJDLTVEYIlVvw&s=09',
    icon: <Twitter size={20} />,
    hoverColor: 'hover:text-blue-400'
  }
];

const Footer = () => {
    const handleOpenLink = (url) => {
        console.log(`${url} clicked`)
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="flex items-center justify-center  p-4 w-full">
            <div className="bg-black border border-white rounded-2xl shadow-lg  w-full text-center backdrop-blur-md">
                <h1 className="text-4xl font-extrabold font-mono text-white mb-8">Talk To  Us</h1>
                <div className="flex justify-center gap-6 flex-wrap my-auto">
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

export default Footer;
