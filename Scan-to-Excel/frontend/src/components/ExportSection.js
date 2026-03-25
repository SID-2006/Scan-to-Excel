import React from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';

const ExportSection = ({ onDownload, isDownloading }) => {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-20 mb-20 text-center relative z-10">
      {/* Background glow for the button area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-[#00f0ff] to-[#bb86fc] rounded-full blur-[120px] opacity-15 -z-10 animate-pulse-glow"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <h3 className="text-3xl font-bold mb-8 text-white tracking-tight drop-shadow-md">
          Your Data is Ready
        </h3>
        
        <div className="relative group/btn cursor-pointer">
          {/* Outer glow layer that expands on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff] via-[#bb86fc] to-[#0ff0fc] rounded-full blur-md opacity-40 group-hover/btn:opacity-100 transition duration-700 ease-out group-hover/btn:duration-300"></div>
          
          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="relative flex items-center justify-center gap-3 px-10 py-4 rounded-full font-semibold text-lg text-white bg-[#0f0f0f] border border-white/10 overflow-hidden transition-all duration-300 hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed group-hover/btn:border-white/20"
          >
            {/* Soft inner highlight */}
            <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none rounded-full"></span>
            
            <div className="relative z-10 flex items-center gap-3">
              {isDownloading ? (
                 <motion.div
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                 >
                   <Sparkles className="w-5 h-5 text-[#bb86fc]" />
                 </motion.div>
              ) : (
                 <Download className="w-5 h-5 text-[#00f0ff] group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
              )}
              
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 tracking-wide font-medium">
                {isDownloading ? 'Generating Excel...' : 'Download Spreadsheet'}
              </span>
            </div>
            
            {/* Shimmer effect inside button */}
            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-30deg] group-hover/btn:animate-shine z-10"></div>
          </button>
        </div>

        <p className="mt-8 text-sm text-white/40 font-light max-w-sm px-4">
          Exported as a clean `.xlsx` file fully compatible with Microsoft Excel and Google Sheets.
        </p>
      </motion.div>
    </section>
  );
};

export default ExportSection;
