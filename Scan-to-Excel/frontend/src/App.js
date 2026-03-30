import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ProcessingTimeline from './components/ProcessingTimeline';
import DocumentPreview from './components/DocumentPreview';
import ExportSection from './components/ExportSection';
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

  return (
    <div className="App dark min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      
      <main className="pb-24 pt-8">
        {/* Error Banner */}
        {error && (
          <div className="max-w-4xl mx-auto px-6 mb-8">
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <UploadSection onFileSelect={handleFileSelect} />
        
        {/* Processing Timeline shows during upload and processing */}
        {(isProcessing || currentStep > 0) && (
           <ProcessingTimeline currentStep={currentStep} isProcessing={isProcessing} />
        )}

        {/* Data Preview and Correction Section */}
        {!isProcessing && tableData && (
          <>
            <DocumentPreview 
              file={file} 
              tableData={tableData} 
              onDataChange={handleDataChange} 
            />
            <ExportSection 
              onDownload={handleDownload} 
              isDownloading={isDownloading} 
            />
          </>
        )}
      </main>

      {/* Decorative dark mode/neon grid layer fixed in background */}
      <div className="fixed inset-0 pointer-events-none -z-20 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
    </div>
  );
}

export default App;
