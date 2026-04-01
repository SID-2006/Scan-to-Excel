import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, ChevronRight } from 'lucide-react';

const AboutSection = ({ darkMode }) => {
  return (
    <section className={`w-full py-32 px-6 relative overflow-hidden transition-colors duration-500`}>
      {/* Background glow effects */}
      <div className={`absolute -right-24 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -z-10`}></div>
      <div className={`absolute -left-24 bottom-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full -z-10`}></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        {/* Left Side: Content */}
        <div className="flex-1 text-left">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Revolutionizing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Document Workflow</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-lg font-light mb-12 max-w-xl leading-relaxed ${darkMode ? 'text-white/50' : 'text-gray-500'}`}
          >
            Born from the need to eliminate manual data entry, Scan-to-Excel combines state-of-the-art OCR with intelligent layout analysis to give you precise control over your physical data.
          </motion.p>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-6 group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-lg ${darkMode ? 'bg-[#111] border border-white/5 shadow-blue-500/10' : 'bg-white border border-gray-100 shadow-xl'}`}>
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Unmatched Accuracy</h3>
                <p className={`text-sm font-light leading-relaxed max-w-sm ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                  Our AI utilizes fine-grained grid mapping to ensure every cell is perfectly captured, even in complex nested forms.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-6 group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-lg ${darkMode ? 'bg-[#111] border border-white/5 shadow-purple-500/10' : 'bg-white border border-gray-100 shadow-xl'}`}>
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Lightning Speed</h3>
                <p className={`text-sm font-light leading-relaxed max-w-sm ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                  Process high-resolution scanned documents and multi-page PDFs in seconds, not minutes.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-6 group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-lg ${darkMode ? 'bg-[#111] border border-white/5 shadow-blue-500/10' : 'bg-white border border-gray-100 shadow-xl'}`}>
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Privacy First</h3>
                <p className={`text-sm font-light leading-relaxed max-w-sm ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                  Documents are processed securely with no long-term storage of your sensitive data unless specified.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Visual Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 relative"
        >
          {/* Main Card Container */}
          <div className={`relative p-10 rounded-[3rem] border transition-all duration-700 ${
            darkMode 
              ? 'bg-[#0f1115] border-white/5 shadow-[0_22px_70px_rgba(0,0,0,0.8)]' 
              : 'bg-white border-gray-100 shadow-2xl'
          }`}>
            
            {/* Top lines/Progress area */}
            <div className="space-y-8 mb-12">
              <div className="flex gap-3">
                <div className={`h-1.5 w-16 rounded-full ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                <div className={`h-1.5 w-24 rounded-full ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                <div className={`h-1.5 w-12 rounded-full ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
              </div>
              
              <div className="space-y-4">
                 {/* Half-length gradient bar */}
                 <div className="h-4 w-[50%] bg-gradient-to-r from-[#00f0ff] to-[#bb86fc] rounded-md shadow-[0_0_15px_rgba(0,240,255,0.3)]"></div>
                 {/* Full-length dark bar */}
                 <div className={`h-4 w-full rounded-md ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
              </div>
            </div>

            {/* Ready For Excel Inner Box */}
            <div className={`p-8 rounded-3xl border flex items-center justify-between transition-all duration-500 ${
              darkMode 
                ? 'bg-[#151921] border-[#00f0ff]/20 shadow-[0_0_40px_rgba(0,240,255,0.05)]' 
                : 'bg-blue-50/50 border-blue-100'
            }`}>
              <div className="flex items-center gap-5">
                {/* Excel Logo Block */}
                <div className="w-12 h-12 rounded-xl bg-[#00f0ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                   <span className="text-white font-black text-2xl italic tracking-tighter">X</span>
                </div>
                
                <span className={`font-black tracking-[0.2em] text-sm ${darkMode ? 'text-[#00f0ff]' : 'text-blue-600'}`}>
                  READY FOR EXCEL
                </span>
              </div>
              
              {/* Optional verification mark or chevron */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-white/5 text-[#00f0ff]' : 'bg-blue-100 text-blue-600'}`}>
                <ChevronRight size={18} />
              </div>
            </div>

            {/* Floating Target Icon */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className={`absolute top-8 right-8 w-14 h-14 rounded-2xl flex items-center justify-center border backdrop-blur-xl shadow-2xl ${
                darkMode ? 'bg-[#1a1c23] border-white/10' : 'bg-white border-gray-100'
              }`}
            >
              <Target className={`w-7 h-7 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </motion.div>
          </div>

          {/* Background glow behind the card */}
          <div className="absolute inset-0 bg-[#00f0ff]/10 blur-[100px] -z-10 rounded-full opacity-50 scale-75"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
