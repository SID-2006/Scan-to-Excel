import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, Shield, ArrowRight } from 'lucide-react';

const BlogSection = ({ darkMode, onShowPost }) => {
  const posts = [
    {
      category: "TUTORIAL",
      title: "From Paper to Structured Data in Seconds",
      description: "Discover how modern AI-powered OCR systems convert messy scanned documents into clean, structured spreadsheets. Learn how accuracy, speed, and automation come together to eliminate manual work.",
      icon: <FileText className="w-6 h-6 text-blue-400" />,
      colorClass: "text-blue-400",
      bgClass: "bg-blue-500/10",
      borderColor: "border-blue-500/10"
    },
    {
      category: "INSIGHTS",
      title: "Building Smart Document Processing Pipelines",
      description: "Explore how intelligent pipelines combine OCR, validation, and data structuring to deliver production-ready outputs. A deep dive into scalable document automation systems.",
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      colorClass: "text-purple-400",
      bgClass: "bg-purple-500/10",
      borderColor: "border-purple-500/10"
    },
    {
      category: "SECURITY",
      title: "Ensuring Accuracy in Automated Data Extraction",
      description: "Learn the techniques behind high-precision data extraction, including error correction, validation layers, and AI-assisted cleanup for reliable results.",
      icon: <Shield className="w-6 h-6 text-green-400" />,
      colorClass: "text-green-400",
      bgClass: "bg-green-500/10",
      borderColor: "border-green-500/10"
    }
  ];

  return (
    <section className={`w-full py-24 px-6 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Knowledge <span className="text-blue-500">Hub</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`max-w-xl mx-auto text-lg font-light ${darkMode ? 'text-white/50' : 'text-gray-500'}`}
          >
            Everything you need to know about document automation, OCR accuracy, and spreadsheet management.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={idx}
              onClick={() => onShowPost(post.title)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8,
                delay: idx * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
              whileHover={{ y: -12, scale: 1.02 }}
              className={`flex flex-col rounded-[2.5rem] overflow-hidden border transition-all duration-500 group cursor-pointer ${darkMode ? 'bg-[#050505] border-white/5 hover:border-blue-500/30' : 'bg-white border-gray-100 hover:shadow-2xl'
                }`}
            >
              {/* Header Icon area */}
              <div className={`h-56 flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-white/[0.01]' : 'bg-gray-50'} group-hover:bg-blue-500/5`}>
                <div className={`p-4 rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${post.bgClass}`}>
                  {post.icon}
                </div>
              </div>

              {/* Content area */}
              <div className="p-10 flex flex-col flex-1">
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-4 ${post.colorClass}`}>
                  {post.category}
                </span>
                <h3 className={`text-2xl font-bold mb-4 leading-tight transition-colors group-hover:text-blue-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {post.title}
                </h3>
                <p className={`text-base font-light leading-relaxed mb-10 flex-1 transition-colors ${darkMode ? 'text-white/40 group-hover:text-white/60' : 'text-gray-500 group-hover:text-gray-700'}`}>
                  {post.description}
                </p>
                <div className={`flex items-center gap-2 text-sm font-bold text-blue-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
                  Read Full Article <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative backdrop */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-50">
         <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent`}></div>
      </div>
    </section>
  );
};

export default BlogSection;
