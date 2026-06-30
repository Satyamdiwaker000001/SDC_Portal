import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-retro-dark border-t-4 border-retro-dark py-12 px-4 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="text-center md:text-left">
          <h2 className="font-pixel text-2xl text-white mb-2">SHAASTRA</h2>
          <p className="font-sans text-gray-400 text-sm">
            &copy; 2026 Shaastra, IIT Madras. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 font-pixel text-xs">
          <a href="#" className="text-gray-400 hover:text-retro-cyan transition-colors">INSTAGRAM</a>
          <a href="#" className="text-gray-400 hover:text-retro-yellow transition-colors">TWITTER</a>
          <a href="#" className="text-gray-400 hover:text-retro-red transition-colors">LINKEDIN</a>
        </div>

        <div className="text-center md:text-right">
          <p className="font-pixel text-[10px] text-gray-600 mb-1">DESIGNED BY</p>
          <p className="font-pixel text-xs text-white">WEB OPS</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
