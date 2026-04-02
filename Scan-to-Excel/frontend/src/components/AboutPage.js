import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, ChevronLeft, ChevronRight, ArrowRight, Eye, Code, Users, CheckCircle2 } from 'lucide-react';

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
                In a world driven by data, one major problem still persists — information locked in physical documents. Businesses continue to lose countless hours manually transferring data from paper to digital systems.
              </p>
              <p>
                Scan-to-Excel was built to eliminate this friction. Our goal was simple: transform a single image into a clean, structured, and fully usable spreadsheet within seconds.
              </p>
              <p>
                What started as an experiment in table recognition has evolved into a powerful AI-driven pipeline. Today, our system intelligently detects layouts, extracts data with precision, and delivers production-ready Excel files — instantly.
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
                   <h4 className="font-bold text-xl">Intelligent Vision Engine</h4>
                   <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Advanced layout detection that accurately identifies tables, grids, and document structures from complex images.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Code className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                   <h4 className="font-bold text-xl">AI-Powered Text Recognition</h4>
                   <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>High-accuracy OCR capable of extracting multilingual text with contextual understanding and minimal errors.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                   <h4 className="font-bold text-xl">Seamless User Experience</h4>
                   <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Designed for simplicity — upload, process, and download structured data with zero configuration.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Contribution & Contributors */}
      <section className={`py-24 px-6 border-y ${darkMode ? 'border-white/5 bg-white/[0.01]' : 'border-gray-100 bg-gray-50/30'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Community Contribution</h2>
            <p className={`text-lg font-light mb-16 leading-relaxed max-w-3xl mx-auto ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
              This project was developed as part of a community engagement program, aiming to solve real-world problems through technology and collaboration. It reflects a collective effort to build impactful solutions that improve efficiency and accessibility.
            </p>
            
            <div className="space-y-10">
              <div>
                <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Built with collaboration and innovation</p>
                <h3 className="text-3xl font-bold mb-10 tracking-tight">Contributors</h3>
              </div>

              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {['Siddhant Wadher', 'Nikhil Agrawal', 'Priyansh Agrawal'].map((name, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 mb-4 border border-white/5 shadow-xl transition-all group-hover:border-blue-500/30">
                      <Users size={28} />
                    </div>
                    <span className="font-bold text-xl mb-1 tracking-tight">{name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-24 px-6 ${darkMode ? 'bg-white/[0.02]' : 'bg-blue-50/30'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Principles</h2>
            <p className={`max-w-xl mx-auto font-light ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>We design every system with accuracy, trust, and real-world usability at its core.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Intelligence Over Extraction", desc: "We don’t just extract data — we understand structure, context, and relationships to deliver meaningful outputs." },
              { title: "Accuracy You Can Trust", desc: "Every data point is processed with high precision, validated through intelligent checks, and optimized for real-world reliability." },
              { title: "Built for Real Workflows", desc: "Our outputs are not raw dumps — they are clean, structured, and ready to integrate directly into your tools and processes." }
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

      {/* Enhanced Navigation CTA */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`max-w-4xl mx-auto p-16 rounded-[4rem] text-center border overflow-hidden relative shadow-2xl transition-all duration-500 group ${
            darkMode 
              ? 'bg-blue-600/10 border-blue-400/20 hover:bg-blue-600/[0.15] hover:shadow-blue-500/10' 
              : 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:shadow-blue-200/50'
          }`}
        >
          {/* Internal Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none group-hover:from-blue-500/10 transition-colors duration-500"></div>
          
          <h2 className={`text-5xl md:text-6xl font-black mb-6 tracking-tighter transition-colors duration-500 ${darkMode ? 'text-white' : 'text-blue-950'}`}>
            Ready to explore more?
          </h2>
          <p className={`text-lg font-light mb-12 max-w-2xl mx-auto transition-colors duration-500 ${darkMode ? 'text-white/60' : 'text-blue-800/70'}`}>
            Head back to the homepage and start transforming your documents into structured data with our AI-powered OCR.
          </p>

          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center gap-3 px-12 py-5 rounded-full font-bold text-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all group/btn ${
              darkMode 
                ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-white/5' 
                : 'bg-blue-950 text-white hover:bg-black'
            }`}
          >
            Get Started 
            <ChevronRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </section>

    </div>
  );
};

export default AboutPage;
