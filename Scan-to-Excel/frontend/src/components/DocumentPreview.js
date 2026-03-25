import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Columns, LayoutPanelLeft, MousePointer2 } from 'lucide-react';
import DataCorrectionTable from './DataCorrectionTable';

const DocumentPreview = ({ file, tableData, onDataChange }) => {
  const [activeTab, setActiveTab] = useState('split'); // 'image', 'data', 'split'

  if (!file || !tableData) return null;

  const imageUrl = URL.createObjectURL(file);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden border border-white/10"
      >
        {/* Controls Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-[#00f0ff]" />
              Data Correction 
            </h3>
            <span className="text-xs px-2 py-1 rounded bg-white/5 text-white/50 border border-white/10 font-mono">
              Ready for review
            </span>
          </div>

          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <TabButton 
              icon={<LayoutPanelLeft size={16} />} 
              label="Original" 
              active={activeTab === 'image'} 
              onClick={() => setActiveTab('image')} 
            />
            <TabButton 
              icon={<Columns size={16} />} 
              label="Split View" 
              active={activeTab === 'split'} 
              onClick={() => setActiveTab('split')} 
            />
            <TabButton 
              icon={<LayoutList size={16} />} 
              label="Data Table" 
              active={activeTab === 'data'} 
              onClick={() => setActiveTab('data')} 
            />
          </div>
        </div>

        {/* Content Area */}
        <div className={`p-6 ${activeTab === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : ''}`}>
          
          {/* Image Panel */}
          <AnimatePresence mode="popLayout">
            {(activeTab === 'image' || activeTab === 'split') && (
              <motion.div
                key="image-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-[#050505]/80 rounded-2xl overflow-hidden border border-white/[0.05] h-[600px] flex items-center justify-center group shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]"
              >
                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-white/70 font-bold tracking-widest shadow-xl uppercase">
                  Scanned Document
                </div>
                
                {file.type.includes('image') ? (
                  <img src={imageUrl} alt="Uploaded document" className="max-w-full max-h-full object-contain p-6 group-hover:scale-[1.02] transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                ) : (
                  <div className="text-white/40 flex flex-col items-center">
                     <p className="mb-2 font-medium text-white/60">PDF Preview Unavailable</p>
                     <p className="text-sm font-light">Data extraction completed successfully.</p>
                  </div>
                )}
                
                {/* Floating scanner effect */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_25px_#00f0ff] opacity-0 group-hover:opacity-100 animate-scan"></div>
                {/* Refined inner glow */}
                <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Data Table Panel */}
          <AnimatePresence mode="popLayout">
            {(activeTab === 'data' || activeTab === 'split') && (
              <motion.div
                key="data-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-[600px] flex flex-col relative"
              >
                <div className="mb-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-white/70 font-bold tracking-widest shadow-xl inline-block w-max uppercase">
                  Extracted Spreadsheet
                </div>
                <div className="flex-1 overflow-auto rounded-2xl border border-white/[0.05] custom-scrollbar shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] bg-[#050505]/80 relative z-10">
                    <DataCorrectionTable data={tableData} onChange={onDataChange} />
                </div>
                {/* Subtle backglow for table */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00f0ff]/5 to-[#bb86fc]/5 blur-2xl -z-10 rounded-2xl opacity-50"></div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </section>
  );
};

const TabButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all duration-300 ${
      active 
        ? 'bg-gradient-to-r from-[#00f0ff]/20 to-[#bb86fc]/20 text-white shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
        : 'text-white/50 hover:text-white/90 hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="hidden sm:block">{label}</span>
  </button>
);

// Fallback icon import if layout-list is not available
function LayoutList(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <path d="M14 4h7" />
      <path d="M14 9h7" />
      <path d="M14 15h7" />
      <path d="M14 20h7" />
    </svg>
  );
}

export default DocumentPreview;
