import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, ChevronLeft, ArrowRight, Eye, Code, Users, CheckCircle2 } from 'lucide-react';

const AboutPage = ({ darkMode, setDarkMode, onBack }) => {
  // Simple scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-24 ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50"></div>
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className={`absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr ${darkMode ? 'from-blue-500/10 via-purple-500/5' : 'from-blue-200/20 via-purple-100/20'} to-transparent blur-[120px] rounded-full -z-10`}></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full border mb-8 bg-blue-500/5 border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            Our Mission
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
          >
            Liberating Data from <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600">Physical Constraints</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-xl font-light mb-8 max-w-2xl mx-auto leading-relaxed ${darkMode ? 'text-white/50' : 'text-gray-500'}`}
          >
            We're building the bridge between the physical and digital world, turning static documents into actionable, structured intelligence.
          </motion.p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold tracking-tight">The Story Behind <br /> Scan-to-Excel</h2>
            <div className={`space-y-6 text-lg font-light ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
              <p>
                In 2024, we noticed a persistent bottleneck across industries: the manual re-entry of data from physical forms. Despite digital advances, much of the world's ground-truth data remains trapped on paper.
              </p>
              <p>
                Scan-to-Excel was born from a simple obsession: What if you could click a picture and have a perfectly formatted spreadsheet in seconds? Not a rough markdown, but a production-ready Excel file.
              </p>
              <p>
                Our journey started with complex table detection algorithms and evolved into a production-grade AI pipeline that processes thousands of documents daily with industry-leading precision.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`p-12 rounded-[3rem] border transition-all duration-700 ${darkMode ? 'bg-[#0f1115] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-xl'}`}
          >
            <div className="space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                   <h4 className="font-bold text-xl">Computer Vision</h4>
                   <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Proprietary contour-mapping technology</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Code className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                   <h4 className="font-bold text-xl">Neural OCR</h4>
                   <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Multi-lingual character recognition</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                   <h4 className="font-bold text-xl">User-Centric Design</h4>
                   <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Zero configuration necessary for end users</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-24 px-6 ${darkMode ? 'bg-white/[0.02]' : 'bg-blue-50/30'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Core Principles</h2>
            <p className={`max-w-xl mx-auto font-light ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>We follow strict guidelines to ensure your data stays accurate, private, and usable.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Precision First", desc: "If we don't recognize a cell with 99.9% confidence, we flag it for human review." },
              { title: "Security by Default", desc: "All processing happens in transient memory. We never store copies of your documents." },
              { title: "Open Interoperability", desc: "Data is exported in standard formats to ensure it works anywhere, instantly." }
            ].map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{v.title}</h3>
                <p className={`font-light leading-relaxed ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className={`max-w-4xl mx-auto p-16 rounded-[4rem] text-center border overflow-hidden relative ${darkMode ? 'bg-blue-600 border-blue-400/50 shadow-2xl' : 'bg-blue-600 border-blue-400 text-white'}`}
        >
          {/* Internal Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
          
          <h2 className={`text-4xl md:text-5xl font-black mb-8 text-white`}>Ready to start digitizing?</h2>
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 mx-auto shadow-2xl transition-all ${
              darkMode ? 'bg-white text-blue-600' : 'bg-blue-900 text-white'
            }`}
          >
            Try it for free <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </section>

    </div>
  );
};

export default AboutPage;
