import React from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Info, ChevronRight, Sun, Moon, Layout, Mail, FileText, Rocket, BookOpen } from 'lucide-react';

const Header = ({ darkMode, setDarkMode, setCurrentPage, currentPage, scaleX, onReset }) => {
  const [activeSection, setActiveSection] = React.useState('');

  const navItems = [
    { icon: <Rocket size={14} />, text: "Start", target: "#start" },
    { icon: <Layout size={14} />, text: "Features", target: "#features" },
    { icon: <BookOpen size={14} />, text: "Blog", target: "#blog" },
    { icon: <Info size={14} />, text: "About", target: "about" },
    { icon: <Mail size={14} />, text: "Contact", target: "#contact" },
  ];

  // Scroll Spy logic to highlight active section in Navbar
  React.useEffect(() => {
    if (currentPage !== 'home') {
      setActiveSection(currentPage === 'about' ? 'about' : '');
      return;
    }

    const handleScroll = () => {
      const sections = ['start', 'features', 'blog', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100; // Offset for detection

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleNavClick = (e, target, text) => {
    if (text === "About") {
      e.preventDefault();
      setCurrentPage('about');
      setActiveSection('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (text === "Start") {
      e.preventDefault();
      onReset();
    } else if (target.startsWith('#')) {
      e.preventDefault();
      setActiveSection(target);
      
      if (currentPage !== 'home') {
        setCurrentPage('home');
        // Wait for Home page to remount, then scroll
        setTimeout(() => {
          const element = document.querySelector(target);
          if (element) {
            const offset = 80;
            const elementRect = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementRect - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            window.location.hash = target;
          }
        }, 300);
      } else {
        const element = document.querySelector(target);
        if (element) {
          const offset = 80;
          const elementRect = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementRect - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          window.location.hash = target;
        }
      }
    }
  };

  return (
    <div className="relative">
      <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ${
        darkMode ? 'bg-[#02040a]/40 border-b border-white/5' : 'bg-white/80 border-b border-gray-100'
      } backdrop-blur-xl shadow-lg`}>
        {/* Integrated Scroll Progress Loading Bar */}
        <motion.div
           className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00f0ff] via-blue-500 to-[#bb86fc] origin-left z-50 shadow-[0_2px_10px_rgba(0,240,255,0.4)]"
           style={{ scaleX }}
        />
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-40">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 shadow-lg ${darkMode ? 'bg-[#1a1a1a] border-white/10 group-hover:border-[#00f0ff]/50' : 'bg-blue-600 border-blue-400'
              } border`}>
              <ScanLine className={`w-5 h-5 text-white transition-colors relative z-10`} />
            </div>
            <h1 className={`text-xl font-bold tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Scan-to-Excel
            </h1>
          </motion.div>

          {/* Navigation capsule */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`hidden md:flex items-center gap-1 px-1.5 py-1.5 rounded-full border backdrop-blur-xl shadow-2xl transition-all duration-500 ${darkMode ? 'bg-[#0a0a0a]/90 border-white/5' : 'bg-white/90 border-gray-200'
              }`}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.text}
                icon={item.icon}
                text={item.text}
                target={item.target}
                darkMode={darkMode}
                onClick={(e) => handleNavClick(e, item.target, item.text)}
                active={activeSection === item.target}
              />
            ))}
          </motion.nav>

          <div className="flex items-center gap-8">
            {/* UPAY Official Logo (Using the provided high-res image) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="flex flex-col items-end leading-none">
                <span className={`text-[7px] font-bold uppercase tracking-widest ${darkMode ? 'text-white/20' : 'text-gray-400'}`}>Integrally</span>
                <span className={`text-[9px] font-black uppercase tracking-tighter ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Powered by</span>
              </div>
              <div className={`p-1 rounded-lg transition-all ${darkMode ? 'bg-white/5 border border-white/5 group-hover:border-white/20' : 'bg-white border border-gray-100 group-hover:border-gray-200'}`}>
                <img 
                  src="/upay-logo.png" 
                  alt="UPAY Logo" 
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </div>
            </motion.div>

            {/* Theme Toggle Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${darkMode
                    ? 'bg-[#151515] border-white/5 hover:border-yellow-500/50'
                    : 'bg-white border-gray-200 hover:border-blue-500 shadow-sm'
                  }`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-600" />}
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Content (Only Home) - Added mt-20 to clear fixed header */}
      {currentPage === 'home' && (
        <div className="relative pt-48 pb-20 text-center z-10">
          {/* Animated Background Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr ${darkMode ? 'from-[#00f0ff]/20 via-[#bb86fc]/10' : 'from-blue-200/30 via-indigo-100/30'} to-transparent blur-[120px] -z-10 rounded-full`}
          ></motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-gray-900'} drop-shadow-2xl`}
          >
            Transform Documents <br className="hidden md:block" />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${darkMode ? 'from-gray-200 via-white to-gray-400' : 'from-gray-600 via-gray-900 to-gray-600'}`}>into Structured</span>
            <span className={`inline-block mx-2 text-transparent bg-clip-text bg-gradient-to-r ${darkMode ? 'from-[#00f0ff] to-[#bb86fc] neon-text-glow' : 'from-blue-600 to-indigo-600'}`}>Data</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={`${darkMode ? 'text-white/50' : 'text-gray-500'} text-lg md:text-xl max-w-2xl mx-auto mb-12 px-4 font-light leading-relaxed`}
          >
            Harness the power of AI to convert physical forms, invoices, and documents into clean Excel spreadsheets instantly with zero configuration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <button
              onClick={onReset}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00f0ff] to-[#bb86fc] rounded-full font-bold text-lg text-white shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all flex items-center justify-center gap-3 overflow-hidden active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                Get Started <Rocket size={18} />
              </span>
            </button>

            <button
              onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
              className={`w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 border active:scale-95 ${darkMode
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 flex'
                }`}
            >
              Features <Layout size={18} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const NavLink = ({ icon, text, target, darkMode, onClick, active }) => (
  <a
    href={target}
    onClick={(e) => onClick(e)}
    className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full transition-all duration-300 ${active
        ? darkMode ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
        : darkMode
          ? 'text-white/40 hover:text-white hover:bg-white/5'
          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
      }`}
  >
    {icon}
    <span>{text}</span>
  </a>
);

export default Header;
