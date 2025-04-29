import React from 'react';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Github
} from 'lucide-react';

const Socials = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black/90 p-4">
            <div className="bg-white/5 border border-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center backdrop-blur-md">
                <h1 className="text-4xl font-extrabold text-white mb-8">Connect With Us</h1>
                <div className="flex justify-center gap-6 flex-wrap">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500 transition-all">
                        <Facebook size={32} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition-all">
                        <Twitter size={32} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500 transition-all">
                        <Instagram size={32} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-600 transition-all">
                        <Linkedin size={32} />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-all">
                        <Github size={32} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Socials;
