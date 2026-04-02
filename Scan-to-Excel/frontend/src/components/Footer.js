import React from 'react';
import { motion } from 'framer-motion';
import { Github, ChevronRight, Zap } from 'lucide-react';

const Footer = ({ darkMode, setCurrentPage, onReset }) => {
  const handleScroll = (id) => {
    // If not on home page, go to home first
    if (typeof setCurrentPage === 'function') {
      setCurrentPage('home');
    }

    // Small delay to allow home page to render before scrolling
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 10);
  };

  const quickLinks = [
    { name: 'Get Started', id: 'start' },
    { name: 'Features', id: 'features' },
    { name: 'About', id: 'about' },
  ];

  const companyLinks = [
    { name: 'Knowledge Hub', id: 'blog' },
    { name: 'Contact', id: 'contact' },
  ];

  const legalLinks = [
    { name: 'Terms of Use', id: 'terms' },
    { name: 'Privacy Policy', id: 'privacy' },
  ];

  return (
    <footer className={`w-full pt-20 pb-10 px-6 transition-colors duration-500 overflow-hidden relative ${
      darkMode ? 'bg-[#050505] border-t border-white/5' : 'bg-gray-50 border-t border-gray-100'
    }`}>
      {/* Subtle background glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] blur-[150px] -z-10 opacity-20 ${
        darkMode ? 'bg-blue-500/20' : 'bg-blue-200/50'
      }`}></div>

      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand + Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleScroll('start')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className={`text-2xl font-black italic tracking-tighter ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Scan-to-<span className="text-blue-500">Excel</span>
              </h2>
            </div>
            <p className={`text-sm leading-relaxed font-light max-w-xs ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
              Transform documents into structured, actionable data in seconds using AI-powered OCR and intelligent processing.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://github.com/SID-2006/Scan-to-Excel"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  darkMode ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-blue-50 text-gray-400 hover:text-blue-600'
                }`}
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => handleScroll(link.id)}
                    className={`text-sm font-light flex items-center gap-1 transition-all group ${
                      darkMode ? 'text-white/40 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Company
            </h3>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => handleScroll(link.id)}
                    className={`text-sm font-light flex items-center gap-1 transition-all group ${
                      darkMode ? 'text-white/40 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + CTA */}
          <div className="flex flex-col h-full">
            <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Legal
            </h3>
            <ul className="space-y-4 mb-10">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <button className={`text-sm font-light transition-colors ${
                    darkMode ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onReset ? onReset() : handleScroll('start')}
                className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl transition-all ${
                  darkMode ? 'bg-white text-blue-600 shadow-white/5' : 'bg-blue-600 text-white shadow-blue-500/20'
                }`}
              >
                Get Started
              </motion.button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`pt-10 border-t flex flex-col md:flex-row justify-center items-center gap-6 ${
          darkMode ? 'border-white/5' : 'border-gray-100'
        }`}>
          <p className={`text-[12px] font-light ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
            © 2026 Scan-to-Excel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
