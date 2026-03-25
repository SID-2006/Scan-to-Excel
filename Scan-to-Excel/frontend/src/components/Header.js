import React from 'react';
import { motion } from 'framer-motion';
import { ScanLine, History, Info, UploadCloud, ChevronRight } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full relative z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent pointer-events-none h-40"></div>
      
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative relative z-20">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-white/5 to-white/10 border border-white/10 group-hover:border-[#00f0ff]/50 transition-all duration-500 shadow-lg overflow-hidden">
            <ScanLine className="w-5 h-5 text-white group-hover:text-[#00f0ff] transition-colors relative z-10" />
            <div className="absolute inset-0 bg-[#00f0ff]/0 group-hover:bg-[#00f0ff]/20 blur-xl rounded-xl transition-all duration-500"></div>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white flex items-center">
            Scan<span className="text-white/50">Excel</span>
          </h1>
        </motion.div>

        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex items-center gap-8 bg-white/5 px-6 py-2.5 rounded-full border border-white/5 backdrop-blur-md"
        >
          <NavLink icon={<UploadCloud size={16} />} text="Upload" active />
          <NavLink icon={<History size={16} />} text="History" />
          <NavLink icon={<Info size={16} />} text="About" />
        </motion.nav>
      </div>

      {/* Hero Section embedded in header context for the landing vibe */}
      <div className="relative pt-32 pb-20 text-center overflow-hidden">
        {/* Cinematic Background effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[#00f0ff]/10 via-[#bb86fc]/5 to-transparent blur-[120px] -z-10 rounded-full animate-pulse-glow"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-8 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer backdrop-blur-xl"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
          </span>
          Scan to Excel 2.0 is now live 
          <ChevronRight size={14} className="text-white/40" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight text-white drop-shadow-2xl"
        >
          Transform Documents <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-400">into Structured</span>
          <span className="inline-block mx-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bb86fc] neon-text-glow">Data</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 px-4 font-light leading-relaxed"
        >
          Harness the power of AI to convert physical forms, invoices, and documents into clean Excel spreadsheets instantly with zero configuration.
        </motion.p>
      </div>
    </header>
  );
};

const NavLink = ({ icon, text, active }) => (
  <a href="#" className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${active ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-white/50 hover:text-white'}`}>
    {icon}
    <span>{text}</span>
  </a>
);

export default Header;
