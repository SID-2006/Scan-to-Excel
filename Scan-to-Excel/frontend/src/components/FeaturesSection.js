import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Cpu, Download, Database } from 'lucide-react';

const FeaturesSection = ({ darkMode }) => {
  const features = [
    {
      title: "Instant OCR",
      description: "Powered by advanced AI models extracting tabular data directly from images and PDFs in seconds.",
      icon: <FileText className="w-6 h-6 text-[#00f0ff]" />,
      borderColor: "border-[#00f0ff]/20",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
      iconBg: "bg-[#00f0ff]/10"
    },
    {
      title: "High Accuracy",
      description: "State-of-the-art contour grids mapping and projection profiles to handle complex, nested form structures.",
      icon: <Cpu className="w-6 h-6 text-[#bb86fc]" />,
      borderColor: "border-[#bb86fc]/20",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(187,134,252,0.15)]",
      iconBg: "bg-[#bb86fc]/10"
    },
    {
      title: "Excel Export",
      description: "Download cleanly formatted, structured Excel files that are ready for immediate analysis and use.",
      icon: <Download className="w-6 h-6 text-[#00f0ff]" />,
      borderColor: "border-[#00f0ff]/20",
      glowColor: "group-hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
      iconBg: "bg-[#00f0ff]/10"
    }
  ];

  return (
    <section className={`w-full py-24 px-6 relative overflow-hidden transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 ${
             darkMode ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-purple-100 border-purple-200 text-purple-600'
           }`}
        >
          <Database size={12} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Powering Productivity</span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`text-4xl md:text-6xl font-black mb-6 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
        >
          Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bb86fc] neon-text-glow">Performance</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`max-w-2xl mx-auto mb-16 text-lg font-light leading-relaxed ${darkMode ? 'text-white/50' : 'text-gray-500'}`}
        >
          Our core features are designed to save you hours of manual data entry, providing high-accuracy and structured consistency.
        </motion.p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.8,
                delay: 0.1 * idx,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
              whileHover={{ y: -12, scale: 1.02 }}
              className={`group flex flex-col items-start text-left p-10 rounded-[32px] border transition-all duration-500 cursor-pointer ${
                darkMode 
                  ? `${feature.borderColor} bg-[#0a0a0a]/50 backdrop-blur-md hover:bg-[#111] ${feature.glowColor}` 
                  : 'bg-white border-gray-100 hover:shadow-2xl shadow-sm hover:border-blue-100'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/5 shadow-inner transition-transform duration-500 group-hover:rotate-6 ${feature.iconBg}`}>
                {feature.icon}
              </div>
              <h3 className={`text-2xl font-bold mb-4 tracking-tight transition-colors ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-blue-500`}>
                {feature.title}
              </h3>
              <p className={`text-base leading-relaxed font-light transition-colors ${darkMode ? 'text-white/40 group-hover:text-white/60' : 'text-gray-500 group-hover:text-gray-700'}`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dynamic Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
           animate={{ 
             y: [0, -40, 0],
             x: [0, 20, 0],
             rotate: [0, 10, 0]
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
           className={`absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[100px] ${darkMode ? 'bg-blue-500/10' : 'bg-blue-200/20'}`}
        ></motion.div>
        <motion.div
           animate={{ 
             y: [0, 50, 0],
             x: [0, -30, 0],
             rotate: [0, -10, 0]
           }}
           transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className={`absolute bottom-1/4 -right-20 w-[500px] h-[500px] rounded-full blur-[120px] ${darkMode ? 'bg-purple-500/10' : 'bg-purple-200/20'}`}
        ></motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
