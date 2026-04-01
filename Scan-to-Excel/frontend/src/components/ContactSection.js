import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactSection = ({ darkMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.error) setStatus({ ...status, error: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ ...status, error: 'Please fill in all fields' });
      return;
    }

    setStatus({ ...status, loading: true, error: null });

    // Frontend-only simulation: mimic a 1.5s network delay
    setTimeout(() => {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '', message: '' });

        // Auto-reset success message after 5 seconds
        setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className={`w-full py-24 px-6 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-glow-neon">Touch</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-lg font-light ${darkMode ? 'text-white/50' : 'text-gray-500'}`}
          >
            Have a question or want to report an issue? We're here to help.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Email Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`p-10 rounded-[32px] border transition-all duration-300 h-full ${darkMode ? 'bg-[#0a0a0a]/80 border-white/5 shadow-2xl backdrop-blur-xl' : 'bg-white border-gray-100 shadow-xl'
              }`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Us</h3>
            </div>

            <div className="space-y-2">
              <p className={`text-lg font-medium transition-colors ${darkMode ? 'text-white/80 hover:text-blue-400' : 'text-gray-800 hover:text-blue-600'} cursor-pointer`}>
                24wadhers@rbunagpur.in
              </p>
              <p className={`text-sm font-light ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>Response time: Usually within 24 hours</p>
            </div>


          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`lg:col-span-2 p-10 rounded-[32px] border transition-all duration-300 relative overflow-hidden ${darkMode ? 'bg-[#0a0a0a]/80 border-white/5 shadow-2xl backdrop-blur-xl' : 'bg-white border-gray-100 shadow-xl'
              }`}
          >
            <AnimatePresence mode="wait">
              {status.success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Message Sent!</h3>
                  <p className={`${darkMode ? 'text-white/50' : 'text-gray-500'}`}>Thank you for reaching out. We'll get back to you shortly.</p>
                  <button
                    onClick={() => setStatus({ ...status, success: false })}
                    className="mt-8 text-blue-400 font-medium hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status.error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 text-sm"
                    >
                      <AlertCircle size={16} />
                      {status.error}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-left">
                      <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Name</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        placeholder="John Doe"
                        className={`w-full px-6 py-4 rounded-2xl border transition-all duration-300 outline-none ${darkMode
                          ? 'bg-[#111] border-white/5 text-white focus:border-blue-500/50'
                          : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-blue-300'
                          }`}
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Email</label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="john@example.com"
                        className={`w-full px-6 py-4 rounded-2xl border transition-all duration-300 outline-none ${darkMode
                          ? 'bg-[#111] border-white/5 text-white focus:border-blue-500/50'
                          : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-blue-300'
                          }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell us more about your project..."
                      className={`w-full px-6 py-4 rounded-2xl border transition-all duration-300 outline-none resize-none ${darkMode
                        ? 'bg-[#111] border-white/5 text-white focus:border-blue-500/50'
                        : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-blue-300'
                        }`}
                    />
                  </div>

                  <div className="flex justify-start">
                    <motion.button
                      disabled={status.loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className={`px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold flex items-center gap-3 shadow-lg shadow-blue-500/20 group ${status.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {status.loading ? 'Sending...' : 'Send Message'}
                      {!status.loading && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </motion.button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
