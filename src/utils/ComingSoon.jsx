import React from 'react';
import { Clock, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Socials = () => {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <a href="#" className="text-white hover:text-blue-400 transition-colors">
        <Facebook size={20} />
      </a>
      <a href="#" className="text-white hover:text-blue-400 transition-colors">
        <Twitter size={20} />
      </a>
      <a href="#" className="text-white hover:text-blue-400 transition-colors">
        <Instagram size={20} />
      </a>
      <a href="#" className="text-white hover:text-blue-400 transition-colors">
        <Linkedin size={20} />
      </a>
      <a href="#" className="text-white hover:text-blue-400 transition-colors">
        <Github size={20} />
      </a>
    </div>
  );
};

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 max-w-md w-full text-center backdrop-blur-md">
        <div className="flex justify-center mb-6">
          <Clock className="w-10 h-10 text-blue-400 animate-spin" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Coming Soon</h1>
        <p className="mt-4 text-lg text-gray-300">We are working hard to bring you this feature.</p>
        <p className="mt-2 text-lg text-gray-300">Stay tuned!</p>
        
        {/* Video or image placeholder */}
        <div className="my-6 bg-black w-full h-48 rounded-md flex items-center justify-center">
          <img src="/api/placeholder/320/180" alt="Coming soon feature preview" />
        </div>
        
        <div className="mt-8">
          <a
            href="/"
            className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all inline-block"
          >
            Go Back Home
          </a>
        </div>
        
        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-2">Connect With Us</h3>
          <Socials />
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;