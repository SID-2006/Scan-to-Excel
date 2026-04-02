import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ProcessingTimeline from './components/ProcessingTimeline';
import DocumentPreview from './components/DocumentPreview';
import ExportSection from './components/ExportSection';
import FeaturesSection from './components/FeaturesSection';
import BlogSection from './components/BlogSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import AboutPage from './components/AboutPage';
import BlogPage from './components/BlogPage';
import NeuralNetworkBackground from './components/NeuralNetworkBackground';
import Footer from './components/Footer';
import './App.css';

// Port 5000 is occupied by AirTunes on some macOS setups, so backend defaults to 5001.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5001';

function App() {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);

  // Scroll Progress logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setTableData(null);
    setError(null);
    setCurrentStep(0);
    
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile) => {
    setIsProcessing(true);
    setCurrentStep(1); // Image Processing
    
    // Simulate initial steps for visual feedback
    setTimeout(() => setCurrentStep(2), 1000); // Table Detection
    setTimeout(() => setCurrentStep(3), 2000); // OCR extraction
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCurrentStep(4); // Excel Generation Complete
      setTableData(response.data.data);
      setIsProcessing(false);
      
      // Delay hide timeline
      setTimeout(() => setCurrentStep(0), 2000);
      
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.response?.data?.error || 'Failed to process document. Make sure the backend is running.');
      setIsProcessing(false);
      setCurrentStep(0);
    }
  };

  const handleDataChange = (newData) => {
    setTableData(newData);
  };

  const handleDownload = async () => {
    if (!tableData) return;
    
    setIsDownloading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/download`, { data: tableData }, {
        responseType: 'blob', // Important for file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'extracted_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Failed to download Excel file.');
    } finally {
      setIsDownloading(false);
    }
  };

  const showBlogPost = (title) => {
    setSelectedBlogPost(title);
    setCurrentPage('blog-detail');
  };

  const resetApp = () => {
    setFile(null);
    setTableData(null);
    setCurrentStep(0);
    setIsProcessing(false);
    setIsDownloading(false);
    setError(null);
    setCurrentPage('home');
    setSelectedBlogPost(null);
    
    setTimeout(() => {
      const element = document.getElementById('start');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 10);
  };

  return (
    <div className={`App ${darkMode ? 'dark text-white' : 'text-gray-900'} min-h-screen transition-colors duration-500 overflow-x-hidden bg-transparent`}>
      {/* Global AI Neural Network Background */}
      <NeuralNetworkBackground darkMode={darkMode} />
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        setCurrentPage={setCurrentPage} 
        currentPage={currentPage}
        scaleX={scaleX}
        onReset={resetApp}
      />
      
      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.main 
             key="home"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.5 }}
             className="pb-24 pt-8"
          >
          {/* Error Banner */}
          {error && (
            <div className="max-w-4xl mx-auto px-6 mb-8">
              <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <div id="start">
            <UploadSection onFileSelect={handleFileSelect} darkMode={darkMode} />
          </div>

          {/* Processing Timeline appears immediately after upload */}
          {(isProcessing || currentStep > 0) && (
             <ProcessingTimeline currentStep={currentStep} isProcessing={isProcessing} darkMode={darkMode} />
          )}

          {/* Data Preview and Correction Section now also appears after upload area for unified workflow */}
          {!isProcessing && tableData && (
            <>
              <DocumentPreview 
                file={file} 
                tableData={tableData} 
                onDataChange={handleDataChange} 
                darkMode={darkMode}
              />
              <ExportSection 
                onDownload={handleDownload} 
                isDownloading={isDownloading} 
                darkMode={darkMode}
              />
            </>
          )}
          
          <div id="features">
            <FeaturesSection darkMode={darkMode} />
          </div>
          
          <div id="blog">
            <BlogSection darkMode={darkMode} onShowPost={showBlogPost} />
          </div>
          
          <div id="about">
            <AboutSection darkMode={darkMode} />
          </div>
          
          <div id="contact">
            <ContactSection darkMode={darkMode} />
          </div>
        </motion.main>
      ) : currentPage === 'about' ? (
        <AboutPage 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          onBack={resetApp} 
        />
      ) : (
        <BlogPage 
           postTitle={selectedBlogPost}
           darkMode={darkMode}
           onBack={() => setCurrentPage('home')}
        />
      )}
      </AnimatePresence>
      <Footer 
        darkMode={darkMode} 
        setCurrentPage={setCurrentPage} 
        onReset={resetApp} 
      />

      {/* Decorative dark mode/neon grid layer fixed in background */}
      <div className="fixed inset-0 pointer-events-none -z-20 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
    </div>
  );
}

export default App;
