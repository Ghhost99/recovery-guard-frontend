import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white/5 text-white border-t border-white/10 backdrop-blur-md mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

        {/* Top Notice */}
        <div className="text-center py-3 border-b border-white/10 text-sm text-gray-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          {/* Recovery Guard */}
          <div>
            <h3 className="text-lg font-bold mb-4">Recovery Guard</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li className="mt-2"><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
            </ul>
          </div>

          {/* Banks */}
          <div>
            <h3 className="text-lg font-bold mb-4">Banks</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Talk to us</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li><a href="#" className="hover:text-white transition">Lorem ipsum</a></li>
              <li>
                <a href="mailto:dummyemail@example.com" className="hover:text-white transition">
                  dummyemail@example.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-white transition">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Info */}
        <div className="text-xs text-gray-400 border-t border-white/10 pt-6">
          <p className="leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vel urna ut leo ullamcorper pretium non ac nulla. 
            Vivamus tincidunt tortor felis, sed consequat urna placerat id. Curabitur facilisis tincidunt enim vel porttitor.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
