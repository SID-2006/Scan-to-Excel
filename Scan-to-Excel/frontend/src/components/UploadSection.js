import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, Image as ImageIcon, X } from 'lucide-react';

const UploadSection = ({ onFileSelect, darkMode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    // Only accept images and PDFs
    if (file.type.includes('image') || file.type.includes('pdf')) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      alert("Please upload an image or PDF file.");
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-8">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`relative cursor-pointer group rounded-3xl border border-dashed transition-all duration-500 overflow-hidden ${
              isDragging 
                ? (darkMode ? 'border-[#00f0ff] bg-[#00f0ff]/5 neon-border-blue scale-[1.02]' : 'border-blue-500 bg-blue-50 scale-[1.02]')
                : (darkMode ? 'border-white/20 hover:border-white/40 bg-[#111111]/80 hover:bg-[#151515]/90 shadow-2xl' : 'border-gray-200 hover:border-blue-400 bg-white shadow-xl')
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {/* Cinematic Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${darkMode ? 'from-[#00f0ff]/5 via-transparent to-[#bb86fc]/5' : 'from-blue-100/10 via-transparent to-indigo-100/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept="image/*,.pdf"
            />
            
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center relative z-20">
              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className={`w-24 h-24 mb-8 rounded-full bg-gradient-to-tr ${darkMode ? 'from-[#00f0ff]/20 to-[#bb86fc]/20' : 'from-blue-100 to-indigo-100'} flex items-center justify-center p-[1px] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-shadow duration-500`}
              >
                <div className={`w-full h-full rounded-full ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white'} backdrop-blur-xl flex items-center justify-center group-hover:bg-[#111]/80 transition-colors`}>
                  <Upload className={`w-10 h-10 transition-colors duration-500 ${isDragging ? (darkMode ? 'text-[#00f0ff]' : 'text-blue-500') : (darkMode ? 'text-white/50 group-hover:text-white' : 'text-gray-400 group-hover:text-blue-600')}`} />
                </div>
              </motion.div>
              
              <h3 className={`text-3xl font-semibold mb-3 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {isDragging ? 'Drop it like it\'s hot' : 'Upload your document'}
              </h3>
              <p className={`mb-8 max-w-md font-light leading-relaxed ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                Drag and drop your invoices, receipts, or forms here. We support JPEG, PNG, and PDF formats up to 50MB.
              </p>
              
              <div className="relative group/btn">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${darkMode ? 'from-[#00f0ff] to-[#bb86fc]' : 'from-blue-400 to-indigo-400'} rounded-full blur opacity-30 group-hover/btn:opacity-70 transition duration-500 group-hover/btn:duration-200`}></div>
                <button className={`relative px-8 py-3.5 rounded-full ${darkMode ? 'bg-[#111] hover:bg-black border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm'} font-medium transition-all duration-300`}>
                  Select Files
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden rounded-2xl border ${darkMode ? 'glass-panel border-white/10' : 'bg-white border-gray-200 shadow-lg'}`}
          >
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${darkMode ? 'from-[#00f0ff] to-[#bb86fc]' : 'from-blue-500 to-blue-700'}`}></div>
            
            <div className="flex items-center gap-6 w-full">
              <div className={`w-16 h-16 rounded-xl border flex items-center justify-center ${darkMode ? 'bg-white/5 border-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
                {selectedFile.type.includes('image') ? (
                  <ImageIcon className={`w-8 h-8 ${darkMode ? 'text-[#bb86fc]' : 'text-indigo-500'}`} />
                ) : (
                  <File className={`w-8 h-8 ${darkMode ? 'text-[#00f0ff]' : 'text-blue-500'}`} />
                )}
              </div>
              
              <div className="flex-1 min-w-0 flex-col">
                <h4 className={`text-lg font-medium truncate w-full pr-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedFile.name}
                </h4>
                <div className={`flex items-center gap-3 text-sm mt-1 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`}></span>
                  <span className="uppercase">{selectedFile.type.split('/')[1] || 'FILE'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={clearFile}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10 text-white/50 hover:text-red-400' : 'hover:bg-red-50 hover:text-red-500 text-gray-400'}`}
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Background glowing particles effect */}
            <div className={`absolute -right-20 -bottom-20 w-40 h-40 ${darkMode ? 'bg-[#00f0ff]/10' : 'bg-blue-100/20'} blur-3xl rounded-full`}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default UploadSection;
